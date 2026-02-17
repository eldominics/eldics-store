import { NextResponse } from "next/server";

export interface VerificationResponse {
  status: boolean;
  message: string;
  data: TransactionData;
}

export interface TransactionData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  receipt_number: string | null;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string; // ISO date string
  created_at: string; // ISO date string
  channel: string;
  currency: string;
  ip_address: string;
  metadata: string;
  log: TransactionLog;
  fees: number;
  fees_split: unknown | null;
  authorization: Authorization;
  customer: Customer;
  plan: unknown | null;
  split: Record<string, unknown>;
  order_id: string | null;
  paidAt: string; // ISO date string
  createdAt: string; // ISO date string
  requested_amount: number;
  pos_transaction_data: unknown | null;
  source: unknown | null;
  fees_breakdown: unknown | null;
  connect: unknown | null;
  transaction_date: string; // ISO date string
  plan_object: Record<string, unknown>;
  subaccount: Record<string, unknown>;
}

export interface TransactionLog {
  start_time: number;
  time_spent: number;
  attempts: number;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: unknown[];
  history: LogHistory[];
}

export interface LogHistory {
  type: string;
  message: string;
  time: number;
}

export interface Authorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
}

export interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  customer_code: string;
  phone: string | null;
  metadata: unknown | null;
  risk_action: string;
  international_format_phone: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  try {
    console.log("Payment API Request Received");

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer sk_test_ce4e2defaa5fa831c6c6a110b3cea6b348b42ece`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.log(
        "Failed verifying transaction from Paystack:",
        response.statusText,
      );
      console.log("Failed response from Paystack:", response);
      return NextResponse.json(
        { error: "Failed to verify Paystack transaction" },
        { status: response.status },
      );
    }
    const result: VerificationResponse = await response.json();
    console.log("Paystack Verification Result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.log("Payment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    console.log("Payment Verified");
  }
}
