import { StoragePlugin } from './StoragePlugin';

export class OneDrivePlugin implements StoragePlugin {
    name = 'OneDrive';

    async listFiles(): Promise<string[]> {
        return ['Project_Plan.docx', 'Budget.xlsx'];
    }

    async uploadString(filename: string, content: string): Promise<boolean> {
        console.log(`[OneDrive] Uploaded ${filename}`);
        return true;
    }

    async downloadString(filename: string): Promise<string | null> {
        return `Simulated content from OneDrive file: ${filename}`;
    }
}
