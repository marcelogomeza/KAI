import { StoragePlugin } from './StoragePlugin';
export declare class GoogleDrivePlugin implements StoragePlugin {
    name: string;
    listFiles(): Promise<string[]>;
    uploadString(filename: string, content: string): Promise<boolean>;
    downloadString(filename: string): Promise<string | null>;
}
//# sourceMappingURL=GoogleDrivePlugin.d.ts.map