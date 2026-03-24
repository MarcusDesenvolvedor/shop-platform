import { z } from "zod";

export const confirmPaymentParamsSchema = z.object({
  id: z.string().trim().uuid(),
});

export type ConfirmPaymentParamsPayload = z.infer<typeof confirmPaymentParamsSchema>;
