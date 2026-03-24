import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartQuantitySchema,
} from "@/features/cart/cart.schema";
import {
  addToCartByStoreSlug,
  CartStoreConflictError,
  CartValidationError,
  getCartByStoreSlug,
  removeFromCartByStoreSlug,
  updateCartQuantityByStoreSlug,
} from "@/features/cart/cart.service";
import { storeSlugParamsSchema } from "@/features/store/store.schema";
import { StoreNotFoundError } from "@/features/store/store.service";

type RouteContext = {
  params: Promise<{ slug: string }> | { slug: string };
};

function handleCommonErrors(error: unknown) {
  if (error instanceof StoreNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof CartStoreConflictError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  if (error instanceof CartValidationError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

async function parseRouteParams(context: RouteContext) {
  const params = await context.params;
  const parsed = storeSlugParamsSchema.safeParse(params);

  if (!parsed.success) {
    return null;
  }

  return parsed.data.slug;
}

export async function GET(_request: Request, context: RouteContext) {
  const slug = await parseRouteParams(context);

  if (!slug) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const cart = await getCartByStoreSlug(cookieStore, slug);
    return NextResponse.json({ data: cart });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const slug = await parseRouteParams(context);

  if (!slug) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = addToCartSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const cart = await addToCartByStoreSlug(cookieStore, slug, parsedBody.data);
    return NextResponse.json({ data: cart }, { status: 201 });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const slug = await parseRouteParams(context);

  if (!slug) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateCartQuantitySchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const cart = await updateCartQuantityByStoreSlug(cookieStore, slug, parsedBody.data);
    return NextResponse.json({ data: cart });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const slug = await parseRouteParams(context);

  if (!slug) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = removeFromCartSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const cart = await removeFromCartByStoreSlug(cookieStore, slug, parsedBody.data);
    return NextResponse.json({ data: cart });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}
