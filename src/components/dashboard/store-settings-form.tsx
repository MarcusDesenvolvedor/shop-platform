"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiPatch } from "@/lib/api";
import { useDashboardStore } from "@/lib/dashboard-store-context";
import type { Store } from "@/features/store/store.types";

type StoreSettingsFormValues = {
  name: string;
  coverImageUrl: string;
};

type StoreSettingsFormProps = {
  store: {
    name: string;
    slug: string;
    coverImageUrl: string | null;
  };
  userEmail: string;
  userName: string;
};

export function StoreSettingsForm({ store, userEmail, userName }: StoreSettingsFormProps) {
  const router = useRouter();
  const { storeSlug } = useDashboardStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<StoreSettingsFormValues>({
    defaultValues: {
      name: store.name,
      coverImageUrl: store.coverImageUrl ?? "",
    },
  });

  async function onSubmit(values: StoreSettingsFormValues) {
    try {
      await apiPatch<Store>(`/api/stores/${storeSlug}`, {
        name: values.name,
        coverImageUrl: values.coverImageUrl.trim() ? values.coverImageUrl.trim() : null,
      });
      toast.success("Store settings updated");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update store";
      toast.error(message);
    }
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Manage your store settings and profile</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Store information</CardTitle>
            <CardDescription>
              Update your store name and the hero image on your public storefront. The slug is
              auto-generated from the name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-cover-image">Store cover image (public)</Label>
                <Input
                  id="store-cover-image"
                  type="url"
                  placeholder="https://example.com/banner.jpg"
                  {...register("coverImageUrl", {
                    validate: (value) => {
                      const trimmed = value.trim();
                      if (!trimmed) {
                        return true;
                      }
                      if (trimmed.length > 16384) {
                        return "URL is too long (max 16384 characters)";
                      }
                      try {
                        const u = new URL(trimmed);
                        if (u.protocol !== "http:" && u.protocol !== "https:") {
                          return "Use an https:// or http:// image link";
                        }
                        return true;
                      } catch {
                        return "Enter a valid image URL";
                      }
                    },
                  })}
                />
                {errors.coverImageUrl ? (
                  <p className="text-sm text-destructive">{errors.coverImageUrl.message}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Shown as the main photo on your public store page. Leave empty to use the first
                    product image as fallback.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-name">Store name</Label>
                <Input
                  id="store-name"
                  {...register("name", {
                    required: "Store name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: { value: 120, message: "Max 120 characters" },
                  })}
                />
                {errors.name ? (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Store URL</Label>
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  <span>/store/</span>
                  <span className="font-medium text-slate-700">{store.slug}</span>
                </div>
                <p className="text-xs text-slate-500">
                  This is auto-generated from your store name.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information from Clerk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-slate-400">Name</p>
              <p className="text-sm font-medium text-slate-900">{userName}</p>
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase text-slate-400">Email</p>
              <p className="text-sm text-slate-700">{userEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
