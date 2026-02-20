import { StoragePlugin } from './StoragePlugin';
export declare class S3Plugin implements StoragePlugin {
    name: string;
    listFiles(): Promise<string[]>;
    uploadString(filename: string, content: string): Promise<boolean>;
    downloadString(filename: string): Promise<string | null>;
}
//# sourceMappingURL=S3Plugin.d.ts.map