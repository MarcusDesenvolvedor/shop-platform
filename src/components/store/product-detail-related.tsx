import Link from "next/link";
import { ArrowRight } from "lucide-react";

type RelatedCard = {
  title: string;
  subtitle: string;
  price: string;
  badge?: string;
  badgeVariant?: "new" | "sale";
  strikePrice?: string;
};

const PLACEHOLDER_CARDS: RelatedCard[] = [
  { title: "Aero Buds Pro", subtitle: "Compact audio", price: "$149.00", badge: "New", badgeVariant: "new" },
  { title: "Sonic Station X", subtitle: "Desktop audio", price: "$399.00" },
  { title: "Horizon Over-Ear", subtitle: "Luxury electronics", price: "$499.00" },
  {
    title: "Aero Sync Watch",
    subtitle: "Smart wearables",
    price: "$210.00",
    strikePrice: "$250.00",
    badge: "-15%",
    badgeVariant: "sale",
  },
];

type ProductDetailRelatedProps = {
  storeSlug: string;
};

export function ProductDetailRelated({ storeSlug }: ProductDetailRelatedProps) {
  return (
    <div className="mt-32">
      <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#4648d4]">
            Curated for you
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[#191c1e]">Related products</h2>
        </div>
        <Link
          href={`/store/${storeSlug}`}
          className="group flex items-center gap-2 font-semibold text-[#4648d4]"
        >
          <span>View collection</span>
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_CARDS.map((card) => (
          <div key={card.title} className="group cursor-default">
            <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg bg-[#f2f4f6]">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#eceef0] to-[#e6e8ea] text-xs font-medium uppercase tracking-wider text-[#767586] transition-transform duration-500 group-hover:scale-105">
                Preview
              </div>
              {card.badge && card.badgeVariant === "new" ? (
                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#191c1e] shadow-sm backdrop-blur-md">
                  {card.badge}
                </div>
              ) : null}
              {card.badge && card.badgeVariant === "sale" ? (
                <div className="absolute right-4 top-4 rounded-full bg-[#ba1a1a] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                  {card.badge}
                </div>
              ) : null}
            </div>
            <h3 className="mb-1 font-bold text-[#191c1e]">{card.title}</h3>
            <p className="mb-2 text-sm text-[#464554]">{card.subtitle}</p>
            <div className="flex items-center gap-2">
              <div className="font-bold text-[#4648d4]">{card.price}</div>
              {card.strikePrice ? (
                <div className="text-sm text-[#464554] line-through">{card.strikePrice}</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
