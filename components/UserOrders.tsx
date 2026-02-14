"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";

const UserOrders = ({ userOrders }: { userOrders: OrderParams[] }) => {
  return (
    <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
      <div className="space-y-5">
        <h2 className="text-lg font-medium mt-6">My Orders</h2>
        <div className="max-w-5xl border-t border-gray-300 text-sm">
          {userOrders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
            >
              <div className="flex-1 flex gap-5 max-w-80">
                <Image
                  className="max-w-16 max-h-16 object-cover"
                  src={order.image_url}
                  alt="box_icon"
                  width={150}
                  height={150}
                  quality={100}
                />
                <p className="flex flex-col gap-3">
                  <span className="font-medium text-base">
                    {order.product_name + ` x ${order.quantity_bought}`}
                  </span>
                  <span>Items : {order.quantity_bought}</span>
                  {order.size && <span>Size {order.size}</span>}
                </p>
              </div>
              <div>
                <p>
                  <span>{order.region}</span>

                  <br />
                  <span className="font-medium">{order.address}</span>
                  <br />
                  <span>{`${order.state}, ${order.city}`}</span>
                  <br />
                  <span>{`${order.country_code}${order.phone}`}</span>
                </p>
              </div>
              <div>
                <p>Amount paid</p>
                <p className="font-medium my-auto">
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {order.amount_paid}
                </p>
              </div>
              <div>
                <div className="flex flex-col">
                  <span>
                    Date : {order.created_at ? order.created_at : "N/A"}
                  </span>
                  <span>status: {order.status}</span>
                  <div className="flex flex-row gap-2">
                    {(order.status === "completed" ||
                      order.status === "cancelled") && (
                      <button className="bg-red-400 p-1  rounded-lg ">
                        Delete
                      </button>
                    )}
                    {order.status !== "reviewed" &&
                      order.status !== "processing" &&
                      order.status === "completed" && (
                        <Link
                          href={`/add-review/${order.id}`}
                          className="bg-black text-[#fce3c7] p-1  rounded-lg"
                        >
                          Review product
                        </Link>
                      )}
                    <Link
                      href={`/order/${order.id}`}
                      className="bg-black text-[#fce3c7] p-1  rounded-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
