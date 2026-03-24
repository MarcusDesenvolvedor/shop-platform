import { Badge } from "@/components/ui/badge";

type OrderStatusBadgeProps = {
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
};

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING_PAYMENT: { label: "Pending", variant: "outline" },
  PAID: { label: "Paid", variant: "default" },
  CANCELED: { label: "Canceled", variant: "destructive" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: "secondary" as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
