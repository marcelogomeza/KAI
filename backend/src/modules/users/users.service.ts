import bcrypt from 'bcrypt';
import { db } from '../../db/db';
import { users, jobs } from '../../db/schema';
import { eq, and, ilike, or } from 'drizzle-orm';

const SALT_ROUNDS = 10;

export const listUsers = async (tenantId: string, search?: string) => {
    let whereClause = eq(users.tenantId, tenantId);

    if (search) {
        whereClause = and(
            eq(users.tenantId, tenantId),
            or(
                ilike(users.name, `%${search}%`),
                ilike(users.email, `%${search}%`)
            )
        ) as any;
    }

    return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        orgRole: users.orgRole,
        jobId: users.jobId,
        jobName: jobs.name,
        createdAt: users.createdAt
    })
        .from(users)
        .leftJoin(jobs, eq(users.jobId, jobs.id))
        .where(whereClause);
};

export const createUser = async (tenantId: string, data: {
    name: string;
    email: string;
    passwordPlain: string;
    role: 'admin' | 'hr' | 'auditor' | 'user' | 'revisor';
    orgRole: string;
    jobId?: string | null;
}) => {
    const passwordHash = await bcrypt.hash(data.passwordPlain, SALT_ROUNDS);

    const [newUser] = await db.insert(users).values({
        tenantId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        orgRole: data.orgRole,
        jobId: data.jobId || null
    }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        orgRole: users.orgRole,
        jobId: users.jobId
    });

    return newUser;
};

export const updateUser = async (tenantId: string, userId: string, data: {
    name?: string;
    email?: string;
    passwordPlain?: string;
    role?: 'admin' | 'hr' | 'auditor' | 'user' | 'revisor';
    orgRole?: string | null;
    jobId?: string | null;
}) => {
    const { passwordPlain, ...otherData } = data;
    const updateData: any = { ...otherData };

    if (passwordPlain) {
        updateData.passwordHash = await bcrypt.hash(passwordPlain, SALT_ROUNDS);
    }

    const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            orgRole: users.orgRole,
            jobId: users.jobId
        });

    return updatedUser;
};

export const deleteUser = async (tenantId: string, userId: string) => {
    await db.delete(users).where(and(eq(users.id, userId), eq(users.tenantId, tenantId)));
    return { success: true };
};
