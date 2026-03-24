import { NextResponse } from "next/server";
import { getOrderForStore, OrderNotFoundError } from "@/features/order/order.service";
import { orderIdParamsSchema } from "@/features/order/order.schema";
import { StoreForbiddenError, StoreNotFoundError } from "@/features/store/store.service";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { requireOwnedStoreBySlug } from "@/lib/store";

type RouteContext = {
  params: Promise<{ slug: string; orderId: string }> | { slug: string; orderId: string };
};

function parseRouteParams(params: { slug: string; orderId: string }) {
  const parsedSlug = storeSlugParamsSchema.safeParse({ slug: params.slug });
  const parsedOrderId = orderIdParamsSchema.safeParse({ orderId: params.orderId });

  if (!parsedSlug.success || !parsedOrderId.success) {
    return null;
  }

  return {
    slug: parsedSlug.data.slug,
    orderId: parsedOrderId.data.orderId,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const parsed = parseRouteParams(params);

  if (!parsed) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  try {
    const store = await requireOwnedStoreBySlug(parsed.slug);
    const order = await getOrderForStore(store.id, parsed.orderId);
    return NextResponse.json({ data: order });
  } catch (error: unknown) {
    if (error instanceof OrderNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
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
}
