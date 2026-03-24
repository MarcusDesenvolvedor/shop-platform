"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type StoreCategoryNavigationItem = {
  id: string;
  name: string;
};

type CategoryNavigationProps = {
  storeSlug: string;
  categories: StoreCategoryNavigationItem[];
};

export function CategoryNavigation({ storeSlug, categories }: CategoryNavigationProps) {
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get("category")?.trim();

  return (
    <nav aria-label="Category navigation" className="border-b">
      <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-3">
        <Link
          href={`/store/${storeSlug}`}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
            !selectedCategoryId && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          All products
        </Link>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <Link
              key={category.id}
              href={`/store/${storeSlug}?category=${category.id}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
