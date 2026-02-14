"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";

const OrderPage = ({ orderData }: { orderData: OrderParams }) => {
  return (
    <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="px-5 lg:px-16 xl:px-20">
          <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
            <Image
              src={orderData.image_url}
              alt="alt"
              className="w-full h-auto object-cover mix-blend-multiply"
              width={1280}
              height={720}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
            {orderData.product_name}
          </h1>

          <p className="text-3xl font-medium mt-6">
            {process.env.NEXT_PUBLIC_CURRENCY} {orderData.amount_paid}
          </p>
          <hr className="bg-gray-600 my-6" />
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full max-w-72">
              <tbody>
                <tr>
                  <td className="text-gray-600 font-medium">Region</td>
                  <td className="text-gray-800/50 ">{orderData.region}</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">State</td>
                  <td className="text-gray-800/50 ">{orderData.state}</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">City</td>
                  <td className="text-gray-800/50">{orderData.city}</td>
                </tr>
                <tr>
                  <td className="text-gray-600 font-medium">Phone</td>
                  <td className="text-gray-800/50">
                    {orderData.country_code}
                    {orderData.phone}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <p>Order Status: {orderData.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
