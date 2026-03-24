import { notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/product-form";
import { listCategoriesForStore } from "@/features/category/category.service";
import { getProductForStore, ProductNotFoundError } from "@/features/product/product.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

type EditProductPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  let product;
  try {
    product = await getProductForStore(store.id, id);
  } catch (error: unknown) {
    if (error instanceof ProductNotFoundError) {
      notFound();
    }
    throw error;
  }

  const categories = await listCategoriesForStore(store.id);

  return <ProductForm categories={categories} product={product} />;
}
