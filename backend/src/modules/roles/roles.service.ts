import { db } from '../../db/db';
import { systemRoles, organizationRoles } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

// System Roles
export const listSystemRoles = async (tenantId: string) => {
    return await db.select().from(systemRoles).where(eq(systemRoles.tenantId, tenantId));
};

export const createSystemRole = async (tenantId: string, data: { name: string; code: string }) => {
    const [role] = await db.insert(systemRoles).values({
        tenantId,
        ...data
    }).returning();
    return role;
};

export const updateSystemRole = async (tenantId: string, roleId: string, data: { name: string; code: string }) => {
    const [role] = await db.update(systemRoles)
        .set(data)
        .where(and(eq(systemRoles.id, roleId), eq(systemRoles.tenantId, tenantId)))
        .returning();
    return role;
};

export const deleteSystemRole = async (tenantId: string, roleId: string) => {
    await db.delete(systemRoles).where(and(eq(systemRoles.id, roleId), eq(systemRoles.tenantId, tenantId)));
    return { success: true };
};

// Organization Roles
export const listOrganizationRoles = async (tenantId: string) => {
    return await db.select().from(organizationRoles).where(eq(organizationRoles.tenantId, tenantId));
};

export const createOrganizationRole = async (tenantId: string, data: { name: string, permissions?: any }) => {
    const [role] = await db.insert(organizationRoles).values({
        tenantId,
        name: data.name,
        permissions: data.permissions || {}
    }).returning();
    return role;
};

export const updateOrganizationRole = async (tenantId: string, roleId: string, data: { name?: string, permissions?: any }) => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.permissions !== undefined) updateData.permissions = data.permissions;

    const [role] = await db.update(organizationRoles)
        .set(updateData)
        .where(and(eq(organizationRoles.id, roleId), eq(organizationRoles.tenantId, tenantId)))
        .returning();
    return role;
};

export const deleteOrganizationRole = async (tenantId: string, roleId: string) => {
    await db.delete(organizationRoles).where(and(eq(organizationRoles.id, roleId), eq(organizationRoles.tenantId, tenantId)));
    return { success: true };
};
