import { db } from '../../db/db';
import { orgUnits, jobs } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

// Org Units
export const listOrgUnits = async (tenantId: string) => {
    return await db.select().from(orgUnits).where(eq(orgUnits.tenantId, tenantId));
};

export const createOrgUnit = async (tenantId: string, data: { name: string; type: string; parentId?: string | null }) => {
    const [unit] = await db.insert(orgUnits).values({
        tenantId,
        name: data.name,
        type: data.type,
        parentId: data.parentId || null
    }).returning();
    return unit;
};

export const updateOrgUnit = async (tenantId: string, id: string, data: { name?: string; type?: string; parentId?: string | null }) => {
    const [unit] = await db.update(orgUnits).set(data).where(and(eq(orgUnits.id, id), eq(orgUnits.tenantId, tenantId))).returning();
    return unit;
};

export const deleteOrgUnit = async (tenantId: string, id: string) => {
    await db.delete(orgUnits).where(and(eq(orgUnits.id, id), eq(orgUnits.tenantId, tenantId)));
    return { success: true };
};

// Jobs
export const listJobs = async (tenantId: string) => {
    return await db.select().from(jobs).where(eq(jobs.tenantId, tenantId));
};

export const createJob = async (tenantId: string, data: { name: string; unitId: string }) => {
    const [job] = await db.insert(jobs).values({
        tenantId,
        ...data
    }).returning();
    return job;
};

export const updateJob = async (tenantId: string, id: string, data: { name?: string; unitId?: string }) => {
    const [job] = await db.update(jobs).set(data).where(and(eq(jobs.id, id), eq(jobs.tenantId, tenantId))).returning();
    return job;
};

export const deleteJob = async (tenantId: string, id: string) => {
    await db.delete(jobs).where(and(eq(jobs.id, id), eq(jobs.tenantId, tenantId)));
    return { success: true };
};

export const getStructure = async (tenantId: string) => {
    const units = await db.select().from(orgUnits).where(eq(orgUnits.tenantId, tenantId));
    const allJobs = await db.select().from(jobs).where(eq(jobs.tenantId, tenantId));

    return { units, jobs: allJobs };
};
