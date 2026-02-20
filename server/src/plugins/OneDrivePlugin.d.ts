import { StoragePlugin } from './StoragePlugin';
export declare class OneDrivePlugin implements StoragePlugin {
    name: string;
    listFiles(): Promise<string[]>;
    uploadString(filename: string, content: string): Promise<boolean>;
    downloadString(filename: string): Promise<string | null>;
}
//# sourceMappingURL=OneDrivePlugin.d.ts.map