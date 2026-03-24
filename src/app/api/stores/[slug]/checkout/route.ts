import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { StoreNotFoundError } from "@/features/store/store.service";
import { checkoutRequestSchema } from "@/features/order/order.schema";
import {
  createOrderFromCheckout,
  OrderValidationError,
} from "@/features/order/order.service";
import { syncCurrentAuthenticatedUser } from "@/features/auth/auth.service";

type RouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

async function parseRouteParams(context: RouteContext): Promise<string | null> {
  const params = await context.params;
  const parsed = storeSlugParamsSchema.safeParse(params);

  if (!parsed.success) {
    return null;
  }

  return parsed.data.slug;
}

async function resolveOptionalCheckoutUserId(): Promise<string | undefined> {
  const { userId } = await auth();

  if (!userId) {
    return undefined;
  }

  const appUser = await syncCurrentAuthenticatedUser();
  return appUser.id;
}

export async function POST(request: Request, context: RouteContext) {
  const slug = await parseRouteParams(context);

  if (!slug) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = checkoutRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const optionalUserId = await resolveOptionalCheckoutUserId();
    const order = await createOrderFromCheckout({
      storeSlug: slug,
      customer: parsedBody.data.customer,
      items: parsedBody.data.items,
      userId: optionalUserId,
    });

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
