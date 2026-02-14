"use client";
import { Navbar } from "@/components/Navbar";

import { assets } from "@/public/assets/assets";
import { AddressParams } from "@/shared.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const CartPage = ({ addresses }: { addresses: AddressParams[] }) => {
  const router = useRouter();
  const { items, decreaseQty, increaseQty } = cartStore((state) => state);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams>();
  const [totalCost, setTotalCost] = useState<number>(0);
  const [deducedShippingFee, setDeducedShippingFee] = useState(0);
  const { session } = useAppContext();
  useEffect(() => {
    setTotalCost(
      items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0)
    );

    setDeducedShippingFee(
      items.reduce((total, item) => {
        return total + item.product_shipping_fee * item.quantity;
      }, 0)
    );

    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress = addresses.filter(
        (eachAddresses) => eachAddresses.is_default === true
      )[0];
      setSelectedAddress(defaultAddress);
    }
  }, [items, addresses]);

  const payNow = async () => {
    try {
      const result = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: totalCost * 100 + deducedShippingFee * 100,
          source: "cart",
        }),
      });

      const paystackResult = await result.json();

      if (result.status) {
        localStorage.setItem(
          "paymentInformation",
          JSON.stringify({
            userId: session?.user?.id,
            userEmail: session?.user?.email,
            fullAddressFields: selectedAddress,
            items: items,
            amount: totalCost * 100 + deducedShippingFee * 100,
          })
        );
        router.push(paystackResult.data.authorization_url);
      }
    } catch (error) {
      console.log("Payment Error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      console.log("Payment Processed");
    }
  };
  return (
    <>
      <Navbar />

      <div
        className={`flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-[#043033]">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">
              {items ? items.length : 0} items
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {items &&
                  items.map((eachItem, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                          <div>
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 relative w-20 h-20">
                              <Image
                                src={eachItem.image_url_array[0]}
                                alt={eachItem.name}
                                className=" object-cover mix-blend-multiply "
                                fill
                              />
                            </div>
                            <button className="md:hidden text-xs text-[#fce3c7] bg-black rounded-2xl py-1 px-2 mt-1">
                              Remove
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-800">{eachItem.name}</p>
                            <button className="text-xs text-[#fce3c7] mt-1 bg-black rounded-2xl py-1 px-2">
                              Remove
                            </button>
                          </div>
                        </td>
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          {process.env.NEXT_PUBLIC_CURRENCY}
                          {eachItem.price}
                        </td>
                        <td className="py-4 md:px-4 px-1">
                          <div className="flex items-center md:gap-2 gap-1">
                            <button onClick={() => decreaseQty(eachItem.id)}>
                              <Image
                                src={assets.decrease_arrow}
                                alt="increase_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                            <input
                              readOnly
                              type="text"
                              value={eachItem.quantity}
                              className="w-8 border text-center appearance-none"
                            ></input>

                            <button onClick={() => increaseQty(eachItem.id)}>
                              <Image
                                src={assets.increase_arrow}
                                alt="increase_arrow"
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 md:px-4 px-1 text-gray-600">
                          {process.env.NEXT_PUBLIC_CURRENCY}
                          {(eachItem.price * eachItem.quantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <button className="group flex items-center mt-6 gap-2 text-[#fce3c7] bg-black rounded-2xl py-2 px-4 hover:bg-gray-800 transition">
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        {/* <OrderSummary /> */}
        <div className="w-full md:w-96 bg-gray-500/5 p-5">
          <h2 className="text-xl md:text-2xl font-medium text-gray-700">
            Order Summary
          </h2>
          <hr className="border-gray-500/30 my-5" />
          <div className="space-y-6">
            <div>
              <label className="text-base font-medium uppercase text-gray-600 block mb-2">
                Select Address
              </label>
              <div className="relative inline-block w-full text-sm border">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
                >
                  <span>
                    {selectedAddress
                      ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}`
                      : "Select Address"}
                  </span>
                  <svg
                    className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-0" : "-rotate-90"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#6B7280"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                    {userAddresses?.map((address, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                      >
                        {address.address}, {address.city}, {address.state},
                        {address.state}
                      </li>
                    ))}
                    <li
                      onClick={() => router.push("/address")}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                    >
                      + Add New Address
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <hr className="border-gray-500/30 my-5" />

            <div className="space-y-4">
              <div className="flex justify-between text-base font-medium">
                <p className="uppercase text-gray-600">Items {items?.length}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping Fee</p>
                <p className="font-medium text-gray-800">
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {deducedShippingFee}
                  {/* {myCartItems?.reduce((total, item) => {
                      const fee = item.cart_item_shipping_fee ?? 0; // default to 0 if undefined
                      return total + fee;
                    }, 0)} */}
                </p>
              </div>

              <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
                <p>Total</p>
                <p>
                  {process.env.NEXT_PUBLIC_CURRENCY}
                  {totalCost}
                  {/* {myCartItems?.reduce((total, item) => {
                      return total + item.price * item.quantity;
                    }, 0)} */}
                </p>
              </div>
            </div>
          </div>

          {selectedAddress ? (
            <button
              onClick={payNow}
              className="bg-black text-white text-center p-3 align-center w-full mt-5 hover:bg-[#043033]"
            >
              Pay Now
            </button>
          ) : (
            <button className="w-full  text-gray-600 py-3 mt-5">
              **Please Select An Address To Continue
            </button>
          )}
        </div>

        {/* end of summary */}
      </div>
    </>
  );
};

export default CartPage;
