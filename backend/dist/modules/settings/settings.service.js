"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const db_1 = require("../../db/db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getSettings = async (tenantId) => {
    return await db_1.db.select().from(schema_1.settings).where((0, drizzle_orm_1.eq)(schema_1.settings.tenantId, tenantId));
};
exports.getSettings = getSettings;
const updateSettings = async (tenantId, settingsUpdate) => {
    const promises = Object.entries(settingsUpdate).map(([key, value]) => {
        return db_1.db.transaction(async (tx) => {
            const existing = await tx.select().from(schema_1.settings)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.settings.tenantId, tenantId), (0, drizzle_orm_1.eq)(schema_1.settings.key, key)))
                .limit(1);
            if (existing.length > 0) {
                await tx.update(schema_1.settings)
                    .set({ value, updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema_1.settings.id, existing[0].id));
            }
            else {
                await tx.insert(schema_1.settings)
                    .values({
                    tenantId,
                    key,
                    value,
                });
            }
        });
    });
    await Promise.all(promises);
    return await (0, exports.getSettings)(tenantId);
};
exports.updateSettings = updateSettings;
