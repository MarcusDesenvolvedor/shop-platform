import { prisma } from "@/lib/prisma";
import type {
  CheckoutCustomer,
  CheckoutProduct,
  CheckoutOrderResult,
  OrderDetail,
  OrderListItem,
  ValidatedCheckoutItem,
} from "./order.types";

type ProductForCheckoutRecord = {
  id: string;
  storeId: string;
  name: string;
  price: { toNumber: () => number };
  stock: number;
  isActive: boolean;
};

type CreatedOrderRecord = {
  id: string;
  storeId: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  firstName: string;
  lastName: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  identificationNumber: string;
  phone: string;
  totalAmount: { toNumber: () => number };
  createdAt: Date;
  items: {
    productId: string;
    quantity: number;
    price: { toNumber: () => number };
    product: { name: string };
  }[];
  payment: {
    status: "PENDING" | "CONFIRMED";
  } | null;
};

function mapCheckoutProduct(record: ProductForCheckoutRecord): CheckoutProduct {
  return {
    id: record.id,
    storeId: record.storeId,
    name: record.name,
    price: record.price.toNumber(),
    stock: record.stock,
    isActive: record.isActive,
  };
}

function mapCreatedOrderRecord(record: CreatedOrderRecord): CheckoutOrderResult {
  return {
    id: record.id,
    storeId: record.storeId,
    status: record.status,
    paymentStatus: record.payment?.status ?? "PENDING",
    totalAmount: record.totalAmount.toNumber(),
    customer: {
      firstName: record.firstName,
      lastName: record.lastName,
      street: record.street,
      number: record.number,
      city: record.city,
      state: record.state,
      country: record.country,
      identificationNumber: record.identificationNumber,
      phone: record.phone,
    },
    items: record.items.map((item) => {
      const unitPrice = item.price.toNumber();
      return {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    }),
    createdAt: record.createdAt,
  };
}

export async function listProductsForCheckout(storeId: string, productIds: string[]): Promise<CheckoutProduct[]> {
  if (productIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      storeId,
      id: { in: productIds },
    },
    select: {
      id: true,
      storeId: true,
      name: true,
      price: true,
      stock: true,
      isActive: true,
    },
  });

  return products.map(mapCheckoutProduct);
}

export async function createOrderWithPendingPayment(data: {
  storeId: string;
  userId?: string;
  customer: CheckoutCustomer;
  items: ValidatedCheckoutItem[];
  totalAmount: number;
}): Promise<CheckoutOrderResult> {
  const created = await prisma.order.create({
    data: {
      storeId: data.storeId,
      userId: data.userId ?? null,
      status: "PENDING_PAYMENT",
      firstName: data.customer.firstName,
      lastName: data.customer.lastName,
      street: data.customer.street,
      number: data.customer.number,
      city: data.customer.city,
      state: data.customer.state,
      country: data.customer.country,
      identificationNumber: data.customer.identificationNumber,
      phone: data.customer.phone,
      totalAmount: data.totalAmount,
      items: {
        createMany: {
          data: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        },
      },
      payment: {
        create: {
          status: "PENDING",
        },
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
      payment: {
        select: {
          status: true,
        },
      },
    },
  });

  return mapCreatedOrderRecord(created);
}

export async function listOrdersByStoreId(storeId: string): Promise<OrderListItem[]> {
  const orders = await prisma.order.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      storeId: true,
      status: true,
      firstName: true,
      lastName: true,
      totalAmount: true,
      createdAt: true,
      payment: { select: { status: true } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    storeId: order.storeId,
    status: order.status,
    firstName: order.firstName,
    lastName: order.lastName,
    totalAmount: order.totalAmount.toNumber(),
    createdAt: order.createdAt,
    paymentStatus: order.payment?.status ?? null,
  }));
}

export async function findOrderByIdAndStore(
  orderId: string,
  storeId: string
): Promise<OrderDetail | null> {
  const order = await prisma.order.findFirst({
    where: { id: orderId, storeId },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      payment: { select: { status: true } },
    },
  });

  if (!order) {
    return null;
  }

  return {
    id: order.id,
    storeId: order.storeId,
    status: order.status,
    totalAmount: order.totalAmount.toNumber(),
    createdAt: order.createdAt,
    customer: {
      firstName: order.firstName,
      lastName: order.lastName,
      street: order.street,
      number: order.number,
      city: order.city,
      state: order.state,
      country: order.country,
      identificationNumber: order.identificationNumber,
      phone: order.phone,
    },
    items: order.items.map((item) => {
      const unitPrice = item.price.toNumber();
      return {
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    }),
    paymentStatus: order.payment?.status ?? null,
  };
}

export async function countOrdersByStoreId(storeId: string): Promise<number> {
  return prisma.order.count({ where: { storeId } });
}

export async function sumOrderRevenueByStoreId(storeId: string): Promise<number> {
  const result = await prisma.order.aggregate({
    where: { storeId, status: "PAID" },
    _sum: { totalAmount: true },
  });

  return result._sum.totalAmount?.toNumber() ?? 0;
}
