import { listActiveProductsByStoreSlug } from "@/features/product/product.service";
import { StoreProductCard } from "@/components/store/store-product-card";

type StorePageProps = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?: Promise<{ category?: string }> | { category?: string };
};

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedCategoryId = resolvedSearchParams.category?.trim();

  const allProducts = await listActiveProductsByStoreSlug(slug);

  const visibleProducts = selectedCategoryId
    ? allProducts.filter((product) => product.categoryId === selectedCategoryId)
    : allProducts;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">{visibleProducts.length} item(s)</p>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          No active products found for this store.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <StoreProductCard
              key={product.id}
              storeSlug={slug}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                imageUrl: product.images[0]?.url,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
