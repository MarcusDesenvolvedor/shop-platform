"use client";

import { ProductCard } from "@/components/store/product-card";

type ProductGridProps = {
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }>;
  onAddToCart: (productId: string) => void;
};

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-[#c7c4d7]/30 bg-white p-10 text-center text-[#464554]">
        This store has no products available yet.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </section>
  );
}
