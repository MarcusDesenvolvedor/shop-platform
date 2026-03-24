import { prisma } from "@/lib/prisma";
import type { PaymentConfirmationResult } from "./payment.types";

type OrderForPaymentRecord = {
  id: string;
  storeId: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  totalAmount: { toNumber: () => number };
  items: {
    productId: string;
    quantity: number;
    product: {
      stock: number;
    };
  }[];
  payment: {
    status: "PENDING" | "CONFIRMED";
    confirmedAt: Date | null;
  } | null;
};

type PaymentConfirmationRecord = {
  id: string;
  storeId: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  totalAmount: { toNumber: () => number };
  items: {
    productId: string;
    quantity: number;
  }[];
  payment: {
    status: "PENDING" | "CONFIRMED";
    confirmedAt: Date | null;
  } | null;
};

type ConfirmPaymentTransactionStatus =
  | "CONFIRMED"
  | "ORDER_NOT_FOUND"
  | "MISSING_PAYMENT"
  | "STATUS_CONFLICT"
  | "INSUFFICIENT_STOCK";

type ConfirmPaymentTransactionResult = {
  status: ConfirmPaymentTransactionStatus;
  data: PaymentConfirmationResult | null;
};

function mapPaymentConfirmationRecord(record: PaymentConfirmationRecord): PaymentConfirmationResult {
  return {
    orderId: record.id,
    storeId: record.storeId,
    orderStatus: record.status,
    paymentStatus: record.payment?.status ?? "PENDING",
    totalAmount: record.totalAmount.toNumber(),
    confirmedAt: record.payment?.confirmedAt ?? null,
    items: record.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}

export async function findOrderForPaymentConfirmation(orderId: string): Promise<OrderForPaymentRecord | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      storeId: true,
      status: true,
      totalAmount: true,
      items: {
        select: {
          productId: true,
          quantity: true,
          product: {
            select: {
              stock: true,
            },
          },
        },
      },
      payment: {
        select: {
          status: true,
          confirmedAt: true,
        },
      },
    },
  });
}

export async function confirmPaymentTransaction(orderId: string): Promise<ConfirmPaymentTransactionResult> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!order) {
      return { status: "ORDER_NOT_FOUND", data: null };
    }

    if (!order.payment) {
      return { status: "MISSING_PAYMENT", data: null };
    }

    if (order.status !== "PENDING_PAYMENT" || order.payment.status !== "PENDING") {
      return { status: "STATUS_CONFLICT", data: null };
    }

    for (const item of order.items) {
      const reduced = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (reduced.count !== 1) {
        return { status: "INSUFFICIENT_STOCK", data: null };
      }
    }

    const now = new Date();

    await tx.payment.update({
      where: { orderId: order.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: now,
      },
    });

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
      },
    });

    const updatedOrder = await tx.order.findUnique({
      where: { id: order.id },
      select: {
        id: true,
        storeId: true,
        status: true,
        totalAmount: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
        payment: {
          select: {
            status: true,
            confirmedAt: true,
          },
        },
      },
    });

    if (!updatedOrder) {
      return { status: "ORDER_NOT_FOUND", data: null };
    }

    return {
      status: "CONFIRMED",
      data: mapPaymentConfirmationRecord(updatedOrder),
    };
  });
}
