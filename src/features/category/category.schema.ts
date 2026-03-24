import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
});

export const categoryIdParamsSchema = z.object({
  categoryId: z.string().trim().uuid(),
});

export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;
export type UpdateCategoryPayload = z.infer<typeof updateCategorySchema>;
export type CategoryIdParamsPayload = z.infer<typeof categoryIdParamsSchema>;
