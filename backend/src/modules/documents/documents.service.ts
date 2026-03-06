import { db } from '../../db/db';
import { documents, settings } from '../../db/schema';
import { minioClient, KAI_BUCKET } from '../../storage/minio';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';

const getTenantSettings = async (tenantId: string) => {
    const records = await db.select().from(settings).where(eq(settings.tenantId, tenantId));
    return records.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
};

export const uploadDocument = async (
    tenantId: string,
    userId: string,
    file: Express.Multer.File,
    meta: {
        code?: string,
        name: string,
        type: 'process' | 'procedure' | 'guide',
        status?: 'draft' | 'approved' | 'obsolete',
        ownerId?: string,
    }
) => {
    const tenantSettings = await getTenantSettings(tenantId);
    const provider = tenantSettings['storage_provider'] || 'local';

    const fileExtension = file.originalname.split('.').pop() || 'pdf';

    // Map type to plural folder names as requested (procesos, procedimientos, guias)
    let folder: string = meta.type || 'procesos';
    if (folder === 'process') folder = 'procesos';
    if (folder === 'procedure') folder = 'procedimientos';
    if (folder === 'guide') folder = 'guias';

    let storageKey = '';

    if (provider === 'google_cloud') {
        const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = tenantSettings;
        if (!gcp_project_id || !gcp_client_email || !gcp_private_key || !gcp_bucket_name) {
            throw { status: 400, message: 'Google Cloud is selected but credentials are incomplete.' };
        }

        let privateKey = gcp_private_key.replace(/^"|"$/g, '').split('\\n').join('\n');
        const storage = new Storage({
            projectId: gcp_project_id,
            credentials: { client_email: gcp_client_email, private_key: privateKey }
        });

        storageKey = `${tenantId}/${folder}/${uuidv4()}.${fileExtension}`;

        await storage.bucket(gcp_bucket_name).file(storageKey).save(file.buffer, {
            contentType: file.mimetype,
            resumable: false
        });
    } else {
        storageKey = `${tenantId}/${folder}/${uuidv4()}.${fileExtension}`;
        // Upload to MinIO (Local)
        await minioClient.putObject(
            KAI_BUCKET,
            storageKey,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );
    }

    // Save to DB
    const [newDoc] = await db.insert(documents).values({
        tenantId,
        code: meta.code,
        name: meta.name || file.originalname,
        type: meta.type || 'process',
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey,
        status: meta.status || 'draft',
        uploadedBy: userId,
        ownerId: meta.ownerId || userId,
    }).returning();

    return newDoc;
};

export const listDocuments = async (tenantId: string, filterStatus?: string) => {
    if (filterStatus && ['draft', 'approved', 'obsolete'].includes(filterStatus)) {
        return await db
            .select()
            .from(documents)
            .where(and(
                eq(documents.tenantId, tenantId),
                eq(documents.status, filterStatus as 'draft' | 'approved' | 'obsolete')
            ));
    }

    return await db
        .select()
        .from(documents)
        .where(eq(documents.tenantId, tenantId));
};

export const generateDownloadUrl = async (tenantId: string, docId: string) => {
    const [doc] = await db.select().from(documents).where(and(eq(documents.id, docId), eq(documents.tenantId, tenantId)));
    if (!doc) {
        throw { status: 404, message: 'Document not found' };
    }

    const tenantSettings = await getTenantSettings(tenantId);
    const provider = tenantSettings['storage_provider'] || 'local';

    if (provider === 'google_cloud') {
        const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = tenantSettings;
        let privateKey = gcp_private_key.replace(/^"|"$/g, '').split('\\n').join('\n');
        const storage = new Storage({
            projectId: gcp_project_id,
            credentials: { client_email: gcp_client_email, private_key: privateKey }
        });

        const [url] = await storage.bucket(gcp_bucket_name).file(doc.storageKey).getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + 3600 * 1000,
        });
        return url;
    }

    // Default to MinIO
    const url = await minioClient.presignedGetObject(KAI_BUCKET, doc.storageKey, 3600);
    return url;
};

export const updateDocument = async (tenantId: string, docId: string, updates: Partial<{ code: string, name: string, type: 'process' | 'procedure' | 'guide', ownerId: string }>) => {
    const [updatedDoc] = await db.update(documents)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(documents.id, docId), eq(documents.tenantId, tenantId)))
        .returning();
    return updatedDoc;
};

export const approveDocument = async (tenantId: string, docId: string) => {
    const [approvedDoc] = await db.update(documents)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(and(eq(documents.id, docId), eq(documents.tenantId, tenantId)))
        .returning();
    return approvedDoc;
};

export const deleteDocument = async (tenantId: string, docId: string) => {
    // First get the document to know its storage key
    const [doc] = await db.select().from(documents).where(and(eq(documents.id, docId), eq(documents.tenantId, tenantId)));
    if (!doc) {
        throw { status: 404, message: 'Document not found' };
    }

    const tenantSettings = await getTenantSettings(tenantId);
    const provider = tenantSettings['storage_provider'] || 'local';

    if (provider === 'google_cloud') {
        const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = tenantSettings;
        if (gcp_project_id && gcp_bucket_name) {
            let privateKey = gcp_private_key.replace(/^"|"$/g, '').split('\\n').join('\n');
            const storage = new Storage({
                projectId: gcp_project_id,
                credentials: { client_email: gcp_client_email, private_key: privateKey }
            });
            try {
                await storage.bucket(gcp_bucket_name).file(doc.storageKey).delete();
            } catch (err) {
                console.error("Failed to delete from GCP", err);
            }
        }
    } else {
        // Delete from MinIO
        try {
            await minioClient.removeObject(KAI_BUCKET, doc.storageKey);
        } catch (err) {
            console.error("Failed to delete from MinIO", err);
        }
    }

    // Delete from DB
    await db.delete(documents).where(eq(documents.id, docId));
    return { success: true };
};
