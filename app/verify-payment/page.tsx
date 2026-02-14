import { VerifyPay } from "@/components/VerifyPay";
import { checkOrder } from "@/utils/actions/order.actions";
import { redirect } from "next/navigation";

export default async function VerifyPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { reference } = await searchParams;

  const orderExist = await checkOrder(reference);

  if (orderExist && orderExist.length > 0) {
    redirect("/");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/verifyPayment/${reference}`,
  );

  const result = await response.json();
  console.log("Payment Verification Result:", result);

  return (
    <VerifyPay
      reference={reference}
      amount={result.data.amount}
      email={result.data.customer.email}
    />
  );
}
