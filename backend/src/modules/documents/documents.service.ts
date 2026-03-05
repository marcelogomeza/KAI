import { db } from '../../db/db';
import { documents } from '../../db/schema';
import { minioClient, KAI_BUCKET } from '../../storage/minio';
import { v4 as uuidv4 } from 'uuid';
import { eq, and } from 'drizzle-orm';

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
    const fileExtension = file.originalname.split('.').pop();
    const storageKey = `${tenantId}/${uuidv4()}.${fileExtension}`;

    // Upload to MinIO
    await minioClient.putObject(
        KAI_BUCKET,
        storageKey,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
    );

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
