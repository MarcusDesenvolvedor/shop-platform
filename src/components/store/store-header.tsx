"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { CartButton } from "@/components/store/cart-button";

type SearchableProduct = {
  id: string;
  name: string;
  imageUrl?: string;
};

type StoreHeaderProps = {
  storeName: string;
  storeSlug: string;
  totalCartItems: number;
  categoryOptions: Array<{ id: string; name: string }>;
  selectedCategoryId: string;
  selectedSearchTerm: string;
  searchableProducts: SearchableProduct[];
  getSearchUrl: (searchTerm: string) => string;
  categoryHref: (categoryId: string) => string;
  allCategoriesHref: string;
  onSearch: (value: string) => void;
  onOpenCart: () => void;
};

const NAV_ACTIVE =
  "border-b-2 border-[#4648d4] pb-0.5 font-semibold text-[#4648d4]";
const NAV_INACTIVE =
  "border-b-2 border-transparent pb-0.5 font-medium text-[#464554] transition-colors hover:text-[#191c1e]";

const SEARCH_SUGGESTIONS_LIMIT = 8;

export function StoreHeader({
  storeName,
  storeSlug,
  totalCartItems,
  categoryOptions,
  selectedCategoryId,
  selectedSearchTerm,
  searchableProducts,
  getSearchUrl,
  categoryHref,
  allCategoriesHref,
  onSearch,
  onOpenCart,
}: StoreHeaderProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(selectedSearchTerm);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const categoryCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSearchValue(selectedSearchTerm);
  }, [selectedSearchTerm]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (categoryCloseTimeoutRef.current) {
        clearTimeout(categoryCloseTimeoutRef.current);
      }
    };
  }, []);

  const searchSuggestions = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return searchableProducts
      .filter((product) => product.name.toLowerCase().includes(query))
      .slice(0, SEARCH_SUGGESTIONS_LIMIT);
  }, [searchValue, searchableProducts]);

  const showSearchPanel =
    isSearchFocused && searchValue.trim().length > 0;

  const clearBlurTimeout = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const scheduleSearchBlur = () => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setIsSearchFocused(false);
    }, 180);
  };

  const clearCategoryCloseTimeout = () => {
    if (categoryCloseTimeoutRef.current) {
      clearTimeout(categoryCloseTimeoutRef.current);
      categoryCloseTimeoutRef.current = null;
    }
  };

  const openCategoryMenu = () => {
    clearCategoryCloseTimeout();
    setIsCategoryModalOpen(true);
  };

  const scheduleCategoryMenuClose = () => {
    clearCategoryCloseTimeout();
    categoryCloseTimeoutRef.current = setTimeout(() => {
      setIsCategoryModalOpen(false);
    }, 120);
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b border-[#c7c4d7]/30 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href={`/store/${storeSlug}`} className="text-2xl font-bold tracking-tight text-[#191c1e]">
            {storeName}
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#"
              className={isCategoryModalOpen ? NAV_INACTIVE : NAV_ACTIVE}
            >
              Home
            </a>
            <button
              type="button"
              className={`inline-flex w-fit shrink-0 ${isCategoryModalOpen ? NAV_ACTIVE : NAV_INACTIVE}`}
              onMouseEnter={openCategoryMenu}
              onMouseLeave={scheduleCategoryMenuClose}
            >
              Categories
            </button>
          </nav>
        </div>

        <div
          className="relative hidden items-center gap-5 sm:flex"
          onMouseDown={clearBlurTimeout}
        >
          <form
            className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#c7c4d7]/30 bg-[#f2f4f6] px-4 py-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch(searchValue);
              setIsSearchFocused(false);
            }}
          >
            <Search className="size-4 shrink-0 text-[#767586]" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onFocus={() => {
                clearBlurTimeout();
                setIsSearchFocused(true);
              }}
              onBlur={scheduleSearchBlur}
              placeholder="Search products..."
              className="w-44 bg-transparent text-sm text-[#191c1e] outline-none placeholder:text-[#767586]"
              aria-label="Search products by name"
              aria-expanded={showSearchPanel}
              aria-controls="store-search-suggestions"
              autoComplete="off"
            />
          </form>

          <CartButton totalItems={totalCartItems} onClick={onOpenCart} />

          {showSearchPanel ? (
            <div
              id="store-search-suggestions"
              role="listbox"
              className="absolute left-0 right-[calc(1.25rem+2.25rem)] top-full z-100 mt-2 max-h-100 min-w-100 overflow-y-auto rounded-xl border border-[#c7c4d7]/35 bg-white py-2 shadow-xl shadow-[#191c1e]/10"
            >
              {searchSuggestions.length === 0 ? (
                <p className="px-4 py-3 text-sm text-[#464554]">
                  No products match your search.
                </p>
              ) : (
                searchSuggestions.map((product) => (
                  <a
                    key={product.id}
                    href={getSearchUrl(product.name)}
                    role="option"
                    className="flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#f2f4f6]"
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="size-10 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="size-10 shrink-0 rounded-lg bg-[#eceef0]" />
                    )}
                    <span className="line-clamp-2 text-sm font-medium text-[#191c1e]">
                      {product.name}
                    </span>
                  </a>
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>

      {isCategoryModalOpen ? (
        <div
          className="absolute left-0 top-20 w-full border-b border-[#c7c4d7]/30 bg-white/95 shadow-2xl backdrop-blur-md"
          onMouseEnter={clearCategoryCloseTimeout}
          onMouseLeave={scheduleCategoryMenuClose}
        >
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3">
            <a
              href={allCategoriesHref}
              className="rounded-xl border border-[#c7c4d7]/35 bg-[#f7f9fb] px-5 py-4 transition-colors hover:border-[#4648d4]/40 hover:bg-[#eef0ff]"
            >
              <p className="text-sm font-semibold text-[#767586]">Browse</p>
              <p className="mt-1 text-lg font-bold text-[#191c1e]">All categories</p>
            </a>
            {categoryOptions.map((category) => {
              const isActive = selectedCategoryId === category.id;
              return (
                <a
                  key={category.id}
                  href={categoryHref(category.id)}
                  className={`rounded-xl border px-5 py-4 transition-colors ${
                    isActive
                      ? "border-[#4648d4]/45 bg-[#eef0ff]"
                      : "border-[#c7c4d7]/35 bg-[#f7f9fb] hover:border-[#4648d4]/40 hover:bg-[#eef0ff]"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#767586]">Category</p>
                  <p className="mt-1 text-lg font-bold text-[#191c1e]">{category.name}</p>
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
