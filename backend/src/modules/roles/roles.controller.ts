import { Response } from 'express';
import { AuthRequest } from '../../types';
import * as rolesService from './roles.service';

// System Roles
export const getSystemRoles = async (req: AuthRequest, res: Response) => {
    try {
        const roles = await rolesService.listSystemRoles(req.user!.tenantId);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching system roles' });
    }
};

export const createSystemRole = async (req: AuthRequest, res: Response) => {
    try {
        const role = await rolesService.createSystemRole(req.user!.tenantId, req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: 'Error creating system role' });
    }
};

export const updateSystemRole = async (req: AuthRequest, res: Response) => {
    try {
        const role = await rolesService.updateSystemRole(req.user!.tenantId, req.params.id, req.body);
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Error updating system role' });
    }
};

export const deleteSystemRole = async (req: AuthRequest, res: Response) => {
    try {
        await rolesService.deleteSystemRole(req.user!.tenantId, req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting system role' });
    }
};

// Organization Roles
export const getOrganizationRoles = async (req: AuthRequest, res: Response) => {
    try {
        const roles = await rolesService.listOrganizationRoles(req.user!.tenantId);
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching organization roles' });
    }
};

export const createOrganizationRole = async (req: AuthRequest, res: Response) => {
    try {
        const role = await rolesService.createOrganizationRole(req.user!.tenantId, req.body.name);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: 'Error creating organization role' });
    }
};

export const updateOrganizationRole = async (req: AuthRequest, res: Response) => {
    try {
        const role = await rolesService.updateOrganizationRole(req.user!.tenantId, req.params.id, req.body.name);
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: 'Error updating organization role' });
    }
};

export const deleteOrganizationRole = async (req: AuthRequest, res: Response) => {
    try {
        await rolesService.deleteOrganizationRole(req.user!.tenantId, req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting organization role' });
    }
};
