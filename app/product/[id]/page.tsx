import ProductDetails from "@/components/ProductDetails";
import { fetchProductById } from "@/utils/actions/product.action";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);
  return (
    <div>
      <ProductDetails product={product} />
    </div>
  );
}
