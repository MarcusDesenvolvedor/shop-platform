"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPatch, apiPost } from "@/lib/api";
import { useDashboardStore } from "@/lib/dashboard-store-context";
import type { Category } from "@/features/category/category.types";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
};

type CategoryFormValues = {
  name: string;
};

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const router = useRouter();
  const { storeSlug } = useDashboardStore();
  const isEditing = Boolean(category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: { name: category?.name ?? "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      if (isEditing && category) {
        await apiPatch<Category>(
          `/api/stores/${storeSlug}/categories/${category.id}`,
          { name: values.name }
        );
        toast.success("Category updated");
      } else {
        await apiPost<Category>(
          `/api/stores/${storeSlug}/categories`,
          { name: values.name }
        );
        toast.success("Category created");
      }
      reset();
      onOpenChange(false);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category name."
              : "Create a new category for your products."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Electronics"
              {...register("name", {
                required: "Category name is required",
                minLength: { value: 1, message: "Name cannot be empty" },
                maxLength: { value: 120, message: "Name must be at most 120 characters" },
              })}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
