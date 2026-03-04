"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreate = exports.remove = exports.update = exports.create = exports.getUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const userService = __importStar(require("./users.service"));
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['admin', 'hr', 'auditor', 'user', 'revisor']),
    orgRole: zod_1.z.string().optional().nullable(),
    jobId: zod_1.z.string().uuid().optional().nullable(),
});
const updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).or(zod_1.z.literal('')).optional(),
    role: zod_1.z.enum(['admin', 'hr', 'auditor', 'user', 'revisor']).optional(),
    orgRole: zod_1.z.string().optional().nullable(),
    jobId: zod_1.z.string().uuid().optional().nullable(),
});
const getUsers = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const search = req.query.search;
        const result = await userService.listUsers(tenantId, search);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const create = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const { name, email, password, role, orgRole, jobId } = createUserSchema.parse(req.body);
        const result = await userService.createUser(tenantId, { name, email, passwordPlain: password, role, orgRole: orgRole || '', jobId });
        res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        next(error);
    }
};
exports.create = create;
const update = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const userId = req.params.id;
        const data = updateUserSchema.parse(req.body);
        // Clean up data: Remove password if empty (no change), and jobId if empty string
        const { password, ...otherData } = data;
        const updatePayload = { ...otherData };
        if (password && password.trim().length >= 6) {
            updatePayload.passwordPlain = password;
        }
        const result = await userService.updateUser(tenantId, userId, updatePayload);
        res.json(result);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const userId = req.params.id;
        await userService.deleteUser(tenantId, userId);
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
const bulkCreate = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const content = fs_1.default.readFileSync(file.path, 'utf-8');
        const lines = content.split('\n');
        const usersToCreate = [];
        // Skip headers: name,email,password,role,orgRole
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            const [name, email, password, role, orgRole] = line.split(',');
            if (name && email && password && role) {
                usersToCreate.push({
                    name,
                    email,
                    passwordPlain: password,
                    role: role,
                    orgRole
                });
            }
        }
        for (const userData of usersToCreate) {
            await userService.createUser(tenantId, userData);
        }
        // Clean up
        fs_1.default.unlinkSync(file.path);
        res.status(201).json({ count: usersToCreate.length });
    }
    catch (error) {
        next(error);
    }
};
exports.bulkCreate = bulkCreate;
