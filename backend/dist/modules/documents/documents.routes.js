"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const documents_controller_1 = require("./documents.controller");
const auth_1 = require("../../middleware/auth");
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
// Upload: Only Admin & Revisor
router.post('/', (0, auth_1.requireRole)(['admin', 'revisor']), uploadMiddleware.single('file'), documents_controller_1.upload);
// List: All roles (Admin, Revisor, Usuario)
router.get('/', documents_controller_1.list);
exports.default = router;
