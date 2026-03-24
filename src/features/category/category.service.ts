import {
  countProductsByCategoryId,
  createCategory,
  deleteCategory,
  findCategoryByIdAndStore,
  findCategoryByNameAndStore,
  listCategoriesByStoreId,
  updateCategory,
} from "./category.repository";
import { getStoreBySlug } from "@/features/store/store.service";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "./category.types";

export class CategoryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryConflictError";
  }
}

async function requireCategoryInStore(storeId: string, categoryId: string): Promise<Category> {
  const category = await findCategoryByIdAndStore(categoryId, storeId);

  if (!category) {
    throw new CategoryNotFoundError("Category not found");
  }

  return category;
}

export async function createCategoryForStore(storeId: string, input: CreateCategoryInput): Promise<Category> {
  const name = input.name.trim();
  const existing = await findCategoryByNameAndStore(storeId, name);

  if (existing) {
    throw new CategoryConflictError(`Category "${name}" already exists in this store`);
  }

  return createCategory({
    storeId,
    name,
  });
}

export async function listCategoriesForStore(storeId: string): Promise<Category[]> {
  return listCategoriesByStoreId(storeId);
}

export async function listCategoriesForStoreSlug(storeSlug: string): Promise<Category[]> {
  const store = await getStoreBySlug(storeSlug);
  return listCategoriesByStoreId(store.id);
}

export async function getCategoryForStore(storeId: string, categoryId: string): Promise<Category> {
  return requireCategoryInStore(storeId, categoryId);
}

export async function updateCategoryForStore(
  storeId: string,
  categoryId: string,
  input: UpdateCategoryInput
): Promise<Category> {
  const category = await requireCategoryInStore(storeId, categoryId);

  if (input.name !== undefined) {
    const name = input.name.trim();
    const existing = await findCategoryByNameAndStore(storeId, name);

    if (existing && existing.id !== category.id) {
      throw new CategoryConflictError(`Category "${name}" already exists in this store`);
    }
  }

  return updateCategory(category.id, input);
}

export async function deleteCategoryForStore(storeId: string, categoryId: string): Promise<void> {
  const category = await requireCategoryInStore(storeId, categoryId);
  const productCount = await countProductsByCategoryId(category.id);

  if (productCount > 0) {
    throw new CategoryConflictError(
      `Cannot delete category: ${productCount} product(s) are using it. Reassign or remove products first.`
    );
  }

  await deleteCategory(category.id);
}
