import ReviewOrderPage from "@/components/ReviewOrderPage";
import { fetchOrderById } from "@/utils/actions/order.actions";

export default async function AddReview({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const orderData = await fetchOrderById(orderId);

  return (
    <>
      <ReviewOrderPage orderData={orderData} />
    </>
  );
}
