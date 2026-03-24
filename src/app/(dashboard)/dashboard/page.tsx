import Link from "next/link";
import { ChartContainer } from "@/components/ChartContainer";
import { Header } from "@/components/Header";
import { MetricCard, type MetricCardProps } from "@/components/MetricCard";
import { OrdersTable, type OrderItem } from "@/components/OrdersTable";
import { ProductList, type ProductItem } from "@/components/ProductList";
import { listOrdersForStore } from "@/features/order/order.service";
import { countOrdersByStoreId, sumOrderRevenueByStoreId } from "@/features/order/order.repository";
import { countProductsByStoreId } from "@/features/product/product.repository";
import { listProductsForStore } from "@/features/product/product.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const orderStatusDisplayMap: Record<string, "Paid" | "Pending"> = {
  PAID: "Paid",
  PENDING_PAYMENT: "Pending",
  CANCELED: "Pending",
};

export default async function DashboardPage() {
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  const [orders, totalProducts, totalRevenue, totalOrders, products] = await Promise.all([
    listOrdersForStore(store.id),
    countProductsByStoreId(store.id),
    sumOrderRevenueByStoreId(store.id),
    countOrdersByStoreId(store.id),
    listProductsForStore(store.id),
  ]);

  const recentOrders = orders.slice(0, 5);
  const topProducts = products.slice(0, 4);

  const metricCards: MetricCardProps[] = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), change: "--", trend: "neutral" },
    { label: "Total Orders", value: String(totalOrders), change: "--", trend: "neutral" },
    { label: "Total Products", value: String(totalProducts), change: "--", trend: "neutral" },
    { label: "Paid Orders", value: String(orders.filter((o) => o.status === "PAID").length), change: "--", trend: "neutral" },
  ];

  const mappedOrders: OrderItem[] = recentOrders.map((order) => ({
    id: `#${order.id.slice(0, 8)}`,
    customer: `${order.firstName} ${order.lastName}`,
    status: orderStatusDisplayMap[order.status] ?? "Pending",
    total: formatCurrency(order.totalAmount),
    date: formatDate(new Date(order.createdAt)),
  }));

  const mappedProducts: ProductItem[] = topProducts.map((product) => ({
    name: product.name,
    stock: product.stock <= 5 ? `Low Stock: ${product.stock} units` : `In Stock: ${product.stock} units`,
    price: formatCurrency(product.price),
    change: product.isActive ? "Active" : "Inactive",
  }));

  const categoryPoints = [
    { label: "Products", value: totalProducts },
    { label: "Orders", value: totalOrders },
  ];

  const lineChartPoints = recentOrders.slice(0, 5).map((order, i) => ({
    label: formatDate(new Date(order.createdAt)),
    value: Math.round(order.totalAmount),
  }));

  if (lineChartPoints.length === 0) {
    lineChartPoints.push({ label: "No data", value: 0 });
  }

  return (
    <>
      <Header
        title="Store Overview"
        subtitle="Welcome back, here's what's happening with your store today."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            change={card.change}
            trend={card.trend}
          />
        ))}
      </section>

      <ChartContainer
        title="Sales Performance"
        subtitle="Recent order amounts"
        points={lineChartPoints}
        categories={categoryPoints}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        <OrdersTable orders={mappedOrders} viewAllHref="/dashboard/orders" />
        <ProductList products={mappedProducts} manageHref="/dashboard/products" />
      </section>
    </>
  );
}
