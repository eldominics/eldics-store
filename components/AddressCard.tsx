"use client";

import { AddressParams } from "@/shared.types";
import { makeDefaultAddress } from "@/utils/actions/address.actions";
import Link from "next/link";
import toast from "react-hot-toast";

const AddressCard = ({ address }: { address: AddressParams }) => {
  const handleMakeDefaultAddress = async () => {
    const defaultSuccess = await makeDefaultAddress(address.id);
    if (defaultSuccess) {
      toast.success("Address set as default successfully");
    } else {
      toast.error("Failed to set address as default.");
    }
  };
  return (
    <div className="w-full max-w-sm overflow-hidden bg-black rounded-lg shadow-md m-4">
      <div className="px-6 py-2 text-gray-500">
        <h3 className="text-xl font-medium text-center ">
          Region: {address.region}
        </h3>

        <div>
          <div className="w-full mt-4 ">
            <p className="block w-full mt-2  placeholder-gray-500  border rounded-lg border-none focus:outline-none ">
              Address: {address.address}
            </p>
          </div>

          <div className="w-full mt-2 ">
            <p className="block w-full   placeholder-gray-500  border rounded-lg border-none focus:outline-none ">
              State: {address.state}
            </p>
          </div>
          <div className="w-full mt-2 flex flex-row justify-start">
            <p className="block w-full   placeholder-gray-500 order rounded-lg border-none focus:outline-none ">
              City: {address.city}
            </p>
          </div>
          <div className="w-full mt-2 ">
            <p className="block w-full  placeholder-gray-500  border rounded-lg border-none focus:outline-none ">
              Phone: {address.country_code}
              {address.phone}
            </p>
          </div>
          <div className="w-full mt-2 flex flex-row justify-end">
            <Link
              href={``}
              className=" flex-end text-sm font-medium tracking-wide text-[#fce3c7] capitalize transition-colors duration-300 transform  rounded-lg  focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Manage Address
            </Link>
          </div>

          <div className="flex items-center justify-end mt-4">
            {!address.is_default && (
              <button
                onClick={() => {
                  handleMakeDefaultAddress();
                }}
                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#043033] rounded-lg  focus:ring-opacity-50"
              >
                Make Default
              </button>
            )}
            {address.is_default && (
              <button className="px-6 py-2 text-sm font-medium tracking-wide text-slate-500 capitalize ">
                Default Address
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-4 text-center bg-gray-200 ">
        <span className="text-sm text-gray-500 ">
          We use your email to identify you!
        </span>

        <a
          href="#"
          className="mx-2 text-sm font-bold text-[#043033] hover:underline"
        >
          You can&apos;t change that
        </a>
      </div>
    </div>
  );
};

export default AddressCard;
