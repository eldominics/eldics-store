import OrderPage from "@/components/OrderPage";
import { fetchOrderById } from "@/utils/actions/order.actions";

export default async function Order({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const orderData = await fetchOrderById(orderId);

  return <OrderPage orderData={orderData} />;
}
