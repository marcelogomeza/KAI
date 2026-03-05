"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const documents_controller_1 = require("./documents.controller");
const auth_1 = require("../../middleware/auth");
const permissions_1 = require("../../middleware/permissions");
const router = (0, express_1.Router)();
// Multer in-memory config for 20MB limit
const uploadMiddleware = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
        }
        else {
            cb(new Error('Invalid file type. Only PDF, TXT, and Word documents are allowed.'));
        }
    }
});
// Protect all document routes
router.use(auth_1.requireAuth);
// Upload: Checks 'create' permission based on body.type
router.post('/', (0, permissions_1.requireDocPermission)('create'), uploadMiddleware.single('file'), documents_controller_1.upload);
// List: Accessible by anyone authenticated (we can filter in UI or controller)
router.get('/', documents_controller_1.list);
// Update: Checks 'update' permission
router.put('/:id', (0, permissions_1.requireDocPermission)('update'), documents_controller_1.update);
// Approve: Checks 'approve' permission
router.patch('/:id/approve', (0, permissions_1.requireDocPermission)('approve'), documents_controller_1.approve);
// Delete: Checks 'delete' permission
router.delete('/:id', (0, permissions_1.requireDocPermission)('delete'), documents_controller_1.remove);
exports.default = router;
