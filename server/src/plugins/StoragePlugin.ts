export interface StoragePlugin {
    name: string;
    listFiles(): Promise<string[]>;
    uploadString(filename: string, content: string): Promise<boolean>;
    downloadString(filename: string): Promise<string | null>;
}
