import { NextResponse } from "next/server";

interface PaystackResponse {
  status: string;
  message: string;
  data: {
    access_code: string;
    authorization_url: string;
    reference: string;
  };
}
export async function POST(request: Request) {
  try {
    console.log("Payment API Request Received");
    const { email, amount, source } = await request.json();
    console.log("source===>", source);
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer sk_test_ce4e2defaa5fa831c6c6a110b3cea6b348b42ece`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          callback_url:
            source === "buy-now"
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/verify-payment`
              : `${process.env.NEXT_PUBLIC_SITE_URL}/verify-payment-cart`,
        }),
      },
    );

    if (!response.ok) {
      console.log(
        "Failed response.statustext from Paystack:",
        response.statusText,
      );
      console.log("Failed response from Paystack:", response);
      return NextResponse.json(
        { error: "Failed to initialize Paystack transaction" },
        { status: response.status },
      );
    }
    const result: PaystackResponse = await response.json();
    console.log("Paystack Initialization Result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.log("Payment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    console.log("Payment API Request Processed");
  }
}
