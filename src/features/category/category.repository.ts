import { prisma } from "@/lib/prisma";
import type { Category } from "./category.types";

type CategoryRecord = Category;

export async function createCategory(data: { storeId: string; name: string }): Promise<CategoryRecord> {
  return prisma.category.create({
    data: {
      storeId: data.storeId,
      name: data.name.trim(),
    },
  });
}

export async function listCategoriesByStoreId(storeId: string): Promise<CategoryRecord[]> {
  return prisma.category.findMany({
    where: { storeId },
    orderBy: { name: "asc" },
  });
}

export async function findCategoryByIdAndStore(categoryId: string, storeId: string): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: { id: categoryId, storeId },
  });
}

export async function findCategoryByNameAndStore(storeId: string, name: string): Promise<CategoryRecord | null> {
  return prisma.category.findFirst({
    where: { storeId, name: name.trim() },
  });
}

export async function updateCategory(categoryId: string, data: { name?: string }): Promise<CategoryRecord> {
  return prisma.category.update({
    where: { id: categoryId },
    data: data.name !== undefined ? { name: data.name.trim() } : {},
  });
}

export async function deleteCategory(categoryId: string): Promise<CategoryRecord> {
  return prisma.category.delete({
    where: { id: categoryId },
  });
}

export async function countProductsByCategoryId(categoryId: string): Promise<number> {
  return prisma.product.count({
    where: { categoryId },
  });
}
