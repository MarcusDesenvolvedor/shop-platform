"use client";

import { useCallback, useEffect, useState } from "react";
import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useStoreCart } from "@/components/store/store-cart-context";

type ProductDetailPurchaseProps = {
  productId: string;
  productName: string;
  stock: number;
};

export function ProductDetailPurchase({ productId, productName, stock }: ProductDetailPurchaseProps) {
  const { addToCart } = useStoreCart();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const outOfStock = stock === 0;
  const maxSelectable = Math.max(0, stock);

  useEffect(() => {
    setQuantity((current) => {
      if (stock <= 0) {
        return 1;
      }
      return Math.min(Math.max(1, current), stock);
    });
  }, [stock]);

  const handleQuantityChange = useCallback(
    (next: number) => {
      if (stock <= 0) {
        return;
      }
      setQuantity(Math.min(Math.max(1, next), stock));
    },
    [stock]
  );

  const handleAdd = useCallback(async () => {
    if (outOfStock || quantity < 1 || quantity > stock) {
      return;
    }
    setIsSubmitting(true);
    try {
      await addToCart(productId, quantity, productName);
    } finally {
      setIsSubmitting(false);
    }
  }, [addToCart, outOfStock, productId, productName, quantity, stock]);

  return (
    <div className="space-y-8">
      <div className="flex items-end gap-6">
        <div className="min-w-0 flex-1">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#464554]">Quantity</span>
          <div className="flex h-14 items-center justify-between rounded-lg bg-[#f2f4f6] px-4">
            <button
              type="button"
              className="text-[#191c1e] transition-colors hover:text-[#4648d4] disabled:opacity-30"
              disabled={outOfStock || quantity <= 1}
              onClick={() => {
                handleQuantityChange(quantity - 1);
              }}
              aria-label="Decrease quantity"
            >
              <Minus className="size-6" strokeWidth={2} />
            </button>
            <span className="text-lg font-semibold text-[#191c1e]">{quantity}</span>
            <button
              type="button"
              className="text-[#191c1e] transition-colors hover:text-[#4648d4] disabled:opacity-30"
              disabled={outOfStock || quantity >= maxSelectable}
              onClick={() => {
                handleQuantityChange(quantity + 1);
              }}
              aria-label="Increase quantity"
            >
              <Plus className="size-6" strokeWidth={2} />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="h-14 min-w-0 flex-[2] rounded-lg bg-gradient-to-r from-[#4648d4] to-[#6063ee] font-bold text-white shadow-lg shadow-[#4648d4]/20 transition-all hover:shadow-[#4648d4]/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          disabled={outOfStock || isSubmitting}
          onClick={() => void handleAdd()}
        >
          {isSubmitting ? "Adding…" : "Add to Cart"}
        </button>
      </div>

      <div className="space-y-4 border-t-2 border-[#f2f4f6] pt-8">
        <div className="flex items-center gap-4 text-[#464554]">
          <Truck className="size-6 shrink-0 text-[#4648d4]" strokeWidth={1.75} aria-hidden />
          <span className="text-sm">Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-4 text-[#464554]">
          <ShieldCheck className="size-6 shrink-0 text-[#4648d4]" strokeWidth={1.75} aria-hidden />
          <span className="text-sm">Comprehensive 2-year warranty included</span>
        </div>
      </div>
    </div>
  );
}
