import Link from "next/link";
import { headers } from "next/headers";
import { ProductDetailView } from "@/components/store/product-detail-view";
import { listCategoriesForStoreSlug } from "@/features/category/category.service";

type StoreProductDetailPageProps = {
  params: Promise<{ slug: string; id: string }> | { slug: string; id: string };
};

type StoreApiData = {
  id: string;
  name: string;
  slug: string;
  coverImageUrl: string | null;
};

type ProductListItemApi = {
  id: string;
  name: string;
  images: Array<{ url: string }>;
};

type ProductDetailApiData = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string | null;
  images: Array<{ url: string }>;
  categoryName: string | null;
};

type ApiResponse<T> =
  | {
      data: T;
    }
  | {
      error: string;
    };

function getBaseUrlFromHeaders(requestHeaders: Headers): string {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return "http://localhost:3000";
  }

  return `${protocol}://${host}`;
}

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!payload) {
    return { error: "Invalid API response." };
  }

  return payload;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function StoreProductDetailPage({ params }: StoreProductDetailPageProps) {
  const { slug, id } = await params;
  const requestHeaders = await headers();
  const baseUrl = getBaseUrlFromHeaders(requestHeaders);

  const storeResponse = await fetch(`${baseUrl}/api/stores/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  const storePayload = await parseApiResponse<StoreApiData>(storeResponse);

  if (!storeResponse.ok || !("data" in storePayload)) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-[#c7c4d7]/30 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#191c1e]">Unable to load this store</h1>
        <p className="mt-2 text-sm text-[#464554]">
          {"error" in storePayload && typeof storePayload.error === "string"
            ? storePayload.error
            : "Please try again in a moment."}
        </p>
      </div>
    );
  }

  const productUrl = new URL(`${baseUrl}/api/products/${encodeURIComponent(id)}`);
  productUrl.searchParams.set("slug", slug);

  const productResponse = await fetch(productUrl.toString(), {
    cache: "no-store",
  });
  const productPayload = await parseApiResponse<ProductDetailApiData>(productResponse);

  if (!productResponse.ok || !("data" in productPayload)) {
    if (productResponse.status === 404) {
      return (
        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-[#c7c4d7]/30 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-[#191c1e]">Product not found</h1>
          <p className="mt-2 text-sm text-[#464554]">
            {"error" in productPayload && typeof productPayload.error === "string"
              ? productPayload.error
              : "This product may be unavailable or the link is incorrect."}
          </p>
          <Link
            href={`/store/${encodeURIComponent(slug)}`}
            className="mt-6 inline-flex text-sm font-semibold text-[#4648d4] hover:underline"
          >
            Back to store
          </Link>
        </div>
      );
    }

    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-[#c7c4d7]/30 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#191c1e]">Unable to load product</h1>
        <p className="mt-2 text-sm text-[#464554]">
          {"error" in productPayload && typeof productPayload.error === "string"
            ? productPayload.error
            : "Please try again in a moment."}
        </p>
        <Link
          href={`/store/${encodeURIComponent(slug)}`}
          className="mt-6 inline-flex text-sm font-semibold text-[#4648d4] hover:underline"
        >
          Back to store
        </Link>
      </div>
    );
  }

  const productData = productPayload.data;

  const categories = await listCategoriesForStoreSlug(slug);

  const productsQuery = new URLSearchParams({
    storeId: storePayload.data.id,
    sort: "latest",
  });

  const productsResponse = await fetch(`${baseUrl}/api/products?${productsQuery.toString()}`, {
    cache: "no-store",
  });
  const productsPayload = await parseApiResponse<ProductListItemApi[]>(productsResponse);

  const searchableProducts =
    productsResponse.ok && "data" in productsPayload
      ? productsPayload.data.map((item) => ({
          id: item.id,
          name: item.name,
          imageUrl: item.images[0]?.url,
        }))
      : [];

  return (
    <ProductDetailView
      store={{
        id: storePayload.data.id,
        name: storePayload.data.name,
        slug: storePayload.data.slug,
      }}
      product={{
        id: productData.id,
        name: productData.name,
        description: productData.description,
        priceLabel: formatPrice(productData.price),
        stock: productData.stock,
        brand: productData.brand,
        categoryName: productData.categoryName,
        images: productData.images.map((image) => ({ url: image.url })),
      }}
      categoryOptions={categories.map((category) => ({ id: category.id, name: category.name }))}
      searchableProducts={searchableProducts}
    />
  );
}
