import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
import * as orgService from './org-structure.service';
import fs from 'fs';

export const getFullStructure = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const result = await orgService.getStructure(tenantId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const createUnit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const result = await orgService.createOrgUnit(tenantId, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const createPosition = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const result = await orgService.createJob(tenantId, req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const removeUnit = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        await orgService.deleteOrgUnit(tenantId, req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const removeJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        await orgService.deleteJob(tenantId, req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const bulkUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const content = fs.readFileSync(file.path, 'utf-8');
        const lines = content.split('\n');

        // Example format: type,name,parentName
        // type: 'unit' or 'job'

        const unitsMap = new Map<string, string>(); // name -> id

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [type, name, parentName] = line.split(',');
            if (type === 'unit') {
                const parentId = parentName ? unitsMap.get(parentName) : null;
                const unit = await orgService.createOrgUnit(tenantId, { name, type: 'unit', parentId });
                unitsMap.set(name, unit.id);
            } else if (type === 'job') {
                const unitId = unitsMap.get(parentName);
                if (unitId) {
                    await orgService.createJob(tenantId, { name, unitId });
                }
            }
        }

        fs.unlinkSync(file.path);
        res.status(201).json({ message: 'Structure uploaded successfully' });
    } catch (error) {
        next(error);
    }
};

export const exportStructure = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tenantId = req.user!.tenantId;
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
    } catch (error) {
        next(error);
    }
};
