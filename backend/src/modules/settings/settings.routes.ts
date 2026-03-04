import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import * as settingsController from './settings.controller';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['admin']));

router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateSettings);
router.post('/test', settingsController.testConnection);

export default router;
