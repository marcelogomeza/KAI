"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.approveDocument = exports.updateDocument = exports.listDocuments = exports.uploadDocument = void 0;
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const minio_1 = require("../../storage/minio");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
const uploadDocument = async (tenantId, userId, file, meta) => {
    const fileExtension = file.originalname.split('.').pop();
    const storageKey = `${tenantId}/${(0, uuid_1.v4)()}.${fileExtension}`;
    // Upload to MinIO
    await minio_1.minioClient.putObject(minio_1.KAI_BUCKET, storageKey, file.buffer, file.size, { 'Content-Type': file.mimetype });
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
    // Delete from MinIO
    await minio_1.minioClient.removeObject(minio_1.KAI_BUCKET, doc.storageKey);
    // Delete from DB
    await db_1.db.delete(schema_1.documents).where((0, drizzle_orm_1.eq)(schema_1.documents.id, docId));
    return { success: true };
};
exports.deleteDocument = deleteDocument;
