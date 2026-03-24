"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { CategoryFormDialog } from "@/components/dashboard/category-form-dialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { apiDelete } from "@/lib/api";
import { useDashboardStore } from "@/lib/dashboard-store-context";
import type { Category } from "@/features/category/category.types";

type CategoriesTableProps = {
  categories: Category[];
};

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const { storeSlug } = useDashboardStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();
  const [deleteCategory, setDeleteCategory] = useState<Category | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteCategory) return;

    setIsDeleting(true);
    try {
      await apiDelete(`/api/stores/${storeSlug}/categories/${deleteCategory.id}`);
      toast.success("Category deleted");
      setDeleteCategory(undefined);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No categories yet. Create your first one.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-slate-500">
                    {formatDate(category.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditCategory(category)}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteCategory(category)}
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

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {editCategory ? (
        <CategoryFormDialog
          key={editCategory.id}
          open={Boolean(editCategory)}
          onOpenChange={(open) => { if (!open) setEditCategory(undefined); }}
          category={editCategory}
        />
      ) : null}

      <DeleteConfirmationDialog
        open={Boolean(deleteCategory)}
        onOpenChange={(open) => { if (!open) setDeleteCategory(undefined); }}
        onConfirm={handleDelete}
        title="Delete category"
        description="Are you sure you want to delete this category? Categories with products cannot be deleted."
        isDeleting={isDeleting}
      />
    </>
  );
}
