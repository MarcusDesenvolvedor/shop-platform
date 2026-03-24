"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPatch, apiPost } from "@/lib/api";
import { useDashboardStore } from "@/lib/dashboard-store-context";
import type { Product } from "@/features/product/product.types";
import type { Category } from "@/features/category/category.types";

type ProductFormValues = {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  stock: string;
  brand: string;
  isActive: boolean;
  images: { url: string }[];
};

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const { storeSlug } = useDashboardStore();
  const isEditing = Boolean(product);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "",
      brand: product?.brand ?? "",
      isActive: product?.isActive ?? true,
      images: product?.images?.map((img) => ({ url: img.url })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });
  const isActive = watch("isActive");

  async function onSubmit(values: ProductFormValues) {
    const payload = {
      name: values.name,
      description: values.description,
      categoryId: values.categoryId,
      price: Number(values.price),
      stock: Number(values.stock),
      brand: values.brand.trim() || undefined,
      isActive: values.isActive,
      images: values.images.filter((img) => img.url.trim().length > 0),
    };

    try {
      if (isEditing && product) {
        await apiPatch<Product>(
          `/api/stores/${storeSlug}/products/${product.id}`,
          payload
        );
        toast.success("Product updated");
      } else {
        await apiPost<Product>(
          `/api/stores/${storeSlug}/products`,
          payload
        );
        toast.success("Product created");
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isEditing ? "Edit product" : "New product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>General information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Product name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 1, message: "Name cannot be empty" },
                    maxLength: { value: 160, message: "Max 160 characters" },
                  })}
                />
                {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Product description"
                  rows={4}
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 1, message: "Description cannot be empty" },
                    maxLength: { value: 5000, message: "Max 5000 characters" },
                  })}
                />
                {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...register("price", {
                    required: "Price is required",
                    validate: (v) => Number(v) > 0 || "Price must be greater than 0",
                  })}
                />
                {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  {...register("stock", {
                    required: "Stock is required",
                    validate: (v) => Number(v) >= 0 || "Stock must be 0 or more",
                  })}
                />
                {errors.stock ? <p className="text-sm text-destructive">{errors.stock.message}</p> : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Images</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ url: "" })}
                  disabled={fields.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                  Add image
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.length === 0 ? (
                <p className="text-sm text-slate-500">No images added yet.</p>
              ) : null}
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...register(`images.${index}.url`, {
                      required: "URL is required",
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  defaultValue={product?.categoryId ?? ""}
                  onValueChange={(value) => setValue("categoryId", value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("categoryId", { required: "Category is required" })} />
                {errors.categoryId ? <p className="text-sm text-destructive">{errors.categoryId.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand (optional)</Label>
                <Input
                  id="brand"
                  placeholder="Brand name"
                  {...register("brand")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-slate-500">Visible to customers</p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => setValue("isActive", Boolean(checked))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/products")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
