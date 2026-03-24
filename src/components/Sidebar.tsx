import { BarChart3, Boxes, LayoutGrid, Package, Settings, ShoppingCart } from "lucide-react";
import type { ComponentType } from "react";

type SidebarItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
};

const items: SidebarItem[] = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Products", icon: Package },
  { label: "Categories", icon: Boxes },
  { label: "Orders", icon: ShoppingCart },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Package className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Editorial Merchant</p>
          <p className="text-xs text-slate-500">Store Admin</p>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={[
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")}
              type="button"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-medium text-slate-900">Alex Rivera</p>
        <p className="text-xs text-slate-500">Premium Account</p>
      </div>
    </aside>
  );
}
