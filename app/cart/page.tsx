import CartPage from "@/components/CartPage";
import { fetchAddresses } from "@/utils/actions/address.actions";

export default async function Cart() {
  const addresses = await fetchAddresses();
  return (
    <>
      {" "}
      <CartPage addresses={addresses} />
    </>
  );
}
