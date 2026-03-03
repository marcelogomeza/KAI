import { Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../../types';
import * as userService from './users.service';
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'hr', 'auditor', 'user', 'revisor']),
    orgRole: z.string().optional().nullable(),
    jobId: z.string().uuid().optional().nullable(),
});

const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).or(z.literal('')).optional(),
    role: z.enum(['admin', 'hr', 'auditor', 'user', 'revisor']).optional(),
    orgRole: z.string().optional().nullable(),
    jobId: z.string().uuid().optional().nullable(),
});

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const search = req.query.search as string;
        const result = await userService.listUsers(tenantId, search);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const { name, email, password, role, orgRole, jobId } = createUserSchema.parse(req.body);
        const result = await userService.createUser(tenantId, { name, email, passwordPlain: password, role, orgRole: orgRole || '', jobId });
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        next(error);
    }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const userId = req.params.id;
        const data = updateUserSchema.parse(req.body);

        // Clean up data: Remove password if empty (no change), and jobId if empty string
        const { password, ...otherData } = data;
        const updatePayload: any = { ...otherData };

        if (password && password.trim().length >= 6) {
            updatePayload.passwordPlain = password;
        }

        const result = await userService.updateUser(tenantId, userId, updatePayload);
        res.json(result);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        next(error);
    }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const userId = req.params.id;
        await userService.deleteUser(tenantId, userId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const bulkCreate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const content = fs.readFileSync(file.path, 'utf-8');
        const lines = content.split('\n');
        const usersToCreate = [];

        // Skip headers: name,email,password,role,orgRole
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [name, email, password, role, orgRole] = line.split(',');
            if (name && email && password && role) {
                usersToCreate.push({
                    name,
                    email,
                    passwordPlain: password,
                    role: role as any,
                    orgRole
                });
            }
        }

        for (const userData of usersToCreate) {
            await userService.createUser(tenantId, userData);
        }

        // Clean up
        fs.unlinkSync(file.path);

        res.status(201).json({ count: usersToCreate.length });
    } catch (error) {
        next(error);
    }
};
