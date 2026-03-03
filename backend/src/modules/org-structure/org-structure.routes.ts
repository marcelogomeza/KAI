import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as orgController from './org-structure.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.use(requireAuth);

router.get('/', orgController.getFullStructure);
router.get('/export', orgController.exportStructure);
router.post('/unit', orgController.createUnit);
router.post('/job', orgController.createPosition);
router.delete('/unit/:id', orgController.removeUnit);
router.delete('/job/:id', orgController.removeJob);
router.post('/bulk', upload.single('file'), orgController.bulkUpload);

export default router;
