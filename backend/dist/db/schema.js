"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = exports.jobs = exports.orgUnits = exports.organizationRoles = exports.systemRoles = exports.documents = exports.users = exports.tenants = exports.statusEnum = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roleEnum = (0, pg_core_1.pgEnum)('role', ['admin', 'hr', 'auditor', 'user', 'revisor']);
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['draft', 'approved', 'obsolete']);
exports.tenants = (0, pg_core_1.pgTable)('tenants', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)('slug', { length: 255 }).notNull().unique(),
    plan: (0, pg_core_1.varchar)('plan', { length: 50 }).default('free').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    role: (0, exports.roleEnum)('role').default('user').notNull(),
    orgRole: (0, pg_core_1.varchar)('org_role', { length: 255 }),
    jobId: (0, pg_core_1.uuid)('job_id').references(() => exports.jobs.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.documents = (0, pg_core_1.pgTable)('documents', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    originalFilename: (0, pg_core_1.text)('original_filename').notNull(),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }).notNull(),
    sizeBytes: (0, pg_core_1.integer)('size_bytes').notNull(),
    storageKey: (0, pg_core_1.text)('storage_key').notNull(),
    status: (0, exports.statusEnum)('status').default('draft').notNull(),
    uploadedBy: (0, pg_core_1.uuid)('uploaded_by').references(() => exports.users.id).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.systemRoles = (0, pg_core_1.pgTable)('system_roles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.organizationRoles = (0, pg_core_1.pgTable)('organization_roles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.orgUnits = (0, pg_core_1.pgTable)('org_units', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull().default('unit'), // 'organization', 'unit'
    parentId: (0, pg_core_1.uuid)('parent_id'), // Self-reference to orgUnits.id
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.jobs = (0, pg_core_1.pgTable)('jobs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    unitId: (0, pg_core_1.uuid)('unit_id').references(() => exports.orgUnits.id).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.settings = (0, pg_core_1.pgTable)('settings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)('tenant_id').references(() => exports.tenants.id).notNull(),
    key: (0, pg_core_1.varchar)('key', { length: 255 }).notNull(),
    value: (0, pg_core_1.text)('value').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
