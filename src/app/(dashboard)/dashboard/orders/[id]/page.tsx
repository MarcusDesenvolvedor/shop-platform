import { notFound } from "next/navigation";
import { OrderDetailView } from "@/components/dashboard/order-detail-view";
import { getOrderForStore, OrderNotFoundError } from "@/features/order/order.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

type OrderDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  let order;
  try {
    order = await getOrderForStore(store.id, id);
  } catch (error: unknown) {
    if (error instanceof OrderNotFoundError) {
      notFound();
    }
    throw error;
  }

  return <OrderDetailView order={order} />;
}
