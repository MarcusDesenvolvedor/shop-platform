"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

type ProductDetailTabsProps = {
  description: string;
};

export function ProductDetailTabs({ description }: ProductDetailTabsProps) {
  const [active, setActive] = useState<"description" | "specifications" | "reviews">("description");

  return (
    <div className="mt-32">
      <div className="flex flex-wrap border-b-2 border-[#eceef0]">
        <button
          type="button"
          onClick={() => {
            setActive("description");
          }}
          className={`px-6 py-4 text-sm font-bold sm:px-8 ${
            active === "description"
              ? "border-b-2 border-[#4648d4] text-[#4648d4]"
              : "font-medium text-[#464554] hover:text-[#191c1e]"
          }`}
        >
          Description
        </button>
        <button
          type="button"
          onClick={() => {
            setActive("specifications");
          }}
          className={`px-6 py-4 text-sm sm:px-8 ${
            active === "specifications"
              ? "border-b-2 border-[#4648d4] font-bold text-[#4648d4]"
              : "font-medium text-[#464554] hover:text-[#191c1e]"
          }`}
        >
          Specifications
        </button>
        <button
          type="button"
          onClick={() => {
            setActive("reviews");
          }}
          className={`px-6 py-4 text-sm sm:px-8 ${
            active === "reviews"
              ? "border-b-2 border-[#4648d4] font-bold text-[#4648d4]"
              : "font-medium text-[#464554] hover:text-[#191c1e]"
          }`}
        >
          Reviews
        </button>
      </div>

      <div className="py-12">
        {active === "description" ? (
          <div className="grid max-w-4xl items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#191c1e]">Unmatched clarity</h3>
              <p className="leading-relaxed text-[#464554]">{description}</p>
              <ul className="space-y-3">
                {[
                  "Hybrid active noise cancellation",
                  "40-hour battery life on a single charge",
                  "Multi-point Bluetooth connectivity",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3 text-[#464554]">
                    <CheckCircle className="size-4 shrink-0 text-[#4648d4]" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg bg-[#f2f4f6]">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e6e8ea] to-[#d5e3fc]/60 text-sm font-medium text-[#464554]">
                Product highlight
              </div>
            </div>
          </div>
        ) : null}

        {active === "specifications" ? (
          <div className="max-w-4xl space-y-4 text-[#464554]">
            <p className="leading-relaxed">
              Detailed specifications will be available here soon. This section follows the product detail layout from
              design.
            </p>
          </div>
        ) : null}

        {active === "reviews" ? (
          <div className="max-w-4xl space-y-4 text-[#464554]">
            <p className="leading-relaxed">
              Customer reviews will appear here in a future update. The rating summary above is illustrative.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
