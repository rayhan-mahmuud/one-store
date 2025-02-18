import ProductList from "@/components/shared/products/product-list";
import { Button } from "@/components/ui/button";
import sampleData from "@/db/sample-data";

export default function HomePage() {
  return (
    <>
      <ProductList data={sampleData.products} title="New Arrival" limit={4} />
    </>
  );
}
