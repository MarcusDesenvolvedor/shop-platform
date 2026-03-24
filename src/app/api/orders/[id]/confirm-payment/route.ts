import { NextResponse } from "next/server";
import { confirmPaymentParamsSchema } from "@/features/payment/payment.schema";
import {
  confirmPixPayment,
  PaymentNotFoundError,
  PaymentValidationError,
} from "@/features/payment/payment.service";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function POST(_request: Request, context: RouteContext) {
  const params = await context.params;
  const parsedParams = confirmPaymentParamsSchema.safeParse(params);

  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid route params" }, { status: 400 });
  }

  try {
    const confirmation = await confirmPixPayment(parsedParams.data.id);
    return NextResponse.json({ data: confirmation });
  } catch (error: unknown) {
    if (error instanceof PaymentNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof PaymentValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
