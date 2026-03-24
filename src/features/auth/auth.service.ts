import { auth, currentUser } from "@clerk/nextjs/server";
import { upsertUserByClerkId } from "./auth.repository";
import type { AuthUser, SyncUserInput } from "./auth.types";

export async function syncUserFromClerk(input: SyncUserInput): Promise<AuthUser> {
  return upsertUserByClerkId(input);
}

export async function syncCurrentAuthenticatedUser(): Promise<AuthUser> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unable to load Clerk user");
  }

  const primaryEmail =
    clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ?? clerkUser.emailAddresses.at(0)?.emailAddress;

  if (!primaryEmail) {
    throw new Error("Authenticated user does not have an email address");
  }

  return syncUserFromClerk({
    clerkId: userId,
    email: primaryEmail,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
  });
}
