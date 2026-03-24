import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncCurrentAuthenticatedUser } from "@/features/auth/auth.service";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await syncCurrentAuthenticatedUser();

  return <div className="min-h-screen bg-muted/30">{children}</div>;
}
