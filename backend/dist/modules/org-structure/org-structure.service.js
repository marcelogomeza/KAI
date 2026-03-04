"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStructure = exports.deleteJob = exports.updateJob = exports.createJob = exports.listJobs = exports.deleteOrgUnit = exports.updateOrgUnit = exports.createOrgUnit = exports.listOrgUnits = void 0;
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Org Units
const listOrgUnits = async (tenantId) => {
    return await db_1.db.select().from(schema_1.orgUnits).where((0, drizzle_orm_1.eq)(schema_1.orgUnits.tenantId, tenantId));
};
exports.listOrgUnits = listOrgUnits;
const createOrgUnit = async (tenantId, data) => {
    const [unit] = await db_1.db.insert(schema_1.orgUnits).values({
        tenantId,
        name: data.name,
        type: data.type,
        parentId: data.parentId || null
    }).returning();
    return unit;
};
exports.createOrgUnit = createOrgUnit;
const updateOrgUnit = async (tenantId, id, data) => {
    const [unit] = await db_1.db.update(schema_1.orgUnits).set(data).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgUnits.id, id), (0, drizzle_orm_1.eq)(schema_1.orgUnits.tenantId, tenantId))).returning();
    return unit;
};
exports.updateOrgUnit = updateOrgUnit;
const deleteOrgUnit = async (tenantId, id) => {
    await db_1.db.delete(schema_1.orgUnits).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgUnits.id, id), (0, drizzle_orm_1.eq)(schema_1.orgUnits.tenantId, tenantId)));
    return { success: true };
};
exports.deleteOrgUnit = deleteOrgUnit;
// Jobs
const listJobs = async (tenantId) => {
    return await db_1.db.select().from(schema_1.jobs).where((0, drizzle_orm_1.eq)(schema_1.jobs.tenantId, tenantId));
};
exports.listJobs = listJobs;
const createJob = async (tenantId, data) => {
    const [job] = await db_1.db.insert(schema_1.jobs).values({
        tenantId,
        ...data
    }).returning();
    return job;
};
exports.createJob = createJob;
const updateJob = async (tenantId, id, data) => {
    const [job] = await db_1.db.update(schema_1.jobs).set(data).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobs.id, id), (0, drizzle_orm_1.eq)(schema_1.jobs.tenantId, tenantId))).returning();
    return job;
};
exports.updateJob = updateJob;
const deleteJob = async (tenantId, id) => {
    await db_1.db.delete(schema_1.jobs).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.jobs.id, id), (0, drizzle_orm_1.eq)(schema_1.jobs.tenantId, tenantId)));
    return { success: true };
};
exports.deleteJob = deleteJob;
const getStructure = async (tenantId) => {
    const units = await db_1.db.select().from(schema_1.orgUnits).where((0, drizzle_orm_1.eq)(schema_1.orgUnits.tenantId, tenantId));
    const allJobs = await db_1.db.select().from(schema_1.jobs).where((0, drizzle_orm_1.eq)(schema_1.jobs.tenantId, tenantId));
    return { units, jobs: allJobs };
};
exports.getStructure = getStructure;
