import { NextResponse } from "next/server";
import {
  CategoryConflictError,
  CategoryNotFoundError,
  deleteCategoryForStore,
  getCategoryForStore,
  updateCategoryForStore,
} from "@/features/category/category.service";
import { categoryIdParamsSchema, updateCategorySchema } from "@/features/category/category.schema";
import { StoreForbiddenError, StoreNotFoundError } from "@/features/store/store.service";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { requireOwnedStoreBySlug } from "@/lib/store";

type RouteContext = {
  params: Promise<{ slug: string; categoryId: string }> | { slug: string; categoryId: string };
};

function parseRouteParams(params: { slug: string; categoryId: string }) {
  const parsedSlug = storeSlugParamsSchema.safeParse({ slug: params.slug });
  const parsedCategoryId = categoryIdParamsSchema.safeParse({ categoryId: params.categoryId });

  if (!parsedSlug.success || !parsedCategoryId.success) {
    return null;
  }

  return {
    slug: parsedSlug.data.slug,
    categoryId: parsedCategoryId.data.categoryId,
  };
}

function handleCommonErrors(error: unknown) {
  if (error instanceof CategoryNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof CategoryConflictError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
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
    const category = await getCategoryForStore(store.id, parsed.categoryId);
    return NextResponse.json({ data: category });
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
  const parsedBody = updateCategorySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsed.slug);
    const category = await updateCategoryForStore(store.id, parsed.categoryId, parsedBody.data);
    return NextResponse.json({ data: category });
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
    await deleteCategoryForStore(store.id, parsed.categoryId);
    return NextResponse.json({ data: { success: true } });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}
