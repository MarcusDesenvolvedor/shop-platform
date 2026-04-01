"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { CartView } from "@/features/cart/cart.types";
import {
  deleteCartItem,
  fetchStoreCart,
  patchCartQuantity,
  postAddToCart,
} from "@/lib/storefront/cart-api";

export type StoreCartDrawerItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type StoreCartContextValue = {
  cart: CartView | null;
  isCartLoading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalCartItems: number;
  drawerItems: StoreCartDrawerItem[];
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, productName?: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
};

const StoreCartContext = createContext<StoreCartContextValue | null>(null);

export function StoreCartProvider({ storeSlug, children }: { storeSlug: string; children: ReactNode }) {
  const [cart, setCart] = useState<CartView | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsCartLoading(true);
    const result = await fetchStoreCart(storeSlug);
    setIsCartLoading(false);
    if (result.ok) {
      setCart(result.cart);
    }
  }, [storeSlug]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity: number, productName?: string) => {
      const result = await postAddToCart(storeSlug, { productId, quantity });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setCart(result.cart);
      toast.success(productName ? `${productName} added to cart` : "Added to cart");
    },
    [storeSlug]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      const result = await deleteCartItem(storeSlug, { productId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setCart(result.cart);
    },
    [storeSlug]
  );

  const updateCartItemQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const result = await patchCartQuantity(storeSlug, { productId, quantity });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setCart(result.cart);
    },
    [storeSlug]
  );

  const drawerItems = useMemo((): StoreCartDrawerItem[] => {
    if (!cart) {
      return [];
    }
    return cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock,
    }));
  }, [cart]);

  const totalCartItems = cart?.totalQuantity ?? 0;

  const value = useMemo(
    (): StoreCartContextValue => ({
      cart,
      isCartLoading,
      isCartOpen,
      openCart,
      closeCart,
      totalCartItems,
      drawerItems,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
    }),
    [
      cart,
      isCartLoading,
      isCartOpen,
      openCart,
      closeCart,
      totalCartItems,
      drawerItems,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
    ]
  );

  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
}

export function useStoreCart(): StoreCartContextValue {
  const context = useContext(StoreCartContext);
  if (!context) {
    throw new Error("useStoreCart must be used within StoreCartProvider");
  }
  return context;
}
