import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().trim().uuid(),
  quantity: z.coerce.number().int().min(1),
});

export const checkoutCustomerSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  street: z.string().trim().min(1).max(180),
  number: z.string().trim().min(1).max(40),
  city: z.string().trim().min(1).max(120),
  state: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  identificationNumber: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(1).max(40),
});

export const checkoutRequestSchema = z.object({
  customer: checkoutCustomerSchema,
  items: z.array(checkoutItemSchema).min(1).max(100),
});

export const orderIdParamsSchema = z.object({
  orderId: z.string().trim().uuid(),
});

export type CheckoutRequestPayload = z.infer<typeof checkoutRequestSchema>;
export type OrderIdParamsPayload = z.infer<typeof orderIdParamsSchema>;
