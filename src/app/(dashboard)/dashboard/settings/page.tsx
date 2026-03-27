import { StoreSettingsForm } from "@/components/dashboard/store-settings-form";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

export default async function SettingsPage() {
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  const userName = [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email;

  return (
    <StoreSettingsForm
      store={{ name: store.name, slug: store.slug, coverImageUrl: store.coverImageUrl }}
      userEmail={authUser.email}
      userName={userName}
    />
  );
}
