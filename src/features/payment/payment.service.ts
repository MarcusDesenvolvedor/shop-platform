import {
  confirmPaymentTransaction,
  findOrderForPaymentConfirmation,
} from "./payment.repository";
import type { PaymentConfirmationResult } from "./payment.types";

export class PaymentNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentNotFoundError";
  }
}

export class PaymentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentValidationError";
  }
}

function mapExistingOrderToConfirmationResult(order: Awaited<ReturnType<typeof findOrderForPaymentConfirmation>>): PaymentConfirmationResult {
  if (!order) {
    throw new PaymentNotFoundError("Order was not found");
  }

  return {
    orderId: order.id,
    storeId: order.storeId,
    orderStatus: order.status,
    paymentStatus: order.payment?.status ?? "PENDING",
    totalAmount: order.totalAmount.toNumber(),
    confirmedAt: order.payment?.confirmedAt ?? null,
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}

function validateOrderReadyForConfirmation(order: NonNullable<Awaited<ReturnType<typeof findOrderForPaymentConfirmation>>>): void {
  if (!order.payment) {
    throw new PaymentValidationError("Order payment was not initialized");
  }

  if (order.status === "CANCELED") {
    throw new PaymentValidationError("Canceled orders cannot be paid");
  }

  if (order.items.length === 0) {
    throw new PaymentValidationError("Order must contain at least one item");
  }

  const hasStockShortage = order.items.some((item) => item.product.stock < item.quantity);

  if (hasStockShortage) {
    throw new PaymentValidationError("One or more items no longer have enough stock");
  }
}

function isAlreadyConfirmed(order: NonNullable<Awaited<ReturnType<typeof findOrderForPaymentConfirmation>>>): boolean {
  if (!order.payment) {
    return false;
  }

  return order.status === "PAID" && order.payment.status === "CONFIRMED";
}

export async function confirmPixPayment(orderIdInput: string): Promise<PaymentConfirmationResult> {
  const orderId = orderIdInput.trim();
  const existingOrder = await findOrderForPaymentConfirmation(orderId);

  if (!existingOrder) {
    throw new PaymentNotFoundError("Order was not found");
  }

  if (isAlreadyConfirmed(existingOrder)) {
    return mapExistingOrderToConfirmationResult(existingOrder);
  }

  validateOrderReadyForConfirmation(existingOrder);

  const result = await confirmPaymentTransaction(orderId);

  if (result.status === "CONFIRMED" && result.data) {
    return result.data;
  }

  if (result.status === "INSUFFICIENT_STOCK") {
    throw new PaymentValidationError("One or more items no longer have enough stock");
  }

  if (result.status === "STATUS_CONFLICT") {
    const latestOrder = await findOrderForPaymentConfirmation(orderId);

    if (latestOrder && isAlreadyConfirmed(latestOrder)) {
      return mapExistingOrderToConfirmationResult(latestOrder);
    }

    throw new PaymentValidationError("Order is not pending payment");
  }

  if (result.status === "MISSING_PAYMENT") {
    throw new PaymentValidationError("Order payment was not initialized");
  }

  throw new PaymentNotFoundError("Order was not found");
}
