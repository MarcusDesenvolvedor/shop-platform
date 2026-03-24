import { z } from "zod";

export const syncAuthUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(100).nullable().optional(),
  lastName: z.string().trim().min(1).max(100).nullable().optional(),
});

export type SyncAuthUserPayload = z.infer<typeof syncAuthUserSchema>;
