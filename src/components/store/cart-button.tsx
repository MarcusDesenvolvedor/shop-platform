"use client";

import { ShoppingCart } from "lucide-react";

type CartButtonProps = {
  totalItems: number;
  onClick: () => void;
};

export function CartButton({ totalItems, onClick }: CartButtonProps) {
  return (
    <button
      type="button"
      className="relative p-2 text-[#464554] transition-transform transition-colors hover:text-[#4648d4] active:scale-95"
      onClick={onClick}
      aria-label="Open cart"
    >
      <ShoppingCart className="size-5" />
      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4648d4] text-[10px] font-bold text-white">
        {totalItems}
      </span>
    </button>
  );
}
