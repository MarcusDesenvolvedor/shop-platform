import { NextResponse } from "next/server";
import { createStoreSchema } from "@/features/store/store.schema";
import { createStoreForOwner, listStoresForOwner, StoreConflictError } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedBody = createStoreSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const authUser = await requireSynchronizedAuthUser();
    const store = await createStoreForOwner(authUser.id, parsedBody.data);

    return NextResponse.json({ data: store }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof StoreConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const authUser = await requireSynchronizedAuthUser();
    const stores = await listStoresForOwner(authUser.id);

    return NextResponse.json({ data: stores });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
