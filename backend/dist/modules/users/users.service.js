"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.listUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const SALT_ROUNDS = 10;
const listUsers = async (tenantId, search) => {
    let whereClause = (0, drizzle_orm_1.eq)(schema_1.users.tenantId, tenantId);
    if (search) {
        whereClause = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.tenantId, tenantId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.users.name, `%${search}%`), (0, drizzle_orm_1.ilike)(schema_1.users.email, `%${search}%`)));
    }
    return await db_1.db.select({
        id: schema_1.users.id,
        name: schema_1.users.name,
        email: schema_1.users.email,
        role: schema_1.users.role,
        orgRole: schema_1.users.orgRole,
        jobId: schema_1.users.jobId,
        jobName: schema_1.jobs.name,
        createdAt: schema_1.users.createdAt
    })
        .from(schema_1.users)
        .leftJoin(schema_1.jobs, (0, drizzle_orm_1.eq)(schema_1.users.jobId, schema_1.jobs.id))
        .where(whereClause);
};
exports.listUsers = listUsers;
const createUser = async (tenantId, data) => {
    const passwordHash = await bcrypt_1.default.hash(data.passwordPlain, SALT_ROUNDS);
    const [newUser] = await db_1.db.insert(schema_1.users).values({
        tenantId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        orgRole: data.orgRole,
        jobId: data.jobId || null
    }).returning({
        id: schema_1.users.id,
        name: schema_1.users.name,
        email: schema_1.users.email,
        role: schema_1.users.role,
        orgRole: schema_1.users.orgRole,
        jobId: schema_1.users.jobId
    });
    return newUser;
};
exports.createUser = createUser;
const updateUser = async (tenantId, userId, data) => {
    const { passwordPlain, ...otherData } = data;
    const updateData = { ...otherData };
    if (passwordPlain) {
        updateData.passwordHash = await bcrypt_1.default.hash(passwordPlain, SALT_ROUNDS);
    }
    const [updatedUser] = await db_1.db.update(schema_1.users)
        .set(updateData)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.id, userId), (0, drizzle_orm_1.eq)(schema_1.users.tenantId, tenantId)))
        .returning({
        id: schema_1.users.id,
        name: schema_1.users.name,
        email: schema_1.users.email,
        role: schema_1.users.role,
        orgRole: schema_1.users.orgRole,
        jobId: schema_1.users.jobId
    });
    return updatedUser;
};
exports.updateUser = updateUser;
const deleteUser = async (tenantId, userId) => {
    await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.id, userId), (0, drizzle_orm_1.eq)(schema_1.users.tenantId, tenantId)));
    return { success: true };
};
exports.deleteUser = deleteUser;
