import { Response, NextFunction } from 'express';
import { db } from '../db/db';
import { users, organizationRoles, documents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../types';

export const requireDocPermission = (action: 'create' | 'update' | 'delete' | 'approve') => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized: No user session' });
            }

            // System admins bypass this check or at least hr/admin
            if (req.user.role === 'admin') {
                return next();
            }

            // Fetch the user to get current orgRole
            const [currentUser] = await db.select().from(users).where(eq(users.id, req.user.userId));
            if (!currentUser || !currentUser.orgRole) {
                return res.status(403).json({ error: 'Forbidden: No organization role assigned' });
            }

            // Fetch permissions for the user's orgRole
            // We assume orgRole holds the id of organizationRoles
            const [orgRoleRecord] = await db.select().from(organizationRoles).where(eq(organizationRoles.id, currentUser.orgRole));

            if (!orgRoleRecord || !orgRoleRecord.permissions) {
                return res.status(403).json({ error: 'Forbidden: Invalid organization role or no permissions set' });
            }

            const permissions = orgRoleRecord.permissions as any;

            // Determine document type
            let docType: 'process' | 'procedure' | 'guide' = 'process';

            if (req.method === 'POST') {
                // When uploading, type should be in req.body
                docType = (req.body.type as 'process' | 'procedure' | 'guide') || 'process';
            } else if (req.params.id) {
                // For PUT, DELETE, PATCH, we should fetch the document's type first
                const [targetDoc] = await db.select({ type: documents.type }).from(documents).where(eq(documents.id, req.params.id));
                if (!targetDoc) {
                    return res.status(404).json({ error: 'Document not found' });
                }
                docType = targetDoc.type;
            }

            // Check the action
            const typePermissions = permissions[docType] || {};
            if (!typePermissions[action]) {
                return res.status(403).json({ error: `Forbidden: You do not have permission to ${action} ${docType}s` });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Internal server error during permission check' });
        }
    };
};
