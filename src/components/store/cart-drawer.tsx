"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CartDrawerItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

type CartDrawerProps = {
  open: boolean;
  items: CartDrawerItem[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function CartDrawer({ open, items, onClose, onRemove, onUpdateQuantity }: CartDrawerProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={open ? "pointer-events-auto" : "pointer-events-none"}>
      <button
        type="button"
        aria-label="Close cart"
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#c7c4d7]/30 bg-[#f7f9fb] shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#c7c4d7]/30 px-5 py-4">
          <h2 className="text-lg font-semibold text-[#191c1e]">Your cart ({totalItems})</h2>
          <Button type="button" variant="ghost" className="text-[#464554]" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-xl border border-[#c7c4d7]/30 bg-white p-6 text-center text-sm text-[#464554]">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="rounded-xl border border-[#c7c4d7]/30 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#191c1e]">{item.name}</p>
                    <p className="text-sm text-[#464554]">{formatPrice(item.price)} each</p>
                    <p className="text-xs text-[#464554]">Stock: {item.stock}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-[#464554]"
                    onClick={() => onRemove(item.productId)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <label htmlFor={`qty-${item.productId}`} className="text-xs text-[#464554]">
                    Qty
                  </label>
                  <Input
                    id={`qty-${item.productId}`}
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    onChange={(event) => onUpdateQuantity(item.productId, Number(event.target.value))}
                    className="w-20 border-[#c7c4d7]/40 bg-[#f2f4f6]"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[#c7c4d7]/30 px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#464554]">Subtotal</span>
            <span className="font-semibold text-[#191c1e]">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
