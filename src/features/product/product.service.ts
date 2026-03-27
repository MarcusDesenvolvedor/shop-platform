import { getStoreBySlug } from "@/features/store/store.service";
import {
  createProduct,
  deleteProduct,
  findActiveProductByIdAndStore,
  findCategoryInStore,
  findProductByIdAndStore,
  listActiveProductsByStoreId,
  listProductsByStoreId,
  updateProduct,
} from "./product.repository";
import type { CreateProductInput, Product, ProductListSort, UpdateProductInput } from "./product.types";

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

export class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductValidationError";
  }
}

function normalizeCreateInput(input: CreateProductInput): CreateProductInput {
  return {
    categoryId: input.categoryId.trim(),
    name: input.name.trim(),
    description: input.description.trim(),
    price: input.price,
    stock: input.stock,
    brand: input.brand?.trim(),
    isActive: input.isActive,
    images: input.images?.map((image) => ({ url: image.url.trim() })),
  };
}

function normalizeUpdateInput(input: UpdateProductInput): UpdateProductInput {
  return {
    categoryId: input.categoryId?.trim(),
    name: input.name?.trim(),
    description: input.description?.trim(),
    price: input.price,
    stock: input.stock,
    brand: input.brand?.trim(),
    isActive: input.isActive,
    images: input.images?.map((image) => ({ url: image.url.trim() })),
  };
}

function validateProductValues(input: { price?: number; stock?: number }): void {
  if (input.price !== undefined && input.price <= 0) {
    throw new ProductValidationError("Product price must be greater than 0");
  }

  if (input.stock !== undefined && input.stock < 0) {
    throw new ProductValidationError("Product stock must be greater than or equal to 0");
  }
}

async function ensureCategoryBelongsToStore(storeId: string, categoryId: string): Promise<void> {
  const categoryExists = await findCategoryInStore(categoryId, storeId);

  if (!categoryExists) {
    throw new ProductValidationError("Category does not belong to this store");
  }
}

async function requireProductInStore(storeId: string, productId: string): Promise<Product> {
  const product = await findProductByIdAndStore(productId, storeId);

  if (!product) {
    throw new ProductNotFoundError("Product not found");
  }

  return product;
}

export async function createProductForStore(storeId: string, input: CreateProductInput): Promise<Product> {
  const normalizedInput = normalizeCreateInput(input);
  validateProductValues({
    price: normalizedInput.price,
    stock: normalizedInput.stock,
  });
  await ensureCategoryBelongsToStore(storeId, normalizedInput.categoryId);

  return createProduct({
    storeId,
    categoryId: normalizedInput.categoryId,
    name: normalizedInput.name,
    description: normalizedInput.description,
    price: normalizedInput.price,
    stock: normalizedInput.stock,
    brand: normalizedInput.brand && normalizedInput.brand.length > 0 ? normalizedInput.brand : null,
    isActive: normalizedInput.isActive ?? true,
    imageUrls: normalizedInput.images?.map((image) => image.url) ?? [],
  });
}

export async function listProductsForStore(storeId: string): Promise<Product[]> {
  return listProductsByStoreId(storeId);
}

export async function listActiveProductsForStore(
  storeId: string,
  sort: ProductListSort = "latest"
): Promise<Product[]> {
  return listActiveProductsByStoreId(storeId, sort);
}

export async function listActiveProductsByStoreSlug(storeSlug: string): Promise<Product[]> {
  const store = await getStoreBySlug(storeSlug);
  return listActiveProductsByStoreId(store.id);
}

export async function getActiveProductByStoreSlug(storeSlug: string, productId: string): Promise<Product> {
  const store = await getStoreBySlug(storeSlug);
  const product = await findActiveProductByIdAndStore(productId, store.id);

  if (!product) {
    throw new ProductNotFoundError("Product not found");
  }

  return product;
}

export async function getProductForStore(storeId: string, productId: string): Promise<Product> {
  return requireProductInStore(storeId, productId);
}

export async function updateProductForStore(
  storeId: string,
  productId: string,
  input: UpdateProductInput
): Promise<Product> {
  const normalizedInput = normalizeUpdateInput(input);
  const product = await requireProductInStore(storeId, productId);
  validateProductValues({
    price: normalizedInput.price,
    stock: normalizedInput.stock,
  });

  if (normalizedInput.categoryId !== undefined) {
    await ensureCategoryBelongsToStore(storeId, normalizedInput.categoryId);
  }

  return updateProduct(product.id, {
    categoryId: normalizedInput.categoryId,
    name: normalizedInput.name,
    description: normalizedInput.description,
    price: normalizedInput.price,
    stock: normalizedInput.stock,
    brand: normalizedInput.brand !== undefined ? (normalizedInput.brand.length > 0 ? normalizedInput.brand : null) : undefined,
    isActive: normalizedInput.isActive,
    imageUrls: normalizedInput.images?.map((image) => image.url),
  });
}

export async function deleteProductForStore(storeId: string, productId: string): Promise<void> {
  const product = await requireProductInStore(storeId, productId);
  await deleteProduct(product.id);
}
