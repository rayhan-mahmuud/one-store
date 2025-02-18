import ProductImages from "@/components/shared/products/product-images";
import ProductPrice from "@/components/shared/products/product-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product-actions";
import { notFound } from "next/navigation";

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} name={product.name} />
          </div>
          <div className="col-span-2 flex flex-col gap-6">
            <p className="text-xs font-semibold">
              {product.brand}
              {" > "}
              {product.category}
            </p>
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p>
              {product.rating} out of {product.numReviews} Reviews
            </p>
            <ProductPrice
              value={product.price}
              className="bg-green-100 text-green-800 rounded-full w-24  px-4 py-2"
            />
            <div className="mt-10">
              <p className="font-semibold border-b">Description:</p>
              <p>{product.description}</p>
            </div>
          </div>

          <div className="col-span-1">
            <Card>
              <CardContent className="px-4 py-2">
                <div className="flex flex-between">
                  <p>Price:</p>
                  <ProductPrice value={product.price} />
                </div>
                <div className="flex flex-between mb-3">
                  <p>Status:</p>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <Button variant="default" className="w-full">
                    Add to Cart
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
