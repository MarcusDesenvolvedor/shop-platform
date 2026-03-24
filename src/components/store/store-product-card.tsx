import Link from "next/link";

type StoreProductCardProps = {
  storeSlug: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
  };
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function StoreProductCard({ storeSlug, product }: StoreProductCardProps) {
  return (
    <article className="rounded-xl border bg-card p-4">
      <Link href={`/store/${storeSlug}/product/${product.id}`} className="group block">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <h2 className="mt-3 line-clamp-1 text-base font-semibold">{product.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
        </div>
      </Link>
    </article>
  );
}
