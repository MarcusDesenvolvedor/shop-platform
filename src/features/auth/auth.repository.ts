import { prisma } from "@/lib/prisma";
import type { AuthUser, SyncUserInput } from "./auth.types";

type AuthUserRecord = AuthUser;

export async function upsertUserByClerkId(input: SyncUserInput): Promise<AuthUserRecord> {
  return prisma.user.upsert({
    where: { clerkId: input.clerkId },
    create: {
      clerkId: input.clerkId,
      email: input.email,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
    },
    update: {
      email: input.email,
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
    },
  });
}

export async function findUserByClerkId(clerkId: string): Promise<AuthUserRecord | null> {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}
