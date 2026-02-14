"use client";

import { createOrder } from "@/utils/actions/order.actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const VerifyPay = ({
  reference,
  amount,
  email,
}: {
  reference: string;
  amount: number;
  email: string;
}) => {
  const router = useRouter();
  useEffect(() => {
    const paymentInfo = JSON.parse(
      localStorage.getItem("paymentInformation") || "{}"
    );
    if (
      paymentInfo.amount !== amount / 100 ||
      paymentInfo.userEmail !== email
    ) {
      toast.error("Payment Verification Error");
      return;
    } else {
      toast.success("Payment Verified Successfully");

      const makeOrder = async () => {
        const localStorageItems = JSON.parse(
          localStorage.getItem("paymentInformation") || "{}"
        );
        const orderItems = {
          user_id: localStorageItems.userId,
          amount: localStorageItems.amount,
          user_email: localStorageItems.userEmail,
          productName: localStorageItems.productName,
          quantity: localStorageItems.quantity,
          productCategory: localStorageItems.productCategory,
          productImage: localStorageItems.image,
          address: localStorageItems.fullAddressFields,
          paymentReference: reference,
        };

        const orderId = await createOrder(orderItems);
        router.replace(`/order/${orderId}`);
      };

      makeOrder();
    }
  });
  return (
    <div>
      <h1>Verifying Payment</h1>
      <p>Payment Reference: {reference}</p>
      <p>Payment Amount: {amount}</p>
      <p>Customer Email: {email}</p>
    </div>
  );
};
