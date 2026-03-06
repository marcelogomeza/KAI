"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.approveDocument = exports.updateDocument = exports.generateDownloadUrl = exports.listDocuments = exports.uploadDocument = void 0;
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const minio_1 = require("../../storage/minio");
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
const getTenantSettings = async (tenantId) => {
    const records = await db_1.db.select().from(schema_1.settings).where((0, drizzle_orm_1.eq)(schema_1.settings.tenantId, tenantId));
    return records.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
};
const uploadDocument = async (tenantId, userId, file, meta) => {
    const tenantSettings = await getTenantSettings(tenantId);
    const provider = tenantSettings['storage_provider'] || 'local';
    const fileExtension = file.originalname.split('.').pop() || 'pdf';
    // Map type to plural folder names as requested (procesos, procedimientos, guias)
    let folder = meta.type || 'procesos';
    if (folder === 'process')
        folder = 'procesos';
    if (folder === 'procedure')
        folder = 'procedimientos';
    if (folder === 'guide')
        folder = 'guias';
    let storageKey = '';
    if (provider === 'google_cloud') {
        const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = tenantSettings;
        if (!gcp_project_id || !gcp_client_email || !gcp_private_key || !gcp_bucket_name) {
            throw { status: 400, message: 'Google Cloud is selected but credentials are incomplete.' };
        }
        let privateKey = gcp_private_key.replace(/^"|"$/g, '').split('\\n').join('\n');
        const storage = new storage_1.Storage({
            projectId: gcp_project_id,
            credentials: { client_email: gcp_client_email, private_key: privateKey }
        });
        storageKey = `${tenantId}/${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        await storage.bucket(gcp_bucket_name).file(storageKey).save(file.buffer, {
            contentType: file.mimetype,
            resumable: false
        });
    }
    else {
        storageKey = `${tenantId}/${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        // Upload to MinIO (Local)
        await minio_1.minioClient.putObject(minio_1.KAI_BUCKET, storageKey, file.buffer, file.size, { 'Content-Type': file.mimetype });
    }
    // Save to DB
    const [newDoc] = await db_1.db.insert(schema_1.documents).values({
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
exports.uploadDocument = uploadDocument;
const listDocuments = async (tenantId, filterStatus) => {
    if (filterStatus && ['draft', 'approved', 'obsolete'].includes(filterStatus)) {
        return await db_1.db
            .select()
            .from(schema_1.documents)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.tenantId, tenantId), (0, drizzle_orm_1.eq)(schema_1.documents.status, filterStatus)));
    }
    return await db_1.db
        .select()
        .from(schema_1.documents)
        .where((0, drizzle_orm_1.eq)(schema_1.documents.tenantId, tenantId));
};
exports.listDocuments = listDocuments;
const generateDownloadUrl = async (tenantId, docId) => {
    const [doc] = await db_1.db.select().from(schema_1.documents).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.id, docId), (0, drizzle_orm_1.eq)(schema_1.documents.tenantId, tenantId)));
    if (!doc) {
        throw { status: 404, message: 'Document not found' };
    }
    const tenantSettings = await getTenantSettings(tenantId);
    const provider = tenantSettings['storage_provider'] || 'local';
    if (provider === 'google_cloud') {
        const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = tenantSettings;
        let privateKey = gcp_private_key.replace(/^"|"$/g, '').split('\\n').join('\n');
        const storage = new storage_1.Storage({
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
    const url = await minio_1.minioClient.presignedGetObject(minio_1.KAI_BUCKET, doc.storageKey, 3600);
    return url;
};
exports.generateDownloadUrl = generateDownloadUrl;
const updateDocument = async (tenantId, docId, updates) => {
    const [updatedDoc] = await db_1.db.update(schema_1.documents)
        .set({ ...updates, updatedAt: new Date() })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.id, docId), (0, drizzle_orm_1.eq)(schema_1.documents.tenantId, tenantId)))
        .returning();
    return updatedDoc;
};
exports.updateDocument = updateDocument;
const approveDocument = async (tenantId, docId) => {
    const [approvedDoc] = await db_1.db.update(schema_1.documents)
        .set({ status: 'approved', updatedAt: new Date() })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.id, docId), (0, drizzle_orm_1.eq)(schema_1.documents.tenantId, tenantId)))
        .returning();
    return approvedDoc;
};
exports.approveDocument = approveDocument;
const deleteDocument = async (tenantId, docId) => {
    // First get the document to know its storage key
    const [doc] = await db_1.db.select().from(schema_1.documents).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.documents.id, docId), (0, drizzle_orm_1.eq)(schema_1.documents.tenantId, tenantId)));
    if (!doc) {
        throw { status: 404, message: 'Document not found' };
    }
    const tenantSettings = await getTenantSettings(tenantId);
    const provider = tenantSettings['storage_provider'] || 'local';
    if (provider === 'google_cloud') {
        const { gcp_project_id, gcp_client_email, gcp_private_key, gcp_bucket_name } = tenantSettings;
        if (gcp_project_id && gcp_bucket_name) {
            let privateKey = gcp_private_key.replace(/^"|"$/g, '').split('\\n').join('\n');
            const storage = new storage_1.Storage({
                projectId: gcp_project_id,
                credentials: { client_email: gcp_client_email, private_key: privateKey }
            });
            try {
                await storage.bucket(gcp_bucket_name).file(doc.storageKey).delete();
            }
            catch (err) {
                console.error("Failed to delete from GCP", err);
            }
        }
    }
    else {
        // Delete from MinIO
        try {
            await minio_1.minioClient.removeObject(minio_1.KAI_BUCKET, doc.storageKey);
        }
        catch (err) {
            console.error("Failed to delete from MinIO", err);
        }
    }
    // Delete from DB
    await db_1.db.delete(schema_1.documents).where((0, drizzle_orm_1.eq)(schema_1.documents.id, docId));
    return { success: true };
};
exports.deleteDocument = deleteDocument;
