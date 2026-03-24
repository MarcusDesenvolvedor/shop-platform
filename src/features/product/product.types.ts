export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  createdAt: Date;
};

export type Product = {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
};

export type ProductImageInput = {
  url: string;
};

export type CreateProductInput = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand?: string;
  isActive?: boolean;
  images?: ProductImageInput[];
};

export type UpdateProductInput = {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  brand?: string;
  isActive?: boolean;
  images?: ProductImageInput[];
};
