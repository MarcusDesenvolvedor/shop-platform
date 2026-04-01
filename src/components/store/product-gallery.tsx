"use client";

import { useMemo, useState } from "react";
import { CirclePlay } from "lucide-react";

export type ProductGalleryImage = {
  url: string;
};

type ProductGalleryProps = {
  images: ProductGalleryImage[];
  productName: string;
};

const THUMB_SLOTS = 4;

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = images.length > 0 ? Math.min(activeIndex, images.length - 1) : 0;
  const active = images[safeIndex];

  const thumbLayout = useMemo(() => {
    if (images.length === 0) {
      return [];
    }
    if (images.length >= THUMB_SLOTS) {
      return images.slice(0, THUMB_SLOTS).map((image, index) => ({ kind: "image" as const, index, url: image.url }));
    }
    const rows: Array<{ kind: "image"; index: number; url: string } | { kind: "play" } | { kind: "empty" }> = [];
    for (let i = 0; i < images.length; i++) {
      rows.push({ kind: "image", index: i, url: images[i].url });
    }
    rows.push({ kind: "play" });
    while (rows.length < THUMB_SLOTS) {
      rows.push({ kind: "empty" });
    }
    return rows.slice(0, THUMB_SLOTS);
  }, [images]);

  if (images.length === 0 || !active?.url) {
    return (
      <div className="space-y-6">
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-[#f2f4f6] text-sm text-[#464554] shadow-sm">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="aspect-square overflow-hidden rounded-lg bg-[#f2f4f6] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active.url} alt={productName} className="h-full w-full object-cover" />
      </div>

      {thumbLayout.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {thumbLayout.map((slot, slotIndex) => {
            if (slot.kind === "image") {
              const selected = slot.index === safeIndex;
              return (
                <button
                  key={`img-${slot.url}-${slot.index}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(slot.index);
                  }}
                  className={`aspect-square overflow-hidden rounded-lg transition-opacity ${
                    selected
                      ? "cursor-pointer ring-2 ring-[#4648d4] ring-offset-4 ring-offset-[#f7f9fb]"
                      : "cursor-pointer opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${slot.index + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slot.url} alt="" className="h-full w-full object-cover" />
                </button>
              );
            }
            if (slot.kind === "play") {
              return (
                <button
                  key="video-placeholder"
                  type="button"
                  className="flex aspect-square cursor-default items-center justify-center rounded-lg bg-[#e6e8ea] opacity-60 transition-opacity hover:opacity-100"
                  aria-label="Video preview (coming soon)"
                >
                  <CirclePlay className="size-10 text-[#464554]" strokeWidth={1.25} />
                </button>
              );
            }
            return (
              <div
                key={`empty-${slotIndex}`}
                className="aspect-square rounded-lg bg-[#e6e8ea]/50"
                aria-hidden
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
