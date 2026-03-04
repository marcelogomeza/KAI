import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as settingsService from './settings.service';
import { Storage } from '@google-cloud/storage';

export const getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const result = await settingsService.getSettings(tenantId);

        // Convert to key-value object
        const settingsObj = result.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        res.json(settingsObj);
    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const settingsUpdate = req.body;

        if (typeof settingsUpdate !== 'object' || Array.isArray(settingsUpdate)) {
            return res.status(400).json({ error: 'Body must be an object of key-value pairs' });
        }

        const result = await settingsService.updateSettings(tenantId, settingsUpdate as Record<string, string>);

        const settingsObj = result.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        res.json(settingsObj);
    } catch (error) {
        next(error);
    }
};

export const testConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const provider = req.body.provider;
        if (!provider) {
            return res.status(400).json({ success: false, message: 'Provider missing' });
        }

        if (provider === 'google_cloud') {
            const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = req.body;

            if (!gcp_project_id || !gcp_client_email || !gcp_private_key || !gcp_bucket_name) {
                return res.json({ success: false, message: 'Faltan credenciales de Google Cloud' });
            }

            // Fix potential newline escaping
            const privateKey = gcp_private_key.replace(/\\n/g, '\n');

            const storage = new Storage({
                projectId: gcp_project_id,
                credentials: {
                    client_email: gcp_client_email,
                    private_key: privateKey,
                }
            });

            try {
                // Test if the bucket exists. The exists() method throws or returns false if cannot access
                const [exists] = await storage.bucket(gcp_bucket_name).exists();
                if (exists) {
                    return res.json({ success: true, message: 'Conexión a Google Cloud Storage probada con éxito. El bucket existe y es accesible.' });
                } else {
                    return res.json({ success: false, message: 'El bucket no existe en el proyecto especificado.' });
                }
            } catch (err: any) {
                console.error('GCP Test Error:', err);
                return res.json({ success: false, message: `Error de conexión GCP: ${err.message}` });
            }
        }

        // Mock response for other providers
        res.json({ success: true, message: `Conexión a ${provider} probada con éxito (simulado).` });
    } catch (error) {
        next(error);
    }
};
