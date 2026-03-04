"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDocuments = exports.uploadDocument = void 0;
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const minio_1 = require("../../storage/minio");
const uuid_1 = require("uuid");
const drizzle_orm_1 = require("drizzle-orm");
const uploadDocument = async (tenantId, userId, file, status = 'draft') => {
    const fileExtension = file.originalname.split('.').pop();
    const storageKey = `${tenantId}/${(0, uuid_1.v4)()}.${fileExtension}`;
    // Upload to MinIO
    await minio_1.minioClient.putObject(minio_1.KAI_BUCKET, storageKey, file.buffer, file.size, { 'Content-Type': file.mimetype });
    // Save to DB
    const [newDoc] = await db_1.db.insert(schema_1.documents).values({
        tenantId,
        name: file.originalname,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey,
        status,
        uploadedBy: userId,
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
