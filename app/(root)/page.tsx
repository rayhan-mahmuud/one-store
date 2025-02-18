import ProductList from "@/components/shared/products/product-list";
import { getLatestProducts } from "@/lib/actions/product-actions";

export default async function HomePage() {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList data={latestProducts} title="New Arrival" limit={4} />
    </>
  );
}
