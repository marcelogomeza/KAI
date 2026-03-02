import * as Minio from 'minio';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
    secretKey: process.env.MINIO_SECRET_KEY || 'password123',
});

export const KAI_BUCKET = process.env.MINIO_BUCKET || 'kai-documents';

export const initMinio = async () => {
    try {
        const exists = await minioClient.bucketExists(KAI_BUCKET);
        if (!exists) {
            await minioClient.makeBucket(KAI_BUCKET, 'us-east-1');
            console.log(`Bucket ${KAI_BUCKET} created successfully`);
        }
    } catch (error) {
        console.error('Error initializing MinIO bucket:', error);
    }
};
