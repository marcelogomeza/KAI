"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationRole = exports.updateOrganizationRole = exports.createOrganizationRole = exports.listOrganizationRoles = exports.deleteSystemRole = exports.updateSystemRole = exports.createSystemRole = exports.listSystemRoles = void 0;
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// System Roles
const listSystemRoles = async (tenantId) => {
    return await db_1.db.select().from(schema_1.systemRoles).where((0, drizzle_orm_1.eq)(schema_1.systemRoles.tenantId, tenantId));
};
exports.listSystemRoles = listSystemRoles;
const createSystemRole = async (tenantId, data) => {
    const [role] = await db_1.db.insert(schema_1.systemRoles).values({
        tenantId,
        ...data
    }).returning();
    return role;
};
exports.createSystemRole = createSystemRole;
const updateSystemRole = async (tenantId, roleId, data) => {
    const [role] = await db_1.db.update(schema_1.systemRoles)
        .set(data)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.systemRoles.id, roleId), (0, drizzle_orm_1.eq)(schema_1.systemRoles.tenantId, tenantId)))
        .returning();
    return role;
};
exports.updateSystemRole = updateSystemRole;
const deleteSystemRole = async (tenantId, roleId) => {
    await db_1.db.delete(schema_1.systemRoles).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.systemRoles.id, roleId), (0, drizzle_orm_1.eq)(schema_1.systemRoles.tenantId, tenantId)));
    return { success: true };
};
exports.deleteSystemRole = deleteSystemRole;
// Organization Roles
const listOrganizationRoles = async (tenantId) => {
    return await db_1.db.select().from(schema_1.organizationRoles).where((0, drizzle_orm_1.eq)(schema_1.organizationRoles.tenantId, tenantId));
};
exports.listOrganizationRoles = listOrganizationRoles;
const createOrganizationRole = async (tenantId, data) => {
    const [role] = await db_1.db.insert(schema_1.organizationRoles).values({
        tenantId,
        name: data.name,
        permissions: data.permissions || {}
    }).returning();
    return role;
};
exports.createOrganizationRole = createOrganizationRole;
const updateOrganizationRole = async (tenantId, roleId, data) => {
    const updateData = {};
    if (data.name !== undefined)
        updateData.name = data.name;
    if (data.permissions !== undefined)
        updateData.permissions = data.permissions;
    const [role] = await db_1.db.update(schema_1.organizationRoles)
        .set(updateData)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizationRoles.id, roleId), (0, drizzle_orm_1.eq)(schema_1.organizationRoles.tenantId, tenantId)))
        .returning();
    return role;
};
exports.updateOrganizationRole = updateOrganizationRole;
const deleteOrganizationRole = async (tenantId, roleId) => {
    await db_1.db.delete(schema_1.organizationRoles).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.organizationRoles.id, roleId), (0, drizzle_orm_1.eq)(schema_1.organizationRoles.tenantId, tenantId)));
    return { success: true };
};
exports.deleteOrganizationRole = deleteOrganizationRole;
