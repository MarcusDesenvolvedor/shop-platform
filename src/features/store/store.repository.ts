import { prisma } from "@/lib/prisma";
import type { Store } from "./store.types";

type StoreRecord = Store;

export async function createStore(data: {
  userId: string;
  name: string;
  slug: string;
  defaultCategoryName?: string;
}): Promise<StoreRecord> {
  return prisma.store.create({
    data: {
      userId: data.userId,
      name: data.name,
      slug: data.slug,
      categories: data.defaultCategoryName
        ? {
            create: {
              name: data.defaultCategoryName.trim(),
            },
          }
        : undefined,
    },
  });
}

export async function findStoreByUserId(userId: string): Promise<StoreRecord | null> {
  return prisma.store.findUnique({
    where: { userId },
  });
}

export async function findStoreBySlug(slug: string): Promise<StoreRecord | null> {
  return prisma.store.findUnique({
    where: { slug },
  });
}

export async function listStoresByUserId(userId: string): Promise<StoreRecord[]> {
  return prisma.store.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateStore(
  storeId: string,
  data: { name?: string; slug?: string; coverImageUrl?: string | null }
): Promise<StoreRecord> {
  return prisma.store.update({
    where: { id: storeId },
    data,
  });
}
