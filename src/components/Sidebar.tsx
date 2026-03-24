"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutGrid, Package, Settings, ShoppingCart } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/dashboard-store-context";

type SidebarItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const items: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Categories", href: "/dashboard/categories", icon: Boxes },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { storeName, userName } = useDashboardStore();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Package className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{storeName}</p>
          <p className="text-xs text-slate-500">Store Admin</p>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
        <p className="text-xs text-slate-500">Store Owner</p>
      </div>
    </aside>
  );
}
