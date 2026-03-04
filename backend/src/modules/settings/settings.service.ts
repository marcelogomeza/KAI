import { db } from '../../db/db';
import { settings } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

export const getSettings = async (tenantId: string) => {
    return await db.select().from(settings).where(eq(settings.tenantId, tenantId));
};

export const updateSettings = async (tenantId: string, settingsUpdate: Record<string, string>) => {
    const promises = Object.entries(settingsUpdate).map(([key, value]) => {
        return db.transaction(async (tx: any) => {
            const existing = await tx.select().from(settings)
                .where(and(eq(settings.tenantId, tenantId), eq(settings.key, key)))
                .limit(1);

            if (existing.length > 0) {
                await tx.update(settings)
                    .set({ value, updatedAt: new Date() })
                    .where(eq(settings.id, existing[0].id));
            } else {
                await tx.insert(settings)
                    .values({
                        tenantId,
                        key,
                        value,
                    });
            }
        });
    });

    await Promise.all(promises);
    return await getSettings(tenantId);
};
