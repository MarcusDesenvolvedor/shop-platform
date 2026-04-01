import { Star, StarHalf } from "lucide-react";

type ProductInfoProps = {
  name: string;
  description: string;
  priceLabel: string;
  stock: number;
  brand?: string | null;
};

export function ProductInfo({
  name,
  description,
  priceLabel,
  stock,
  brand,
}: ProductInfoProps) {
  const outOfStock = stock === 0;

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex text-[#4648d4]">
          <Star className="size-5 fill-[#4648d4] text-[#4648d4]" aria-hidden />
          <Star className="size-5 fill-[#4648d4] text-[#4648d4]" aria-hidden />
          <Star className="size-5 fill-[#4648d4] text-[#4648d4]" aria-hidden />
          <Star className="size-5 fill-[#4648d4] text-[#4648d4]" aria-hidden />
          <StarHalf className="size-5 fill-[#4648d4] text-[#4648d4]" aria-hidden />
        </div>
        <span className="text-sm font-medium text-[#464554]">4.9/5 (124 reviews)</span>
      </div>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#191c1e]">{name}</h1>

      <div className="mb-2 text-3xl font-light text-[#4648d4]">{priceLabel}</div>

      {outOfStock ? (
        <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-[#93000a]">Out of stock</p>
      ) : (
        <p className="mb-6 text-sm text-[#464554]">{stock} available</p>
      )}

      {brand ? <p className="mb-6 text-sm font-medium text-[#464554]">{brand}</p> : null}

      <p className="mb-10 text-lg leading-relaxed text-[#464554]">{description}</p>

      <div className="space-y-8">
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#464554]">
            Color options
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-slate-900 ring-2 ring-[#4648d4] ring-offset-4 ring-offset-[#f7f9fb]"
              aria-label="Color option 1 (display only)"
            />
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-slate-300 ring-1 ring-[#c7c4d7] transition-transform hover:scale-110"
              aria-label="Color option 2 (display only)"
            />
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-indigo-950 ring-1 ring-[#c7c4d7] transition-transform hover:scale-110"
              aria-label="Color option 3 (display only)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
