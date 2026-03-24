import { cartStateSchema } from "./cart.schema";
import { findActiveProductForStore, listActiveProductsForStoreByIds } from "./cart.repository";
import type {
  AddToCartInput,
  CartItem,
  CartProduct,
  CartState,
  CartView,
  CookieStore,
  RemoveFromCartInput,
  UpdateCartQuantityInput,
} from "./cart.types";
import { getStoreBySlug } from "@/features/store/store.service";

const CART_COOKIE_NAME = "mhp_cart";
const CART_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export class CartValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartValidationError";
  }
}

export class CartStoreConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartStoreConflictError";
  }
}

function readCartState(cookieStore: CookieStore): CartState | null {
  const rawCookie = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!rawCookie) {
    return null;
  }

  const parsed = safeParseCartCookie(rawCookie);

  if (!parsed) {
    return null;
  }

  const validated = cartStateSchema.safeParse(parsed);

  if (!validated.success || validated.data.items.length === 0) {
    return null;
  }

  return validated.data;
}

function safeParseCartCookie(rawCookie: string): unknown | null {
  try {
    return JSON.parse(rawCookie) as unknown;
  } catch {
    return null;
  }
}

function writeCartState(cookieStore: CookieStore, state: CartState): void {
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(state), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE_SECONDS,
  });
}

function clearCartState(cookieStore: CookieStore): void {
  cookieStore.delete(CART_COOKIE_NAME);
}

function mergeItemQuantity(items: CartItem[], productId: string, quantityToAdd: number): CartItem[] {
  const index = items.findIndex((item) => item.productId === productId);

  if (index === -1) {
    return [...items, { productId, quantity: quantityToAdd }];
  }

  const updatedItems = [...items];
  const existingItem = updatedItems[index];
  updatedItems[index] = {
    ...existingItem,
    quantity: existingItem.quantity + quantityToAdd,
  };

  return updatedItems;
}

function replaceItemQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  return items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
}

function removeItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

function toCartView(storeSlug: string, storeId: string, items: CartItem[], products: CartProduct[]): CartView {
  const productById = new Map(products.map((product) => [product.id, product]));
  const viewItems = items
    .map((item) => {
      const product = productById.get(item.productId);

      if (!product) {
        return null;
      }

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        stock: product.stock,
        imageUrl: product.imageUrl,
        subtotal: product.price * item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const totalQuantity = viewItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = viewItems.reduce((total, item) => total + item.subtotal, 0);

  return {
    storeId,
    storeSlug,
    items: viewItems,
    totalQuantity,
    totalAmount,
  };
}

async function buildValidatedCartView(
  cookieStore: CookieStore,
  storeSlug: string,
  state: CartState
): Promise<CartView> {
  const products = await listActiveProductsForStoreByIds(
    state.storeId,
    state.items.map((item) => item.productId)
  );
  const productById = new Map(products.map((product) => [product.id, product]));

  const normalizedItems = state.items
    .map((item) => {
      const product = productById.get(item.productId);

      if (!product || product.stock <= 0) {
        return null;
      }

      const normalizedQuantity = Math.min(item.quantity, product.stock);

      if (normalizedQuantity < 1) {
        return null;
      }

      return {
        productId: item.productId,
        quantity: normalizedQuantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (normalizedItems.length === 0) {
    clearCartState(cookieStore);

    return {
      storeId: state.storeId,
      storeSlug,
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }

  const hasChanged =
    normalizedItems.length !== state.items.length ||
    normalizedItems.some((item, index) => item.productId !== state.items[index]?.productId || item.quantity !== state.items[index]?.quantity);

  if (hasChanged) {
    writeCartState(cookieStore, {
      storeId: state.storeId,
      items: normalizedItems,
    });
  }

  return toCartView(storeSlug, state.storeId, normalizedItems, products);
}

export async function getCartByStoreSlug(cookieStore: CookieStore, storeSlug: string): Promise<CartView> {
  const store = await getStoreBySlug(storeSlug);
  const state = readCartState(cookieStore);

  if (!state || state.storeId !== store.id) {
    return {
      storeId: store.id,
      storeSlug: store.slug,
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }

  return buildValidatedCartView(cookieStore, store.slug, state);
}

export async function addToCartByStoreSlug(
  cookieStore: CookieStore,
  storeSlug: string,
  input: AddToCartInput
): Promise<CartView> {
  const store = await getStoreBySlug(storeSlug);
  const product = await findActiveProductForStore(input.productId, store.id);

  if (!product) {
    throw new CartValidationError("Product is not available for this store");
  }

  const currentState = readCartState(cookieStore);

  if (currentState && currentState.storeId !== store.id) {
    throw new CartStoreConflictError("Cart already contains products from another store");
  }

  const baseItems = currentState?.items ?? [];
  const existingQuantity = baseItems.find((item) => item.productId === input.productId)?.quantity ?? 0;
  const targetQuantity = existingQuantity + input.quantity;

  if (targetQuantity > product.stock) {
    throw new CartValidationError("Requested quantity exceeds available stock");
  }

  const nextItems = mergeItemQuantity(baseItems, input.productId, input.quantity);
  const nextState: CartState = {
    storeId: store.id,
    items: nextItems,
  };

  writeCartState(cookieStore, nextState);

  return buildValidatedCartView(cookieStore, store.slug, nextState);
}

export async function updateCartQuantityByStoreSlug(
  cookieStore: CookieStore,
  storeSlug: string,
  input: UpdateCartQuantityInput
): Promise<CartView> {
  const store = await getStoreBySlug(storeSlug);
  const currentState = readCartState(cookieStore);

  if (!currentState || currentState.storeId !== store.id) {
    throw new CartValidationError("Cart item was not found for this store");
  }

  const existingItem = currentState.items.find((item) => item.productId === input.productId);

  if (!existingItem) {
    throw new CartValidationError("Cart item was not found for this store");
  }

  const product = await findActiveProductForStore(input.productId, store.id);

  if (!product) {
    throw new CartValidationError("Product is not available for this store");
  }

  if (input.quantity > product.stock) {
    throw new CartValidationError("Requested quantity exceeds available stock");
  }

  const nextItems = replaceItemQuantity(currentState.items, input.productId, input.quantity);
  const nextState: CartState = {
    storeId: store.id,
    items: nextItems,
  };

  writeCartState(cookieStore, nextState);

  return buildValidatedCartView(cookieStore, store.slug, nextState);
}

export async function removeFromCartByStoreSlug(
  cookieStore: CookieStore,
  storeSlug: string,
  input: RemoveFromCartInput
): Promise<CartView> {
  const store = await getStoreBySlug(storeSlug);
  const currentState = readCartState(cookieStore);

  if (!currentState || currentState.storeId !== store.id) {
    return {
      storeId: store.id,
      storeSlug: store.slug,
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }

  const nextItems = removeItem(currentState.items, input.productId);

  if (nextItems.length === 0) {
    clearCartState(cookieStore);

    return {
      storeId: store.id,
      storeSlug: store.slug,
      items: [],
      totalQuantity: 0,
      totalAmount: 0,
    };
  }

  const nextState: CartState = {
    storeId: store.id,
    items: nextItems,
  };

  writeCartState(cookieStore, nextState);

  return buildValidatedCartView(cookieStore, store.slug, nextState);
}
