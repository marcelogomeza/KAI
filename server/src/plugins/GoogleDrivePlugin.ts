import { StoragePlugin } from './StoragePlugin';

export class GoogleDrivePlugin implements StoragePlugin {
    name = 'Google Drive';

    async listFiles(): Promise<string[]> {
        return ['Architecture_Doc.gdoc', 'Q3_Review_Notes.gdoc'];
    }

    async uploadString(filename: string, content: string): Promise<boolean> {
        console.log(`[GoogleDrive] Uploaded ${filename}`);
        return true;
    }

    async downloadString(filename: string): Promise<string | null> {
        return `Simulated content from Google Drive file: ${filename}`;
    }
}
