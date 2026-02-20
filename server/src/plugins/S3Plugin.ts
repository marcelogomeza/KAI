import { StoragePlugin } from './StoragePlugin';

export class S3Plugin implements StoragePlugin {
    name = 'AWS S3';

    async listFiles(): Promise<string[]> {
        return ['backup-2026-01-01.zip', 'user-upload-72.png'];
    }

    async uploadString(filename: string, content: string): Promise<boolean> {
        console.log(`[AWS S3] Uploaded ${filename} to bucket`);
        return true;
    }

    async downloadString(filename: string): Promise<string | null> {
        return `Simulated content from S3 object: ${filename}`;
    }
}
