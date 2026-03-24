import { NextResponse } from "next/server";
import { storeSlugParamsSchema, updateStoreSchema } from "@/features/store/store.schema";
import {
  StoreConflictError,
  StoreForbiddenError,
  StoreNotFoundError,
  updateStoreForOwner,
} from "@/features/store/store.service";
import { requireOwnedStoreBySlug } from "@/lib/store";
import { requireSynchronizedAuthUser } from "@/lib/auth";

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
    return NextResponse.json({ data: store });
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

export async function PATCH(request: Request, context: RouteContext) {
  const params = await context.params;
  const parsedParams = storeSlugParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateStoreSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const authUser = await requireSynchronizedAuthUser();
    const store = await updateStoreForOwner(
      authUser.id,
      parsedParams.data.slug,
      parsedBody.data
    );
    return NextResponse.json({ data: store });
  } catch (error: unknown) {
    if (error instanceof StoreNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof StoreForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof StoreConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
