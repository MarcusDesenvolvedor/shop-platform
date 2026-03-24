import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CategoryNavigation } from "@/components/store/category-navigation";
import { StorefrontHeader } from "@/components/store/storefront-header";
import { listCategoriesForStoreSlug } from "@/features/category/category.service";
import { getStoreBySlug, StoreNotFoundError } from "@/features/store/store.service";

type StoreLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }> | { slug: string };
};

async function getStoreLayoutData(slug: string) {
  try {
    const [store, categories] = await Promise.all([getStoreBySlug(slug), listCategoriesForStoreSlug(slug)]);
    return { store, categories };
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError) {
      return null;
    }

    throw error;
  }
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { slug } = await params;
  const layoutData = await getStoreLayoutData(slug);

  if (!layoutData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader storeName={layoutData.store.name} storeSlug={layoutData.store.slug} />
      <CategoryNavigation
        storeSlug={layoutData.store.slug}
        categories={layoutData.categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
