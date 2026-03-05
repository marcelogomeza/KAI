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
exports.deleteOrganizationRole = exports.updateOrganizationRole = exports.createOrganizationRole = exports.getOrganizationRoles = exports.deleteSystemRole = exports.updateSystemRole = exports.createSystemRole = exports.getSystemRoles = void 0;
const rolesService = __importStar(require("./roles.service"));
// System Roles
const getSystemRoles = async (req, res) => {
    try {
        const roles = await rolesService.listSystemRoles(req.user.tenantId);
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching system roles' });
    }
};
exports.getSystemRoles = getSystemRoles;
const createSystemRole = async (req, res) => {
    try {
        const role = await rolesService.createSystemRole(req.user.tenantId, req.body);
        res.status(201).json(role);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating system role' });
    }
};
exports.createSystemRole = createSystemRole;
const updateSystemRole = async (req, res) => {
    try {
        const role = await rolesService.updateSystemRole(req.user.tenantId, req.params.id, req.body);
        res.json(role);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating system role' });
    }
};
exports.updateSystemRole = updateSystemRole;
const deleteSystemRole = async (req, res) => {
    try {
        await rolesService.deleteSystemRole(req.user.tenantId, req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting system role' });
    }
};
exports.deleteSystemRole = deleteSystemRole;
// Organization Roles
const getOrganizationRoles = async (req, res) => {
    try {
        const roles = await rolesService.listOrganizationRoles(req.user.tenantId);
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching organization roles' });
    }
};
exports.getOrganizationRoles = getOrganizationRoles;
const createOrganizationRole = async (req, res) => {
    try {
        const role = await rolesService.createOrganizationRole(req.user.tenantId, req.body);
        res.status(201).json(role);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating organization role' });
    }
};
exports.createOrganizationRole = createOrganizationRole;
const updateOrganizationRole = async (req, res) => {
    try {
        const role = await rolesService.updateOrganizationRole(req.user.tenantId, req.params.id, req.body);
        res.json(role);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating organization role' });
    }
};
exports.updateOrganizationRole = updateOrganizationRole;
const deleteOrganizationRole = async (req, res) => {
    try {
        await rolesService.deleteOrganizationRole(req.user.tenantId, req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting organization role' });
    }
};
exports.deleteOrganizationRole = deleteOrganizationRole;
