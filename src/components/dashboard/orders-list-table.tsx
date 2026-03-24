"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import type { OrderListItem } from "@/features/order/order.types";

type OrdersListTableProps = {
  orders: OrderListItem[];
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function truncateId(id: string): string {
  return id.slice(0, 8);
}

export function OrdersListTable({ orders }: OrdersListTableProps) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    #{truncateId(order.id)}
                  </TableCell>
                  <TableCell>
                    {order.firstName} {order.lastName}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell className="text-slate-500">{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
