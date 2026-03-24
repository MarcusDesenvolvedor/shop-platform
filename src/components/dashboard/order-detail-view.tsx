"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { apiPost } from "@/lib/api";
import type { OrderDetail } from "@/features/order/order.types";

type OrderDetailViewProps = {
  order: OrderDetail;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const canConfirmPayment = order.status === "PENDING_PAYMENT";

  async function handleConfirmPayment() {
    setIsConfirming(true);
    try {
      await apiPost(`/api/orders/${order.id}/confirm-payment`, {});
      toast.success("Payment confirmed successfully");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to confirm payment";
      toast.error(message);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/orders"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-semibold">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-slate-500">{order.customer.phone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Address</p>
                <p className="text-slate-700">
                  {order.customer.street}, {order.customer.number}
                </p>
                <p className="text-slate-700">
                  {order.customer.city}, {order.customer.state}
                </p>
                <p className="text-slate-700">{order.customer.country}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Identification</p>
                <p className="text-slate-700">{order.customer.identificationNumber}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-medium">
                  {order.paymentStatus === "CONFIRMED" ? "Confirmed" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="font-medium">PIX (Simulated)</span>
              </div>
              {canConfirmPayment ? (
                <Button
                  onClick={handleConfirmPayment}
                  disabled={isConfirming}
                  className="w-full"
                >
                  {isConfirming ? "Confirming..." : "Confirm Payment"}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
