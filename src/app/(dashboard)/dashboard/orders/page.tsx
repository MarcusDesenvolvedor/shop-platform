import { OrdersListTable } from "@/components/dashboard/orders-list-table";
import { listOrdersForStore } from "@/features/order/order.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

export default async function OrdersPage() {
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  const orders = await listOrdersForStore(store.id);

  return <OrdersListTable orders={orders} />;
}
