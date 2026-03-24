import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncCurrentAuthenticatedUser } from "@/features/auth/auth.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { DashboardStoreProvider } from "@/lib/dashboard-store-context";
import { Sidebar } from "@/components/Sidebar";
import { CreateStoreForm } from "@/components/dashboard/create-store-form";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const authUser = await syncCurrentAuthenticatedUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return (
      <div className="min-h-screen bg-muted/30">
        <CreateStoreForm />
      </div>
    );
  }

  const userName = [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email;

  return (
    <DashboardStoreProvider
      value={{
        storeId: store.id,
        storeSlug: store.slug,
        storeName: store.name,
        userName,
      }}
    >
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="w-full p-6 lg:p-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </DashboardStoreProvider>
  );
}
