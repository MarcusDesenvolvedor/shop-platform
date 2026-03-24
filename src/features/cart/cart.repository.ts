import { prisma } from "@/lib/prisma";
import type { CartProduct } from "./cart.types";

type ProductForCartRecord = {
  id: string;
  storeId: string;
  name: string;
  price: { toNumber: () => number };
  stock: number;
  images: { url: string }[];
};

function mapProductForCart(record: ProductForCartRecord): CartProduct {
  return {
    id: record.id,
    storeId: record.storeId,
    name: record.name,
    price: record.price.toNumber(),
    stock: record.stock,
    imageUrl: record.images[0]?.url ?? null,
  };
}

export async function findActiveProductForStore(productId: string, storeId: string): Promise<CartProduct | null> {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId,
      isActive: true,
    },
    select: {
      id: true,
      storeId: true,
      name: true,
      price: true,
      stock: true,
      images: {
        select: { url: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!product) {
    return null;
  }

  return mapProductForCart(product);
}

export async function listActiveProductsForStoreByIds(
  storeId: string,
  productIds: string[]
): Promise<CartProduct[]> {
  if (productIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      storeId,
      isActive: true,
      id: { in: productIds },
    },
    select: {
      id: true,
      storeId: true,
      name: true,
      price: true,
      stock: true,
      images: {
        select: { url: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  return products.map(mapProductForCart);
}
