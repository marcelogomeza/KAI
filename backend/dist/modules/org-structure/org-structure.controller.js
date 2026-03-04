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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStructure = exports.bulkUpload = exports.removeJob = exports.removeUnit = exports.createPosition = exports.createUnit = exports.getFullStructure = void 0;
const orgService = __importStar(require("./org-structure.service"));
const fs_1 = __importDefault(require("fs"));
const getFullStructure = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const result = await orgService.getStructure(tenantId);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getFullStructure = getFullStructure;
const createUnit = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const result = await orgService.createOrgUnit(tenantId, req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.createUnit = createUnit;
const createPosition = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const result = await orgService.createJob(tenantId, req.body);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.createPosition = createPosition;
const removeUnit = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        await orgService.deleteOrgUnit(tenantId, req.params.id);
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
exports.removeUnit = removeUnit;
const removeJob = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        await orgService.deleteJob(tenantId, req.params.id);
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
exports.removeJob = removeJob;
const bulkUpload = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const content = fs_1.default.readFileSync(file.path, 'utf-8');
        const lines = content.split('\n');
        // Example format: type,name,parentName
        // type: 'unit' or 'job'
        const unitsMap = new Map(); // name -> id
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            const [type, name, parentName] = line.split(',');
            if (type === 'unit') {
                const parentId = parentName ? unitsMap.get(parentName) : null;
                const unit = await orgService.createOrgUnit(tenantId, { name, type: 'unit', parentId });
                unitsMap.set(name, unit.id);
            }
            else if (type === 'job') {
                const unitId = unitsMap.get(parentName);
                if (unitId) {
                    await orgService.createJob(tenantId, { name, unitId });
                }
            }
        }
        fs_1.default.unlinkSync(file.path);
        res.status(201).json({ message: 'Structure uploaded successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.bulkUpload = bulkUpload;
const exportStructure = async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const { units, jobs } = await orgService.getStructure(tenantId);
        let csv = 'type,name,parentName\n';
        units.forEach(u => {
            const parent = units.find(pu => pu.id === u.parentId);
            csv += `unit,${u.name},${parent ? parent.name : ''}\n`;
        });
        jobs.forEach(j => {
            const unit = units.find(u => u.id === j.unitId);
            csv += `job,${j.name},${unit ? unit.name : ''}\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=org_structure.csv');
        res.status(200).send(csv);
    }
    catch (error) {
        next(error);
    }
};
exports.exportStructure = exportStructure;
