import bcrypt from 'bcrypt';
import { db } from '../../db/db';
import { users } from '../../db/schema';
import { eq, and, ilike, or } from 'drizzle-orm';

const SALT_ROUNDS = 10;

export const listUsers = async (tenantId: string, search?: string) => {
    let query = db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        orgRole: users.orgRole,
        createdAt: users.createdAt
    }).from(users).where(eq(users.tenantId, tenantId));

    if (search) {
        query = db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            orgRole: users.orgRole,
            createdAt: users.createdAt
        }).from(users).where(
            and(
                eq(users.tenantId, tenantId),
                or(
                    ilike(users.name, `%${search}%`),
                    ilike(users.email, `%${search}%`)
                )
            )
        );
    }

    return await query;
};

export const createUser = async (tenantId: string, data: {
    name: string;
    email: string;
    passwordPlain: string;
    role: 'admin' | 'hr' | 'auditor' | 'user' | 'revisor';
    orgRole: string;
}) => {
    const passwordHash = await bcrypt.hash(data.passwordPlain, SALT_ROUNDS);

    const [newUser] = await db.insert(users).values({
        tenantId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        orgRole: data.orgRole
    }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        orgRole: users.orgRole
    });

    return newUser;
};

export const updateUser = async (tenantId: string, userId: string, data: {
    name?: string;
    email?: string;
    passwordPlain?: string;
    role?: 'admin' | 'hr' | 'auditor' | 'user' | 'revisor';
    orgRole?: string;
}) => {
    const updateData: any = { ...data };

    if (data.passwordPlain) {
        updateData.passwordHash = await bcrypt.hash(data.passwordPlain, SALT_ROUNDS);
        delete updateData.passwordPlain;
    }

    const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            orgRole: users.orgRole
        });

    return updatedUser;
};

export const deleteUser = async (tenantId: string, userId: string) => {
    await db.delete(users).where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));
    return { success: true };
};
