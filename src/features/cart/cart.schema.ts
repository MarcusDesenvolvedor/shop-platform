import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().trim().uuid(),
  quantity: z.coerce.number().int().min(1),
});

export const cartStateSchema = z.object({
  storeId: z.string().trim().uuid(),
  items: z.array(cartItemSchema).max(100),
});

export const addToCartSchema = z.object({
  productId: z.string().trim().uuid(),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const updateCartQuantitySchema = z.object({
  productId: z.string().trim().uuid(),
  quantity: z.coerce.number().int().min(1),
});

export const removeFromCartSchema = z.object({
  productId: z.string().trim().uuid(),
});

export type CartStatePayload = z.infer<typeof cartStateSchema>;
export type AddToCartPayload = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityPayload = z.infer<typeof updateCartQuantitySchema>;
export type RemoveFromCartPayload = z.infer<typeof removeFromCartSchema>;
