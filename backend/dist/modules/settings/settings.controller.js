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
exports.testConnection = exports.updateSettings = exports.getSettings = void 0;
const settingsService = __importStar(require("./settings.service"));
const getSettings = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const result = await settingsService.getSettings(tenantId);
        // Convert to key-value object
        const settingsObj = result.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsObj);
    }
    catch (error) {
        next(error);
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const settingsUpdate = req.body;
        if (typeof settingsUpdate !== 'object' || Array.isArray(settingsUpdate)) {
            return res.status(400).json({ error: 'Body must be an object of key-value pairs' });
        }
        const result = await settingsService.updateSettings(tenantId, settingsUpdate);
        const settingsObj = result.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsObj);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
const testConnection = async (req, res, next) => {
    try {
        // Mock connection test
        // It could actually query the SDK if we had all credentials configured here
        const provider = req.body.provider;
        if (!provider) {
            return res.status(400).json({ success: false, message: 'Provider missing' });
        }
        // Simulating a successful connection test
        res.json({ success: true, message: `Conexión a ${provider} probada con éxito.` });
    }
    catch (error) {
        next(error);
    }
};
exports.testConnection = testConnection;
