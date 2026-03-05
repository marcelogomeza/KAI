"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.upload = void 0;
const documentsService = __importStar(require("./documents.service"));
const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const user = req.user;
        const status = req.body.status || 'draft';
        const type = req.body.type || 'process';
        const code = req.body.code;
        const name = req.body.name;
        const ownerId = req.body.ownerId || user.userId;
        const document = await documentsService.uploadDocument(user.tenantId, user.userId, req.file, { code, name, type, status, ownerId });
        res.status(201).json(document);
    }
    catch (error) {
        next(error);
    }
};
exports.upload = upload;
const list = async (req, res, next) => {
    try {
        const user = req.user;
        const { status } = req.query;
        const docs = await documentsService.listDocuments(user.tenantId, status);
        res.json(docs);
    }
    catch (error) {
        next(error);
    }
};
exports.list = list;
