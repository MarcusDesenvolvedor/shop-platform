import Link from "next/link";

type ProductItem = {
  name: string;
  stock: string;
  price: string;
  change: string;
};

type ProductListProps = {
  products: ProductItem[];
  manageHref?: string;
};

export function ProductList({ products, manageHref }: ProductListProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-base font-semibold text-slate-900">Top Products</h3>
      </div>

      {products.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500">No products yet.</div>
      ) : (
        <div className="space-y-4 p-6">
          {products.map((product) => (
            <div key={product.name} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">{product.stock}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{product.price}</p>
                <p className="text-xs text-slate-500">{product.change}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {manageHref ? (
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <Link
            href={manageHref}
            className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Manage Inventory
          </Link>
        </div>
      ) : null}
    </article>
  );
}

export type { ProductItem, ProductListProps };
