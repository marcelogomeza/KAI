import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as userService from './users.service';
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'hr', 'auditor', 'user', 'revisor']),
    orgRole: z.string(),
});

const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['admin', 'hr', 'auditor', 'user', 'revisor']).optional(),
    orgRole: z.string().optional(),
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
        const { name, email, password, role, orgRole } = createUserSchema.parse(req.body);
        const result = await userService.createUser(tenantId, { name, email, passwordPlain: password, role, orgRole });
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
        const result = await userService.updateUser(tenantId, userId, {
            ...data,
            passwordPlain: data.password
        });
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
