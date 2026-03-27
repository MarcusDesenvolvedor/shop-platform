import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().trim().url().max(2048),
});

export const createProductSchema = z.object({
  categoryId: z.string().trim().uuid(),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  price: z.coerce.number().gt(0),
  stock: z.coerce.number().int().min(0),
  brand: z.string().trim().min(1).max(120).optional(),
  isActive: z.boolean().optional(),
  images: z.array(productImageSchema).max(10).optional(),
});

export const updateProductSchema = z
  .object({
    categoryId: z.string().trim().uuid().optional(),
    name: z.string().trim().min(1).max(160).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    price: z.coerce.number().gt(0).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    brand: z.string().trim().min(1).max(120).optional(),
    isActive: z.boolean().optional(),
    images: z.array(productImageSchema).max(10).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update the product",
  });

export const productIdParamsSchema = z.object({
  productId: z.string().trim().uuid(),
});

export const listProductsQuerySchema = z.object({
  storeId: z.string().trim().uuid(),
  sort: z.enum(["latest", "best_sellers"]).optional(),
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;
export type UpdateProductPayload = z.infer<typeof updateProductSchema>;
export type ProductIdParamsPayload = z.infer<typeof productIdParamsSchema>;
export type ListProductsQueryPayload = z.infer<typeof listProductsQuerySchema>;
