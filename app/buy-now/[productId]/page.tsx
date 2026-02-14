import BuyNowPage from "@/components/BuyNowPage";
import { fetchAddresses } from "@/utils/actions/address.actions";
import { fetchProductById } from "@/utils/actions/product.action";

export default async function BuyNow({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await fetchProductById(productId);
  const addresses = await fetchAddresses();
  return <BuyNowPage product={product} addresses={addresses} />;
}
