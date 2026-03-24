"use client";

import { createContext, useContext, type ReactNode } from "react";

type DashboardStoreContextValue = {
  storeId: string;
  storeSlug: string;
  storeName: string;
  userName: string;
};

const DashboardStoreContext = createContext<DashboardStoreContextValue | null>(null);

type DashboardStoreProviderProps = {
  value: DashboardStoreContextValue;
  children: ReactNode;
};

export function DashboardStoreProvider({ value, children }: DashboardStoreProviderProps) {
  return (
    <DashboardStoreContext.Provider value={value}>
      {children}
    </DashboardStoreContext.Provider>
  );
}

export function useDashboardStore(): DashboardStoreContextValue {
  const ctx = useContext(DashboardStoreContext);

  if (!ctx) {
    throw new Error("useDashboardStore must be used within DashboardStoreProvider");
  }

  return ctx;
}
