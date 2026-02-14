"use client";
import { createOrder } from "@/utils/actions/order.actions";
import Link from "next/link";

import { useEffect } from "react";
import toast from "react-hot-toast";

export const VerifyPayCart = ({
  reference,
  amount,
  email,
}: {
  reference: string;
  amount: number;
  email: string;
}) => {
  useEffect(() => {
    const paymentInfo = JSON.parse(
      localStorage.getItem("paymentInformation") || "{}"
    );
    if (paymentInfo.amount !== amount || paymentInfo.userEmail !== email) {
      toast.error("Payment Verification Error");
      return;
    } else {
      toast.success("Payment Verified Successfully");

      const makeOrder = async () => {
        for (const eachItem of paymentInfo.items) {
          const orderItem = {
            user_id: paymentInfo.userId,
            amount: paymentInfo.amount,
            user_email: paymentInfo.userEmail,
            productName: eachItem.name,
            quantity: eachItem.quantity,
            productCategory: eachItem.category.name,
            productImage: eachItem.image_url_array[0],
            address: paymentInfo.fullAddressFields,
            paymentReference: reference,
          };

          await createOrder(orderItem);
        }
      };

      makeOrder();
    }
  });
  return (
    <div>
      <h1>Verifying Cart Payment</h1>
      <h1>Verifying Payment</h1>
      <p>Payment Reference: {reference}</p>
      <p>Payment Amount: {amount}</p>
      <p>Customer Email: {email}</p>

      <Link href="/orders">Go to orders</Link>
    </div>
  );
};
