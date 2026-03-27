import {
  createStore,
  findStoreBySlug,
  findStoreByUserId,
  listStoresByUserId,
  updateStore,
} from "./store.repository";
import type { CreateStoreInput, Store, UpdateStoreInput } from "./store.types";

const DEFAULT_STORE_CATEGORY_NAME = "General";

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
    defaultCategoryName: DEFAULT_STORE_CATEGORY_NAME,
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

export async function getStoreBySlug(slug: string): Promise<Store> {
  const normalizedSlug = slug.trim().toLowerCase();
  const store = await findStoreBySlug(normalizedSlug);

  if (!store) {
    throw new StoreNotFoundError("Store not found");
  }

  return store;
}

export async function updateStoreForOwner(
  ownerUserId: string,
  slug: string,
  input: UpdateStoreInput
): Promise<Store> {
  const store = await getOwnedStoreBySlug(ownerUserId, slug);

  const updateData: { name?: string; slug?: string; coverImageUrl?: string | null } = {};

  if (input.name !== undefined) {
    const trimmedName = input.name.trim();
    const newSlug = normalizeStoreSlug(trimmedName);

    if (newSlug !== store.slug) {
      const existingBySlug = await findStoreBySlug(newSlug);
      if (existingBySlug) {
        throw new StoreConflictError("Store slug already exists");
      }
    }

    updateData.name = trimmedName;
    updateData.slug = newSlug;
  }

  if (input.coverImageUrl !== undefined) {
    const v = input.coverImageUrl;
    updateData.coverImageUrl = v === null || v === "" ? null : v.trim();
  }

  if (Object.keys(updateData).length === 0) {
    return store;
  }

  return updateStore(store.id, updateData);
}
