import { ProductsTable } from "@/components/dashboard/products-table";
import { listProductsForStore } from "@/features/product/product.service";
import { listStoresForOwner } from "@/features/store/store.service";
import { requireSynchronizedAuthUser } from "@/lib/auth";

export default async function ProductsPage() {
  const authUser = await requireSynchronizedAuthUser();
  const stores = await listStoresForOwner(authUser.id);
  const store = stores[0];

  if (!store) {
    return null;
  }

  const products = await listProductsForStore(store.id);

  return <ProductsTable products={products} />;
}
