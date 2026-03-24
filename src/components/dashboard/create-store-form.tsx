"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import type { Store } from "@/features/store/store.types";

type CreateStoreFormValues = {
  name: string;
};

export function CreateStoreForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreFormValues>({
    defaultValues: { name: "" },
  });

  async function onSubmit(values: CreateStoreFormValues) {
    try {
      await apiPost<Store>("/api/stores", { name: values.name });
      toast.success("Store created successfully!");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create store";
      toast.error(message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your store</CardTitle>
          <CardDescription>
            Give your store a name to get started. You can change it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store name</Label>
              <Input
                id="name"
                placeholder="My Awesome Store"
                {...register("name", {
                  required: "Store name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 120, message: "Name must be at most 120 characters" },
                })}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create store"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
