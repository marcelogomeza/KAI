import { Router } from 'express';
import multer from 'multer';
import { upload, list } from './documents.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

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

// Upload: Only Admin & Revisor
router.post(
    '/',
    requireRole(['admin', 'revisor']),
    uploadMiddleware.single('file'),
    upload
);

// List: All roles (Admin, Revisor, Usuario)
router.get('/', list);

export default router;
