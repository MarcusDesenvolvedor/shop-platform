import {
  createStore,
  findStoreBySlug,
  findStoreByUserId,
  listStoresByUserId,
} from "./store.repository";
import type { CreateStoreInput, Store } from "./store.types";

export class StoreConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreConflictError";
  }
}

export class StoreNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreNotFoundError";
  }
}

export class StoreForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreForbiddenError";
  }
}

export function normalizeStoreSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "_");
}

export async function createStoreForOwner(ownerUserId: string, input: CreateStoreInput): Promise<Store> {
  const existingStoreForOwner = await findStoreByUserId(ownerUserId);

  if (existingStoreForOwner) {
    throw new StoreConflictError("User already owns a store");
  }

  const slug = normalizeStoreSlug(input.name);
  const existingStoreBySlug = await findStoreBySlug(slug);

  if (existingStoreBySlug) {
    throw new StoreConflictError("Store slug already exists");
  }

  return createStore({
    userId: ownerUserId,
    name: input.name.trim(),
    slug,
  });
}

export async function listStoresForOwner(ownerUserId: string): Promise<Store[]> {
  return listStoresByUserId(ownerUserId);
}

export async function getOwnedStoreBySlug(ownerUserId: string, slug: string): Promise<Store> {
  const normalizedSlug = slug.trim().toLowerCase();
  const store = await findStoreBySlug(normalizedSlug);

  if (!store) {
    throw new StoreNotFoundError("Store not found");
  }

  if (store.userId !== ownerUserId) {
    throw new StoreForbiddenError("You do not have access to this store");
  }

  return store;
}
