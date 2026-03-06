import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as documentsService from './documents.service';

export const upload = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const user = req.user!;
        const status = (req.body.status as 'draft' | 'approved' | 'obsolete') || 'draft';
        const type = (req.body.type as 'process' | 'procedure' | 'guide') || 'process';
        const code = req.body.code as string;
        const name = req.body.name as string;
        const ownerId = req.body.ownerId as string || user.userId;

        const document = await documentsService.uploadDocument(
            user.tenantId,
            user.userId,
            req.file,
            { code, name, type, status, ownerId }
        );

        res.status(201).json(document);
    } catch (error) {
        next(error);
    }
};

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { status } = req.query;

        const docs = await documentsService.listDocuments(
            user.tenantId,
            status as string | undefined
        );

        res.json(docs);
    } catch (error) {
        next(error);
    }
};

export const getDownloadUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const url = await documentsService.generateDownloadUrl(user.tenantId, req.params.id);
        res.json({ url });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { code, name, type, ownerId } = req.body;
        const doc = await documentsService.updateDocument(user.tenantId, req.params.id, { code, name, type, ownerId });
        res.json(doc);
    } catch (error) {
        next(error);
    }
};

export const approve = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const doc = await documentsService.approveDocument(user.tenantId, req.params.id);
        res.json(doc);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        await documentsService.deleteDocument(user.tenantId, req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
