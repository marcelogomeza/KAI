export type Role = 'admin' | 'hr' | 'auditor' | 'user' | 'revisor';
export type DocumentStatus = 'draft' | 'approved' | 'obsolete';

export interface User {
    id: string;
    email: string;
    name?: string;
    role: Role;
    tenantId: string;
    orgRole?: string;
    jobId?: string;
    jobName?: string;
    createdAt?: string;
}

export interface Document {
    id: string;
    code?: string;
    type?: string;
    tenantId: string;
    name: string;
    referenceDescription?: string;
    area?: string;
    linkedProcess?: string;
    confidentiality?: string;
    expirationDate?: string;
    approver?: string;
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
    status: DocumentStatus;
    uploadedBy: string;
    ownerId?: string;
    createdAt: string;
    updatedAt: string;
}
