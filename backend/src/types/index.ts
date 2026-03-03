import { Request } from 'express';

export interface JwtPayload {
    userId: string;
    tenantId: string;
    role: 'admin' | 'hr' | 'auditor' | 'user' | 'revisor';
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
    file?: Express.Multer.File;
}
