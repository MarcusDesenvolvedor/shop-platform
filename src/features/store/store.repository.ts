import { prisma } from "@/lib/prisma";
import type { Store } from "./store.types";

type StoreRecord = Store;

export async function createStore(data: { userId: string; name: string; slug: string }): Promise<StoreRecord> {
  return prisma.store.create({
    data: {
      userId: data.userId,
      name: data.name,
      slug: data.slug,
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
