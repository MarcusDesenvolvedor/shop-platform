import { headers } from "next/headers";
import { StorefrontPageContent } from "@/components/store/storefront-page-content";
import { listCategoriesForStoreSlug } from "@/features/category/category.service";

type StorePageProps = {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams?:
    | Promise<{ page?: string; category?: string; sort?: string; search?: string }>
    | { page?: string; category?: string; sort?: string; search?: string };
};

type StoreApiData = {
  id: string;
  name: string;
  slug: string;
};

type ProductApiData = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string | null;
  images: Array<{ url: string }>;
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

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const { slug } = await params;
  const resolvedSearchParams = (searchParams ? await searchParams : {}) ?? {};
  const requestHeaders = await headers();
  const baseUrl = getBaseUrlFromHeaders(requestHeaders);

  const storeResponse = await fetch(`${baseUrl}/api/stores/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  const storePayload = await parseApiResponse<StoreApiData>(storeResponse);

  if (!storeResponse.ok || !("data" in storePayload)) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold">Unable to load this store</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {"error" in storePayload ? storePayload.error : "Please try again in a moment."}
        </p>
      </div>
    );
  }

  const selectedSort = resolvedSearchParams.sort?.trim() === "best_sellers" ? "best_sellers" : "";
  const productsQuery = new URLSearchParams({
    storeId: storePayload.data.id,
    sort: selectedSort === "best_sellers" ? "best_sellers" : "latest",
  });

  const productsResponse = await fetch(`${baseUrl}/api/products?${productsQuery.toString()}`, {
    cache: "no-store",
  });
  const productsPayload = await parseApiResponse<ProductApiData[]>(productsResponse);

  if (!productsResponse.ok || !("data" in productsPayload)) {
    return (
      <div className="mx-auto mt-10 max-w-3xl rounded-xl border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold">Unable to load products</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {"error" in productsPayload ? productsPayload.error : "Please try again in a moment."}
        </p>
      </div>
    );
  }

  const categories = await listCategoriesForStoreSlug(slug);
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
  const selectedCategoryId = resolvedSearchParams.category?.trim() || "";
  const selectedSearchTerm = resolvedSearchParams.search?.trim() || "";
  const requestedPage = Number(resolvedSearchParams.page ?? "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const PAGE_SIZE = 8;

  const storefrontProducts = productsPayload.data.map((product) => ({
    id: product.id,
    categoryId: product.categoryId,
    categoryName: categoryMap.get(product.categoryId) ?? "Uncategorized",
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    brand: product.brand ?? "",
    imageUrl: product.images[0]?.url,
  }));

  const filteredProducts = storefrontProducts.filter((product) => {
    const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
    const normalizedProductName = product.name.toLowerCase();
    const normalizedSearchTerm = selectedSearchTerm.toLowerCase();
    const matchesSearch = !normalizedSearchTerm || normalizedProductName.includes(normalizedSearchTerm);
    return matchesCategory && matchesSearch;
  });

  const searchableProducts = storefrontProducts
    .filter((product) => !selectedCategoryId || product.categoryId === selectedCategoryId)
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
    }));

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  return (
    <StorefrontPageContent
      store={storePayload.data}
      products={paginatedProducts}
      searchableProducts={searchableProducts}
      totalProductsCount={filteredProducts.length}
      categoryOptions={categories.map((category) => ({ id: category.id, name: category.name }))}
      selectedCategoryId={selectedCategoryId}
      selectedSort={selectedSort}
      selectedSearchTerm={selectedSearchTerm}
      currentPage={safePage}
      totalPages={totalPages}
    />
  );
}
