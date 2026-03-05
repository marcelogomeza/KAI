import { pgTable, uuid, varchar, timestamp, text, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'hr', 'auditor', 'user', 'revisor']);
export const statusEnum = pgEnum('status', ['draft', 'approved', 'obsolete']);
export const documentTypeEnum = pgEnum('document_type', ['process', 'procedure', 'guide']);

export const tenants = pgTable('tenants', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    plan: varchar('plan', { length: 50 }).default('free').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').default('user').notNull(),
    orgRole: varchar('org_role', { length: 255 }),
    jobId: uuid('job_id').references(() => jobs.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    code: varchar('code', { length: 50 }),
    name: varchar('name', { length: 255 }).notNull(),
    type: documentTypeEnum('type').notNull().default('process'),
    originalFilename: text('original_filename').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    storageKey: text('storage_key').notNull(),
    status: statusEnum('status').default('draft').notNull(),
    uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
    ownerId: uuid('owner_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const systemRoles = pgTable('system_roles', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizationRoles = pgTable('organization_roles', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    permissions: jsonb('permissions').default({}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orgUnits = pgTable('org_units', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull().default('unit'), // 'organization', 'unit'
    parentId: uuid('parent_id'), // Self-reference to orgUnits.id
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const jobs = pgTable('jobs', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    unitId: uuid('unit_id').references(() => orgUnits.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    key: varchar('key', { length: 255 }).notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
