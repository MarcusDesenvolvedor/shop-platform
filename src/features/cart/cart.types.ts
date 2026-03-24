export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartState = {
  storeId: string;
  items: CartItem[];
};

export type AddToCartInput = {
  productId: string;
  quantity: number;
};

export type UpdateCartQuantityInput = {
  productId: string;
  quantity: number;
};

export type RemoveFromCartInput = {
  productId: string;
};

export type CartProduct = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

export type CartViewItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl: string | null;
  subtotal: number;
};

export type CartView = {
  storeId: string;
  storeSlug: string;
  items: CartViewItem[];
  totalQuantity: number;
  totalAmount: number;
};

export type CookieGetResult = {
  value: string;
};

export type CookieStore = {
  get(name: string): CookieGetResult | undefined;
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "lax" | "strict" | "none";
      path?: string;
      maxAge?: number;
    }
  ): void;
  delete(name: string): void;
};
