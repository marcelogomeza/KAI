import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as settingsService from './settings.service';
import { Storage } from '@google-cloud/storage';
import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';
import axios from 'axios';

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

            // Fix potential newline escaping and quotes wrapper that cause DECODER routines errors
            let privateKey = gcp_private_key.replace(/^"|"$/g, '');
            privateKey = privateKey.split('\\n').join('\n');

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
        } else if (provider === 'aws_s3') {
            const { aws_access_key, aws_secret_key, aws_region, aws_bucket_name } = req.body;

            if (!aws_access_key || !aws_secret_key || !aws_region || !aws_bucket_name) {
                return res.json({ success: false, message: 'Faltan credenciales de AWS S3' });
            }

            const client = new S3Client({
                region: aws_region,
                credentials: {
                    accessKeyId: aws_access_key,
                    secretAccessKey: aws_secret_key
                }
            });

            try {
                const command = new HeadBucketCommand({ Bucket: aws_bucket_name });
                await client.send(command);
                return res.json({ success: true, message: 'Conexión a AWS S3 probada con éxito. El bucket existe y es accesible.' });
            } catch (err: any) {
                console.error('AWS S3 Test Error:', err);
                return res.json({ success: false, message: `Error de conexión AWS S3: ${err.message}` });
            }
        } else if (provider === 'onedrive') {
            const { onedrive_client_id, onedrive_client_secret, onedrive_tenant_id } = req.body;

            if (!onedrive_client_id || !onedrive_client_secret || !onedrive_tenant_id) {
                return res.json({ success: false, message: 'Faltan credenciales principales de OneDrive / Entra ID' });
            }

            try {
                const params = new URLSearchParams();
                params.append('client_id', onedrive_client_id);
                params.append('client_secret', onedrive_client_secret);
                params.append('scope', 'https://graph.microsoft.com/.default');
                params.append('grant_type', 'client_credentials');

                const tokenResponse = await axios.post(
                    `https://login.microsoftonline.com/${onedrive_tenant_id}/oauth2/v2.0/token`,
                    params.toString(),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }
                );

                if (tokenResponse.data && tokenResponse.data.access_token) {
                    return res.json({ success: true, message: 'Conexión a Microsoft Entra ID probada con éxito. Token de acceso validado.' });
                } else {
                    return res.json({ success: false, message: 'Obtención de token fallida, verifique las credenciales.' });
                }
            } catch (err: any) {
                console.error('OneDrive Test Error:', err.response?.data || err.message);
                return res.json({ success: false, message: `Error al conectar con Microsoft: ${err.response?.data?.error_description || err.message}` });
            }
        }

        return res.json({ success: false, message: `Proveedor desconocido: ${provider}` });
    } catch (error) {
        next(error);
    }
};
