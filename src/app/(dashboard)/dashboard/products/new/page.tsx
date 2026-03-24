import { ProductForm } from "@/components/dashboard/product-form";
import { listCategoriesForStore } from "@/features/category/category.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

export default async function NewProductPage() {
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  const categories = await listCategoriesForStore(store.id);

  return <ProductForm categories={categories} />;
}
