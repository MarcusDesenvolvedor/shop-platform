import { NextResponse } from "next/server";
import { listOrdersForStore } from "@/features/order/order.service";
import { StoreForbiddenError, StoreNotFoundError } from "@/features/store/store.service";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { requireOwnedStoreBySlug } from "@/lib/store";

type RouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const parsedParams = storeSlugParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsedParams.data.slug);
    const orders = await listOrdersForStore(store.id);
    return NextResponse.json({ data: orders });
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
