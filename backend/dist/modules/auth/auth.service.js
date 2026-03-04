"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerTenantAndAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_me_in_prod';
const registerTenantAndAdmin = async (tenantName, email, passwordPlain) => {
    // Check if user exists
    const existingUser = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
    if (existingUser.length > 0) {
        throw { status: 400, message: 'Email already in use' };
    }
    const slug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existingTenant = await db_1.db.select().from(schema_1.tenants).where((0, drizzle_orm_1.eq)(schema_1.tenants.slug, slug)).limit(1);
    if (existingTenant.length > 0) {
        throw { status: 400, message: 'Tenant name already exists' };
    }
    const passwordHash = await bcrypt_1.default.hash(passwordPlain, SALT_ROUNDS);
    // Transaction for Tenant + User
    return await db_1.db.transaction(async (tx) => {
        const [newTenant] = await tx.insert(schema_1.tenants).values({
            name: tenantName,
            slug,
        }).returning();
        const [newUser] = await tx.insert(schema_1.users).values({
            tenantId: newTenant.id,
            email,
            passwordHash,
            role: 'admin',
        }).returning();
        return { tenant: newTenant, user: { id: newUser.id, email: newUser.email, role: newUser.role } };
    });
};
exports.registerTenantAndAdmin = registerTenantAndAdmin;
const loginUser = async (email, passwordPlain) => {
    const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
    if (!user) {
        throw { status: 401, message: 'Invalid credentials' };
    }
    const isMatch = await bcrypt_1.default.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials' };
    }
    const payload = {
        userId: user.id,
        tenantId: user.tenantId,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '8h' });
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
exports.loginUser = loginUser;
