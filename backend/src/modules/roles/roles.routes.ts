import { Router } from 'express';
import * as rolesController from './roles.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// System Roles
router.get('/system', requireAuth, rolesController.getSystemRoles);
router.post('/system', requireAuth, rolesController.createSystemRole);
router.patch('/system/:id', requireAuth, rolesController.updateSystemRole);
router.delete('/system/:id', requireAuth, rolesController.deleteSystemRole);

// Organization Roles
router.get('/organization', requireAuth, rolesController.getOrganizationRoles);
router.post('/organization', requireAuth, rolesController.createOrganizationRole);
router.patch('/organization/:id', requireAuth, rolesController.updateOrganizationRole);
router.delete('/organization/:id', requireAuth, rolesController.deleteOrganizationRole);

export default router;
