type ProductItem = {
  name: string;
  stock: string;
  price: string;
  change: string;
};

type ProductListProps = {
  products: ProductItem[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-base font-semibold text-slate-900">Top Products</h3>
      </div>

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

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <button
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          type="button"
        >
          Manage Inventory
        </button>
      </div>
    </article>
  );
}

export type { ProductItem, ProductListProps };
