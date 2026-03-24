import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { syncAuthUserSchema } from "@/features/auth/auth.schema";
import { syncUserFromClerk } from "@/features/auth/auth.service";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsedBody = syncAuthUserSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const user = await syncUserFromClerk({
    clerkId: userId,
    email: parsedBody.data.email,
    firstName: parsedBody.data.firstName ?? null,
    lastName: parsedBody.data.lastName ?? null,
  });

  return NextResponse.json({ data: user });
}
