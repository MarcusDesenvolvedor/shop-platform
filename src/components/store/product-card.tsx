"use client";

import { Button } from "@/components/ui/button";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
  };
  onAddToCart: (productId: string) => void;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const outOfStock = product.stock === 0;
  const badgeLabel = outOfStock ? "Out of stock" : product.stock <= 3 ? "Low stock" : "New arrival";
  const badgeClassName = outOfStock
    ? "bg-[#ffdad6] text-[#93000a]"
    : product.stock <= 3
      ? "bg-[#ffdad6] text-[#93000a]"
      : "bg-[#4648d4] text-white";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#c7c4d7]/20 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#191c1e]/5">
      <div className="relative aspect-square w-full overflow-hidden bg-[#eceef0]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#464554]">
            No image available
          </div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${badgeClassName}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h2 className="line-clamp-1 text-lg font-bold leading-tight text-[#191c1e]">{product.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-[#464554]">{product.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <p className="text-xl font-black text-[#191c1e]">{formatPrice(product.price)}</p>
            <p className="text-xs text-[#464554]">Stock: {product.stock}</p>
          </div>
          <Button
            type="button"
            size="icon"
            className="h-11 w-11 rounded-lg bg-[#e6e8ea] text-[#191c1e] hover:bg-[#4648d4] hover:text-white"
            disabled={outOfStock}
            onClick={() => onAddToCart(product.id)}
          >
            +
          </Button>
        </div>
      </div>
    </article>
  );
}
