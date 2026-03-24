import { auth } from "@clerk/nextjs/server";
import { syncCurrentAuthenticatedUser } from "@/features/auth/auth.service";

export async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function requireSynchronizedAuthUser() {
  return syncCurrentAuthenticatedUser();
}
