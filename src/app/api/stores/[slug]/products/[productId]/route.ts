import { NextResponse } from "next/server";
import {
  deleteProductForStore,
  getProductForStore,
  ProductNotFoundError,
  ProductValidationError,
  updateProductForStore,
} from "@/features/product/product.service";
import { productIdParamsSchema, updateProductSchema } from "@/features/product/product.schema";
import { StoreForbiddenError, StoreNotFoundError } from "@/features/store/store.service";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { requireOwnedStoreBySlug } from "@/lib/store";

type RouteContext = {
  params: Promise<{ slug: string; productId: string }> | { slug: string; productId: string };
};

function parseRouteParams(params: { slug: string; productId: string }) {
  const parsedSlug = storeSlugParamsSchema.safeParse({ slug: params.slug });
  const parsedProductId = productIdParamsSchema.safeParse({ productId: params.productId });

  if (!parsedSlug.success || !parsedProductId.success) {
    return null;
  }

  return {
    slug: parsedSlug.data.slug,
    productId: parsedProductId.data.productId,
  };
}

function handleCommonErrors(error: unknown) {
  if (error instanceof ProductNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof ProductValidationError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

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

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const parsed = parseRouteParams(params);

  if (!parsed) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsed.slug);
    const product = await getProductForStore(store.id, parsed.productId);
    return NextResponse.json({ data: product });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params;
  const parsed = parseRouteParams(params);

  if (!parsed) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateProductSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsed.slug);
    const product = await updateProductForStore(store.id, parsed.productId, parsedBody.data);
    return NextResponse.json({ data: product });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const params = await context.params;
  const parsed = parseRouteParams(params);

  if (!parsed) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsed.slug);
    await deleteProductForStore(store.id, parsed.productId);
    return NextResponse.json({ data: { success: true } });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}
