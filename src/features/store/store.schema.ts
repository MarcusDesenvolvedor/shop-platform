import { z } from "zod";

/** HTTP(S) only — matches typical image CDNs; avoids javascript:/data: URLs. */
function isHttpImageUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const coverImageUrlValue = z
  .string()
  .trim()
  .max(16384)
  .refine((s) => isHttpImageUrl(s), { message: "Invalid image URL (use http or https)" });

export const createStoreSchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export const storeSlugParamsSchema = z.object({
  slug: z.string().trim().min(1).max(120),
});

export const updateStoreSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  coverImageUrl: z.union([coverImageUrlValue, z.literal(""), z.null()]).optional(),
});

export type CreateStorePayload = z.infer<typeof createStoreSchema>;
export type UpdateStorePayload = z.infer<typeof updateStoreSchema>;
export type StoreSlugParamsPayload = z.infer<typeof storeSlugParamsSchema>;
