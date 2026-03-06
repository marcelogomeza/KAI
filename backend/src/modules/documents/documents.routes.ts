import { Router } from 'express';
import multer from 'multer';
import { upload, list, update, approve, remove, getDownloadUrl } from './documents.controller';
import { requireAuth, requireRole } from '../../middleware/auth';
import { requireDocPermission } from '../../middleware/permissions';

const router = Router();

// Multer in-memory config for 20MB limit
const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/pdf',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, TXT, and Word documents are allowed.'));
        }
    }
});

// Protect all document routes
router.use(requireAuth);

// Upload: Checks 'create' permission based on body.type
router.post(
    '/',
    requireDocPermission('create'),
    uploadMiddleware.single('file'),
    upload
);

// List: Accessible by anyone authenticated (we can filter in UI or controller)
router.get('/', list);

// Download: Accessible by anyone authenticated
router.get('/:id/download', getDownloadUrl);

// Update: Checks 'update' permission
router.put('/:id', requireDocPermission('update'), update);

// Approve: Checks 'approve' permission
router.patch('/:id/approve', requireDocPermission('approve'), approve);

// Delete: Checks 'delete' permission
router.delete('/:id', requireDocPermission('delete'), remove);

export default router;
