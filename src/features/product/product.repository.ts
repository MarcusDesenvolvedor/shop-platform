import { prisma } from "@/lib/prisma";
import type { Product, ProductImage } from "./product.types";

type ProductRecordWithImages = {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: { toNumber: () => number };
  stock: number;
  brand: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
};

function mapProductRecord(record: ProductRecordWithImages): Product {
  return {
    id: record.id,
    storeId: record.storeId,
    categoryId: record.categoryId,
    name: record.name,
    description: record.description,
    price: record.price.toNumber(),
    stock: record.stock,
    brand: record.brand,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    images: record.images,
  };
}

export async function createProduct(data: {
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string | null;
  isActive: boolean;
  imageUrls: string[];
}): Promise<Product> {
  const created = await prisma.product.create({
    data: {
      storeId: data.storeId,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      brand: data.brand,
      isActive: data.isActive,
      images: data.imageUrls.length
        ? {
            createMany: {
              data: data.imageUrls.map((url) => ({ url })),
            },
          }
        : undefined,
    },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return mapProductRecord(created);
}

export async function listProductsByStoreId(storeId: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { storeId },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductRecord);
}

export async function listActiveProductsByStoreId(storeId: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { storeId, isActive: true },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductRecord);
}

export async function findProductByIdAndStore(productId: string, storeId: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: { id: productId, storeId },
    include: {
      images: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!product) {
    return null;
  }

  return mapProductRecord(product);
}

export async function updateProduct(
  productId: string,
  data: {
    categoryId?: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    brand?: string | null;
    isActive?: boolean;
    imageUrls?: string[];
  }
): Promise<Product> {
  const updated = await prisma.$transaction(async (tx) => {
    if (data.imageUrls !== undefined) {
      await tx.productImage.deleteMany({
        where: { productId },
      });
    }

    const product = await tx.product.update({
      where: { id: productId },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        brand: data.brand,
        isActive: data.isActive,
      },
    });

    if (data.imageUrls !== undefined && data.imageUrls.length > 0) {
      await tx.productImage.createMany({
        data: data.imageUrls.map((url) => ({
          productId,
          url,
        })),
      });
    }

    const images = await tx.productImage.findMany({
      where: { productId },
      orderBy: { createdAt: "asc" },
    });

    return {
      ...product,
      images,
    };
  });

  return mapProductRecord(updated);
}

export async function deleteProduct(productId: string): Promise<void> {
  await prisma.product.delete({
    where: { id: productId },
  });
}

export async function findCategoryInStore(categoryId: string, storeId: string): Promise<boolean> {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, storeId },
    select: { id: true },
  });

  return Boolean(category);
}
