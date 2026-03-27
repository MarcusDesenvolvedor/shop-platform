"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CartDrawer } from "@/components/store/cart-drawer";
import { ProductGrid } from "@/components/store/product-grid";
import { StoreHeader } from "@/components/store/store-header";

type StorefrontProduct = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  imageUrl?: string;
};

type CartEntry = {
  productId: string;
  quantity: number;
};

type SearchableProduct = {
  id: string;
  name: string;
  imageUrl?: string;
};

type StorefrontPageContentProps = {
  store: {
    id: string;
    name: string;
    slug: string;
    coverImageUrl?: string | null;
  };
  products: StorefrontProduct[];
  searchableProducts: SearchableProduct[];
  totalProductsCount: number;
  categoryOptions: Array<{ id: string; name: string }>;
  selectedCategoryId: string;
  selectedSort: string;
  selectedSearchTerm: string;
  currentPage: number;
  totalPages: number;
};

function normalizeQuantity(value: number, stock: number): number {
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }
  return Math.min(Math.floor(value), stock);
}

export function StorefrontPageContent({
  store,
  products,
  searchableProducts,
  totalProductsCount,
  categoryOptions,
  selectedCategoryId,
  selectedSort,
  selectedSearchTerm,
  currentPage,
  totalPages,
}: StorefrontPageContentProps) {
  const heroImageUrl = store.coverImageUrl?.trim() || products[0]?.imageUrl;
  const heroImageAlt = store.coverImageUrl?.trim() ? store.name : products[0]?.name ?? store.name;

  const [cartEntries, setCartEntries] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  const productsById = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const cartItems = useMemo(() => {
    return cartEntries
      .map((entry) => {
        const product = productsById.get(entry.productId);

        if (!product) {
          return null;
        }

        return {
          productId: entry.productId,
          name: product.name,
          price: product.price,
          quantity: entry.quantity,
          stock: product.stock,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [cartEntries, productsById]);

  const totalCartItems = useMemo(() => {
    return cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  }, [cartEntries]);

  const hrefWithFilters = (updates: {
    category?: string;
    sort?: string;
    search?: string;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    const categoryId = updates.category ?? selectedCategoryId;
    const sort = updates.sort ?? selectedSort;
    const search = updates.search ?? selectedSearchTerm;
    const page = updates.page ?? currentPage;

    if (categoryId) {
      queryParams.set("category", categoryId);
    }
    if (sort) {
      queryParams.set("sort", sort);
    }
    if (search) {
      queryParams.set("search", search);
    }
    if (page > 1) {
      queryParams.set("page", String(page));
    }

    const queryString = queryParams.toString();
    return queryString ? `/store/${store.slug}?${queryString}` : `/store/${store.slug}`;
  };

  const handleSearch = useCallback(
    (value: string) => {
      router.push(hrefWithFilters({ search: value.trim(), page: 1 }));
    },
    [router, selectedCategoryId, selectedSort, selectedSearchTerm, currentPage, store.slug]
  );

  const handleAddToCart = (productId: string) => {
    const product = productsById.get(productId);

    if (!product || product.stock === 0) {
      return;
    }

    setCartEntries((currentEntries) => {
      const existingEntry = currentEntries.find((entry) => entry.productId === productId);

      if (!existingEntry) {
        return [...currentEntries, { productId, quantity: 1 }];
      }

      return currentEntries.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: Math.min(entry.quantity + 1, product.stock) }
          : entry
      );
    });

    toast.success(`${product.name} added to cart`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.productId !== productId)
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const product = productsById.get(productId);

    if (!product) {
      return;
    }

    setCartEntries((currentEntries) =>
      currentEntries
        .map((entry) =>
          entry.productId === productId
            ? { ...entry, quantity: normalizeQuantity(quantity, product.stock) }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <StoreHeader
        storeName={store.name}
        storeSlug={store.slug}
        totalCartItems={totalCartItems}
        categoryOptions={categoryOptions}
        selectedCategoryId={selectedCategoryId}
        selectedSearchTerm={selectedSearchTerm}
        searchableProducts={searchableProducts}
        getSearchUrl={(term) => hrefWithFilters({ search: term, page: 1 })}
        categoryHref={(categoryId) => hrefWithFilters({ category: categoryId, page: 1 })}
        allCategoriesHref={hrefWithFilters({ category: "", page: 1 })}
        onSearch={handleSearch}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="pt-20">
        <section className="relative overflow-hidden bg-[#f7f9fb] py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            <div className="z-10">
              <span className="mb-6 inline-block rounded-full bg-[#d5e3fc] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#57657a]">
                Established 2024
              </span>
              <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
                Welcome to <span className="text-[#4648d4]">{store.name}</span>
              </h1>
              <p className="mb-10 max-w-xl text-xl leading-relaxed text-[#464554]">
                Discover a curated collection of high-end electronics and lifestyle essentials for the modern professional.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#4648d4]/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#b55d00]/10 blur-3xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                {heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImageUrl}
                    alt={heroImageAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#eceef0] text-sm text-[#464554]">
                    Featured image
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="collection" className="bg-[#f2f4f6] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#191c1e]">Our Collection</h2>
                <p className="text-[#464554]">Carefully selected items for your digital lifestyle.</p>
              </div>
              <div className="text-right text-sm text-[#464554]">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-[#464554]">{totalProductsCount} item(s)</p>
            </div>

            <ProductGrid products={products} onAddToCart={handleAddToCart} />

            <div className="mt-10 flex items-center justify-center gap-3">
              <a
                href={hrefWithFilters({ page: Math.max(currentPage - 1, 1) })}
                aria-disabled={currentPage <= 1}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage <= 1
                    ? "pointer-events-none border-[#c7c4d7]/30 text-[#767586]"
                    : "border-[#c7c4d7]/40 bg-white text-[#191c1e] hover:bg-[#eceef0]"
                }`}
              >
                Previous
              </a>
              <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#191c1e]">
                {currentPage}
              </span>
              <a
                href={hrefWithFilters({ page: Math.min(currentPage + 1, totalPages) })}
                aria-disabled={currentPage >= totalPages}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  currentPage >= totalPages
                    ? "pointer-events-none border-[#c7c4d7]/30 text-[#767586]"
                    : "border-[#c7c4d7]/40 bg-white text-[#191c1e] hover:bg-[#eceef0]"
                }`}
              >
                Next
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-[#c7c4d7]/20 bg-[#f7f9fb] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center gap-10 rounded-[2rem] border border-[#c7c4d7]/20 bg-white p-10 shadow-sm lg:flex-row lg:p-14">
              <div className="flex-1">
                <h2 className="mb-5 text-4xl font-black tracking-tight text-[#191c1e]">Stay in the loop.</h2>
                <p className="mb-6 max-w-md text-lg text-[#464554]">
                  Join our weekly editorial on technology, design, and commerce.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-lg bg-[#f2f4f6] px-5 py-3.5 text-sm font-medium outline-none ring-2 ring-transparent focus:ring-[#4648d4]/30"
                  />
                  <button type="button" className="rounded-lg bg-[#191c1e] px-8 py-3.5 font-bold text-white transition-colors hover:bg-[#4648d4]">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#c7c4d7]/30 bg-[#f2f4f6]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row">
          <div>
            <p className="text-lg font-black uppercase tracking-widest text-[#191c1e]">{store.name}</p>
            <p className="mt-2 max-w-xs text-sm text-[#464554]">
              Setting the standard for modern e-commerce experiences with an editorial focus.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-7 text-sm font-medium uppercase tracking-widest text-[#464554]">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
            <a href="#">Shipping</a>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
