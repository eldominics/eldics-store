"use client";

import { useAppContext } from "@/context/AppContext";
import { assets } from "@/public/assets/assets";
import { AddressParams, ProductParams } from "@/shared.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BuyNowPage = ({
  product,
  addresses,
}: {
  product: ProductParams;
  addresses: AddressParams[];
}) => {
  const { session } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const [userAddresses, setUserAddresses] = useState<AddressParams[]>();
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(product.price);
  const [selectedAddress, setSelectedAddress] = useState<AddressParams | null>(
    null
  );
  const increaseQTY = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQTY = () => {
    if (quantity === 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  const handleAddressSelect = (address: AddressParams) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const payNow = async () => {
    try {
      const result = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: totalCost * 100 + product.product_shipping_fee * 100,
          source: "buy-now",
        }),
      });

      const paystackResult = await result.json();

      if (result.status) {
        localStorage.setItem(
          "paymentInformation",
          JSON.stringify({
            userId: session?.user?.id,
            productName: product.name,
            productCategory: product.category,
            quantity: quantity,
            image: product.image_url_array[0],
            amount: totalCost + product.product_shipping_fee,
            userEmail: session?.user?.email,
            fullAddressFields: selectedAddress,
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

  useEffect(() => {
    localStorage.removeItem("paymentInformation");

    if (addresses) {
      setUserAddresses(addresses);
      const defaultAddress = addresses.filter((eachAddress) => {
        return eachAddress.is_default === true;
      });
      setSelectedAddress(defaultAddress[0]);
    }
    setTotalCost(product.price * quantity);
  }, [quantity, product.price, userAddresses, addresses]);

  return (
    <div
      className={`flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20
        }`}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
          <p className="text-2xl md:text-3xl text-gray-500">
            The Product To{" "}
            <span className="font-medium text-[#043033]">Buy</span>
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
              </tr>
            </thead>
            <tbody>
              {product && (
                <tr>
                  <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                    <div>
                      <div className="rounded-lg overflow-hidden bg-gray-500/10 relative w-20 h-20">
                        <Image
                          src={product.image_url_array[0]}
                          alt={product.name}
                          className=" object-cover mix-blend-multiply "
                          fill
                        />
                      </div>
                    </div>
                    <div className="text-sm ">
                      <p className="text-gray-800">{product.name}</p>
                      <p>{product.sizes && product.sizes}</p>
                    </div>
                  </td>
                  <td className="py-4 md:px-4 px-1 text-gray-600">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {product.price}
                  </td>
                  <td className="py-4 md:px-4 px-1">
                    <div className="flex items-center md:gap-2 gap-1">
                      <button onClick={decreaseQTY}>
                        <Image
                          src={assets.decrease_arrow}
                          alt="decrease_arrow"
                          className="w-4 h-4"
                        />
                      </button>

                      <input
                        value={quantity}
                        readOnly
                        type="text"
                        className="w-8 border text-center appearance-none"
                      ></input>

                      <button onClick={increaseQTY}>
                        <Image
                          src={assets.increase_arrow}
                          alt="increase_arrow"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-2">
            {product?.sizes?.map((each, index) => (
              <button
                className={` text-sm rounded-lg px-2 py-1 mr-1 `}
                key={index}
              >
                {each}
              </button>
            ))}
          </div>
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
                      onClick={() => handleAddressSelect(address)}
                      key={index}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    >
                      {address.address}, {address.city}, {address.state},
                      {address.state}
                    </li>
                  ))}
                  <Link
                    href={`/address`}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                  >
                    + Add New Address
                  </Link>
                </ul>
              )}

              <div>
                <label className="text-base font-medium uppercase text-gray-600 block mb-2">
                  Promo Code
                </label>
                <div className="flex flex-col items-start gap-3">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
                  />
                  <button className="bg-black text-white px-9 py-2 hover:bg-[#043033]">
                    Apply
                  </button>
                </div>
              </div>

              <hr className="border-gray-500/30 my-5" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping Fee</p>
                  <p className="font-medium text-gray-800">
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {product.product_shipping_fee}
                  </p>
                </div>

                <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
                  <p>Total</p>
                  <p>
                    {process.env.NEXT_PUBLIC_CURRENCY}
                    {totalCost}
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
              <p className="w-full  text-gray-600 py-3 mt-5">
                **Please Select An Address To Continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;
