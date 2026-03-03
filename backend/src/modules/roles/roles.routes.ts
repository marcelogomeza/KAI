import { Router } from 'express';
import * as rolesController from './roles.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// System Roles
router.get('/system', authenticate, rolesController.getSystemRoles);
router.post('/system', authenticate, rolesController.createSystemRole);
router.patch('/system/:id', authenticate, rolesController.updateSystemRole);
router.delete('/system/:id', authenticate, rolesController.deleteSystemRole);

// Organization Roles
router.get('/organization', authenticate, rolesController.getOrganizationRoles);
router.post('/organization', authenticate, rolesController.createOrganizationRole);
router.patch('/organization/:id', authenticate, rolesController.updateOrganizationRole);
router.delete('/organization/:id', authenticate, rolesController.deleteOrganizationRole);

export default router;
