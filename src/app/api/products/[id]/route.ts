import { NextResponse } from "next/server";
import { getCategoryNameForStoreProduct } from "@/features/category/category.service";
import {
  getActiveProductByStoreSlug,
  ProductNotFoundError,
  ProductValidationError,
} from "@/features/product/product.service";
import { publicProductParamsSchema, publicProductQuerySchema } from "@/features/product/product.schema";
import { StoreNotFoundError } from "@/features/store/store.service";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function parseRouteParams(context: RouteContext) {
  const params = await context.params;
  return publicProductParamsSchema.safeParse(params);
}

export async function GET(request: Request, context: RouteContext) {
  const parsedParams = await parseRouteParams(context);

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const parsedQuery = publicProductQuerySchema.safeParse({
    slug: searchParams.get("slug"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json({ error: "Invalid or missing store slug" }, { status: 400 });
  }

  try {
    const product = await getActiveProductByStoreSlug(parsedQuery.data.slug, parsedParams.data.id);
    const categoryName = await getCategoryNameForStoreProduct(product.storeId, product.categoryId);

    return NextResponse.json({
      data: {
        ...product,
        categoryName,
      },
    });
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError || error instanceof ProductNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ProductValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
