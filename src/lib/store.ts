import { getOwnedStoreBySlug } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

export async function requireOwnedStoreBySlug(slug: string) {
  const authUser = await requireSynchronizedAuthUser();
  return getOwnedStoreBySlug(authUser.id, slug);
}
