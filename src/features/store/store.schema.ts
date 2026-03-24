import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export const storeSlugParamsSchema = z.object({
  slug: z.string().trim().min(1).max(120),
});

export const updateStoreSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
});

export type CreateStorePayload = z.infer<typeof createStoreSchema>;
export type UpdateStorePayload = z.infer<typeof updateStoreSchema>;
export type StoreSlugParamsPayload = z.infer<typeof storeSlugParamsSchema>;
