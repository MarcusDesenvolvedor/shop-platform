"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { apiDelete } from "@/lib/api";
import { useDashboardStore } from "@/lib/dashboard-store-context";
import type { Product } from "@/features/product/product.types";

type ProductsTableProps = {
  products: Product[];
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const { storeSlug } = useDashboardStore();

  const [deleteProduct, setDeleteProduct] = useState<Product | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteProduct) return;

    setIsDeleting(true);
    try {
      await apiDelete(`/api/stores/${storeSlug}/products/${deleteProduct.id}`);
      toast.success("Product deleted");
      setDeleteProduct(undefined);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Button render={<Link href="/dashboard/products/new" />}>
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No products yet. Create your first one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {product.images[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">N/A</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{product.name}</p>
                        <p className="truncate text-xs text-slate-500">{product.brand ?? "No brand"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span className={product.stock <= 5 ? "text-amber-600 font-medium" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteProduct(product)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteConfirmationDialog
        open={Boolean(deleteProduct)}
        onOpenChange={(open) => { if (!open) setDeleteProduct(undefined); }}
        onConfirm={handleDelete}
        title="Delete product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </>
  );
}
