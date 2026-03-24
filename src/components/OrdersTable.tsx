import Link from "next/link";

type OrderStatus = "Paid" | "Pending";

type OrderItem = {
  id: string;
  customer: string;
  total: string;
  date: string;
  status: OrderStatus;
};

type OrdersTableProps = {
  orders: OrderItem[];
  viewAllHref?: string;
};

const statusStyles: Record<OrderStatus, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
};

export function OrdersTable({ orders, viewAllHref }: OrdersTableProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <h3 className="text-base font-semibold text-slate-900">Recent Orders</h3>
        {viewAllHref ? (
          <Link href={viewAllHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View All
          </Link>
        ) : null}
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="text-sm text-slate-700">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{order.total}</td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

export type { OrderItem, OrdersTableProps, OrderStatus };
