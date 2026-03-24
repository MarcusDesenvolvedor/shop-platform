import Link from "next/link";
import { Bell, CircleHelp, Search } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            New Product
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none ring-indigo-200 placeholder:text-slate-400 focus:ring-2"
            placeholder="Search orders, products or analytics..."
            type="text"
          />
        </label>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            type="button"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            type="button"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
