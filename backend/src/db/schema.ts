import { pgTable, uuid, varchar, timestamp, text, integer, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'hr', 'auditor', 'user', 'revisor']);
export const statusEnum = pgEnum('status', ['draft', 'approved', 'obsolete']);

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
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
    id: uuid('id').defaultRandom().primaryKey(),
    tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    originalFilename: text('original_filename').notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    storageKey: text('storage_key').notNull(),
    status: statusEnum('status').default('draft').notNull(),
    uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
