import { Request } from 'express';

export interface JwtPayload {
    userId: string;
    tenantId: string;
    role: 'admin' | 'revisor' | 'usuario';
}

export interface AuthRequest extends Request {
    user?: JwtPayload;
}
