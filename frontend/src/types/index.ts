export type Role = 'admin' | 'revisor' | 'usuario';
export type DocumentStatus = 'draft' | 'approved' | 'obsolete';

export interface User {
    id: string;
    email: string;
    role: Role;
    tenantId: string;
}

export interface Document {
    id: string;
    tenantId: string;
    name: string;
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
    status: DocumentStatus;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
}
