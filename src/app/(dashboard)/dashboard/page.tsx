import { ChartContainer } from "@/components/ChartContainer";
import { Header } from "@/components/Header";
import { MetricCard, type MetricCardProps } from "@/components/MetricCard";
import { OrdersTable, type OrderItem } from "@/components/OrdersTable";
import { ProductList, type ProductItem } from "@/components/ProductList";
import { Sidebar } from "@/components/Sidebar";

const metricCards: MetricCardProps[] = [
  { label: "Total Revenue", value: "$128,430.00", change: "+12.5%", trend: "up" },
  { label: "Total Orders", value: "1,240", change: "+8.2%", trend: "up" },
  { label: "Total Products", value: "482", change: "0%", trend: "neutral" },
  { label: "Conversion Rate", value: "3.18%", change: "-2.4%", trend: "down" },
];

const lineChartPoints = [
  { label: "01 Jun", value: 22 },
  { label: "08 Jun", value: 38 },
  { label: "15 Jun", value: 33 },
  { label: "22 Jun", value: 57 },
  { label: "29 Jun", value: 49 },
];

const categoryPoints = [
  { label: "Electronics", value: 42 },
  { label: "Apparel", value: 28 },
  { label: "Home Decor", value: 18 },
  { label: "Beauty", value: 12 },
];

const orders: OrderItem[] = [
  { id: "#ORD-9421", customer: "Julian Baker", status: "Paid", total: "$1,240.00", date: "Jun 24, 2024" },
  { id: "#ORD-9420", customer: "Elena Vance", status: "Pending", total: "$450.25", date: "Jun 24, 2024" },
  { id: "#ORD-9419", customer: "Marcus Kovic", status: "Paid", total: "$89.99", date: "Jun 23, 2024" },
  { id: "#ORD-9418", customer: "Arthur Morgan", status: "Paid", total: "$2,100.00", date: "Jun 23, 2024" },
  { id: "#ORD-9417", customer: "Lydia White", status: "Pending", total: "$12.50", date: "Jun 23, 2024" },
];

const products: ProductItem[] = [
  { name: "Premium Chronograph", stock: "In Stock: 142 units", price: "$249.00", change: "+12%" },
  { name: "Studio Headphones", stock: "Low Stock: 5 units", price: "$399.00", change: "+5%" },
  { name: "Elite Performance Runners", stock: "In Stock: 89 units", price: "$159.00", change: "-2%" },
  { name: "Minimalist Mug Set", stock: "In Stock: 210 units", price: "$45.00", change: "0%" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="w-full p-6 lg:p-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
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
            subtitle="Daily revenue trends over the last 30 days"
            points={lineChartPoints}
            categories={categoryPoints}
          />

          <section className="grid gap-4 xl:grid-cols-3">
            <OrdersTable orders={orders} />
            <ProductList products={products} />
          </section>
        </div>
      </main>
    </div>
  );
}
