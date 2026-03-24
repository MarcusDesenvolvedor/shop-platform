import { NextResponse } from "next/server";
import {
  createProductForStore,
  listActiveProductsByStoreSlug,
  listProductsForStore,
  ProductValidationError,
} from "@/features/product/product.service";
import { createProductSchema } from "@/features/product/product.schema";
import { StoreForbiddenError, StoreNotFoundError } from "@/features/store/store.service";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { requireOwnedStoreBySlug } from "@/lib/store";

type RouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(request: Request, context: RouteContext) {
  const params = await context.params;
  const parsedParams = storeSlugParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const ownerView = searchParams.get("scope") === "owner";

  try {
    if (ownerView) {
      const store = await requireOwnedStoreBySlug(parsedParams.data.slug);
      const products = await listProductsForStore(store.id);
      return NextResponse.json({ data: products });
    }

    const products = await listActiveProductsByStoreSlug(parsedParams.data.slug);
    return NextResponse.json({ data: products });
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof StoreForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const params = await context.params;
  const parsedParams = storeSlugParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = createProductSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsedParams.data.slug);
    const product = await createProductForStore(store.id, parsedBody.data);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof StoreForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof ProductValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
