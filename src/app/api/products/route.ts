import { NextResponse } from "next/server";
import { listActiveProductsForStore, ProductValidationError } from "@/features/product/product.service";
import { listProductsQuerySchema } from "@/features/product/product.schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsedQuery = listProductsQuerySchema.safeParse({
    storeId: searchParams.get("storeId"),
    sort: searchParams.get("sort") ?? undefined,
  });

  if (!parsedQuery.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
  }

  try {
    const products = await listActiveProductsForStore(
      parsedQuery.data.storeId,
      parsedQuery.data.sort ?? "latest"
    );
    return NextResponse.json({ data: products });
  } catch (error: unknown) {
    if (error instanceof ProductValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
