import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getActiveProductByStoreSlug,
  ProductNotFoundError,
} from "@/features/product/product.service";
import { StoreNotFoundError } from "@/features/store/store.service";

type StoreProductDetailPageProps = {
  params: Promise<{ slug: string; id: string }> | { slug: string; id: string };
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function StoreProductDetailPage({ params }: StoreProductDetailPageProps) {
  const { slug, id } = await params;

  const product = await getPublicProductBySlugAndId(slug, id);

  if (!product) {
    notFound();
  }

  return (
    <article className="grid gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl border bg-muted">
        {product.images[0]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex min-h-[360px] items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          {product.brand ? <p className="mt-1 text-sm text-muted-foreground">Brand: {product.brand}</p> : null}
        </div>

        <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="rounded-lg border bg-card p-4">
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Stock available: {product.stock}</p>
        </div>

        <Link href={`/store/${slug}`} className="inline-flex text-sm font-medium text-primary hover:underline">
          Back to store
        </Link>
      </div>
    </article>
  );
}

async function getPublicProductBySlugAndId(slug: string, id: string) {
  try {
    return await getActiveProductByStoreSlug(slug, id);
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError || error instanceof ProductNotFoundError) {
      return null;
    }

    throw error;
  }
}
