"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductDetailPurchase } from "@/components/store/product-detail-purchase";
import { ProductDetailRelated } from "@/components/store/product-detail-related";
import { ProductDetailStitchFooter } from "@/components/store/product-detail-stitch-footer";
import { ProductDetailTabs } from "@/components/store/product-detail-tabs";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductInfo } from "@/components/store/product-info";
import { StoreCartProvider } from "@/components/store/store-cart-context";
import { StoreShoppingChrome } from "@/components/store/store-shopping-chrome";

export type ProductDetailViewProps = {
  store: { id: string; name: string; slug: string };
  product: {
    id: string;
    name: string;
    description: string;
    priceLabel: string;
    stock: number;
    brand: string | null;
    categoryName: string | null;
    images: { url: string }[];
  };
  categoryOptions: Array<{ id: string; name: string }>;
  searchableProducts: Array<{ id: string; name: string; imageUrl?: string }>;
};

function BreadcrumbChevron() {
  return <ChevronRight className="size-4 shrink-0 text-[#464554]" aria-hidden />;
}

export function ProductDetailView({
  store,
  product,
  categoryOptions,
  searchableProducts,
}: ProductDetailViewProps) {
  const router = useRouter();

  const handleSearch = useCallback(
    (value: string) => {
      const term = value.trim();
      const query = term ? `?search=${encodeURIComponent(term)}` : "";
      router.push(`/store/${store.slug}${query}`);
    },
    [router, store.slug]
  );

  return (
    <StoreCartProvider storeSlug={store.slug}>
      <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
        <StoreShoppingChrome
          storeName={store.name}
          storeSlug={store.slug}
          categoryOptions={categoryOptions}
          selectedCategoryId=""
          selectedSearchTerm=""
          searchableProducts={searchableProducts}
          getSearchUrl={(term) => `/store/${store.slug}?search=${encodeURIComponent(term)}`}
          categoryHref={(categoryId) => `/store/${store.slug}?category=${encodeURIComponent(categoryId)}`}
          allCategoriesHref={`/store/${store.slug}`}
          onSearch={handleSearch}
        >
          <main className="pb-20 pt-32">
            <div className="mx-auto max-w-7xl px-8">
              <nav aria-label="Breadcrumb" className="mb-12 flex flex-wrap items-center gap-2 text-sm text-[#464554]">
                <Link href={`/store/${store.slug}`} className="transition-colors hover:text-[#4648d4]">
                  Home
                </Link>
                <BreadcrumbChevron />
                <Link href={`/store/${store.slug}`} className="transition-colors hover:text-[#4648d4]">
                  Collections
                </Link>
                {product.categoryName ? (
                  <>
                    <BreadcrumbChevron />
                    <span className="transition-colors">{product.categoryName}</span>
                  </>
                ) : null}
                <BreadcrumbChevron />
                <span className="font-medium text-[#191c1e]">{product.name}</span>
              </nav>

              <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <ProductGallery images={product.images} productName={product.name} />
                </div>

                <div className="flex flex-col lg:col-span-5">
                  <ProductInfo
                    name={product.name}
                    description={product.description}
                    priceLabel={product.priceLabel}
                    stock={product.stock}
                    brand={product.brand}
                  />
                  <div className="mb-12 mt-8">
                    <ProductDetailPurchase
                      productId={product.id}
                      productName={product.name}
                      stock={product.stock}
                    />
                  </div>
                </div>
              </div>

              <ProductDetailTabs description={product.description} />
              <ProductDetailRelated storeSlug={store.slug} />
            </div>
          </main>
        </StoreShoppingChrome>
        <ProductDetailStitchFooter storeName={store.name} />
      </div>
    </StoreCartProvider>
  );
}
