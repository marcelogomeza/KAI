"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireDocPermission = void 0;
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const requireDocPermission = (action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized: No user session' });
            }
            // System admins bypass this check or at least hr/admin
            if (req.user.role === 'admin') {
                return next();
            }
            // Fetch the user to get current orgRole
            const [currentUser] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, req.user.userId));
            if (!currentUser || !currentUser.orgRole) {
                return res.status(403).json({ error: 'Forbidden: No organization role assigned' });
            }
            // Fetch permissions for the user's orgRole by name since it's saved as a string in UsersPage
            const [orgRoleRecord] = await db_1.db.select().from(schema_1.organizationRoles).where((0, drizzle_orm_1.eq)(schema_1.organizationRoles.name, currentUser.orgRole));
            if (!orgRoleRecord || !orgRoleRecord.permissions) {
                return res.status(403).json({ error: 'Forbidden: Invalid organization role or no permissions set' });
            }
            const permissions = orgRoleRecord.permissions;
            // Determine document type
            let docType = 'Mapa de procesos';
            if (req.method === 'POST') {
                // When uploading, type should be in req.body
                docType = req.body.type || 'Mapa de procesos';
            }
            else if (req.params.id) {
                // For PUT, DELETE, PATCH, we should fetch the document's type first
                const [targetDoc] = await db_1.db.select({ type: schema_1.documents.type }).from(schema_1.documents).where((0, drizzle_orm_1.eq)(schema_1.documents.id, req.params.id));
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
        }
        catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Internal server error during permission check' });
        }
    };
};
exports.requireDocPermission = requireDocPermission;
