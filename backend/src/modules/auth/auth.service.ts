import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../db/db';
import { users, tenants } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { JwtPayload } from '../../types';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_prod';

export const registerTenantAndAdmin = async (tenantName: string, email: string, passwordPlain: string) => {
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
        throw { status: 400, message: 'Email already in use' };
    }

    const slug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingTenant = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
    if (existingTenant.length > 0) {
        throw { status: 400, message: 'Tenant name already exists' };
    }

    const passwordHash = await bcrypt.hash(passwordPlain, SALT_ROUNDS);

    // Transaction for Tenant + User
    return await db.transaction(async (tx) => {
        const [newTenant] = await tx.insert(tenants).values({
            name: tenantName,
            slug,
        }).returning();

        const [newUser] = await tx.insert(users).values({
            tenantId: newTenant.id,
            email,
            passwordHash,
            role: 'admin',
        }).returning();

        return { tenant: newTenant, user: { id: newUser.id, email: newUser.email, role: newUser.role } };
    });
};

export const loginUser = async (email: string, passwordPlain: string) => {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    const payload: JwtPayload = {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId
        }
    };
};
