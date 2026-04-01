"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/store/cart-drawer";
import { StoreHeader } from "@/components/store/store-header";
import { useStoreCart } from "@/components/store/store-cart-context";

type SearchableProduct = {
  id: string;
  name: string;
  imageUrl?: string;
};

type StoreShoppingChromeProps = {
  storeName: string;
  storeSlug: string;
  categoryOptions: Array<{ id: string; name: string }>;
  selectedCategoryId: string;
  selectedSearchTerm: string;
  searchableProducts: SearchableProduct[];
  getSearchUrl: (searchTerm: string) => string;
  categoryHref: (categoryId: string) => string;
  allCategoriesHref: string;
  onSearch: (value: string) => void;
  children: ReactNode;
};

export function StoreShoppingChrome({
  storeName,
  storeSlug,
  categoryOptions,
  selectedCategoryId,
  selectedSearchTerm,
  searchableProducts,
  getSearchUrl,
  categoryHref,
  allCategoriesHref,
  onSearch,
  children,
}: StoreShoppingChromeProps) {
  const {
    totalCartItems,
    drawerItems,
    isCartOpen,
    openCart,
    closeCart,
    removeFromCart,
    updateCartItemQuantity,
  } = useStoreCart();

  return (
    <>
      <StoreHeader
        storeName={storeName}
        storeSlug={storeSlug}
        totalCartItems={totalCartItems}
        categoryOptions={categoryOptions}
        selectedCategoryId={selectedCategoryId}
        selectedSearchTerm={selectedSearchTerm}
        searchableProducts={searchableProducts}
        getSearchUrl={getSearchUrl}
        categoryHref={categoryHref}
        allCategoriesHref={allCategoriesHref}
        onSearch={onSearch}
        onOpenCart={openCart}
      />
      {children}
      <CartDrawer
        open={isCartOpen}
        items={drawerItems}
        onClose={closeCart}
        onRemove={(productId) => {
          void removeFromCart(productId);
        }}
        onUpdateQuantity={(productId, rawQuantity) => {
          const item = drawerItems.find((entry) => entry.productId === productId);
          if (!item) {
            return;
          }
          const parsed = Number(rawQuantity);
          if (!Number.isFinite(parsed)) {
            return;
          }
          const next = Math.min(Math.max(1, Math.floor(parsed)), item.stock);
          void updateCartItemQuantity(productId, next);
        }}
      />
    </>
  );
}
