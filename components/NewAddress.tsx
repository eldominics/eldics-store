"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assets } from "@/public/assets/assets";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { saveAddressDB } from "@/utils/actions/address.actions";

const NewAddress = () => {
  const router = useRouter();
  const [userAddressDetails, setUserAddressDetails] = useState({
    region: "",
    title: "",
    address: "",
    state: "",
    city: "",
    phone: "",
    flag: "",
    countryCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [openRegion, setOpenRegion] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<{
    region: string;
    code: string;
    flag: string;
  }>();
  const regionRef = useRef<HTMLDivElement>(null);
  const allRegions = [
    { region: "Nigeria", code: "+234", flag: "🇳🇬" },
    { region: "Ghana", code: "+233", flag: "🇬🇭" },
  ];

  const disabled =
    !userAddressDetails.region ||
    !userAddressDetails.title ||
    !userAddressDetails.address ||
    !userAddressDetails.state ||
    !userAddressDetails.city ||
    !userAddressDetails.phone;

  const handleAddress = async () => {
    try {
      if (
        !userAddressDetails.address ||
        !userAddressDetails.region ||
        !userAddressDetails.phone ||
        !userAddressDetails.state ||
        !userAddressDetails.title
      ) {
        return;
      }
      //call function to save address to supabase database
      const saveResult = await saveAddressDB(userAddressDetails);

      if (saveResult.success === false) {
        toast.error("Your address wasn't saved yet. Please try again.");
        return;
      }

      toast.success("Address saved successfully");
      setUserAddressDetails({
        region: "",
        title: "",
        address: "",
        state: "",
        city: "",
        phone: "",
        flag: "",
        countryCode: "",
      });
      router.back();
    } catch (error) {
      console.log("error saving address", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        regionRef.current &&
        !regionRef.current.contains(event.target as Node)
      ) {
        setOpenRegion(false);
      }
    };

    const handleScroll = () => {
      setOpenRegion(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <div className="w-full">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping{" "}
            <span className="font-semibold text-[#1a9376]">Address</span>
          </p>
          <div className="space-y-3 max-w-sm mt-10">
            {/* for region */}
            <div className="relative inline-flex w-[320px]">
              <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                <button
                  onClick={() => setOpenRegion(!openRegion)}
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                >
                  Country/Region
                </button>

                <button
                  onClick={() => setOpenRegion(!openRegion)}
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                  aria-label="Menu"
                >
                  {!openRegion && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 15.75 12 8.25l7.5 7.5"
                      />
                    </svg>
                  )}

                  {openRegion && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  )}
                </button>
              </span>

              {/* Hidden input to be submitted */}
              <input
                type="hidden"
                name="region"
                value={userAddressDetails.region.trim()}
              />

              {openRegion && (
                <div
                  ref={regionRef}
                  role="menu"
                  className="w-[100%] absolute end-0 top-12 z-auto  overflow-hidden rounded border border-gray-300 bg-black  shadow-sm flex flex-col items-start"
                >
                  {allRegions.map((eachRegion, index) => (
                    <input
                      key={index}
                      readOnly
                      onClick={() => {
                        setUserAddressDetails((prevState) => ({
                          ...prevState,
                          region: `${eachRegion.region.trim()}`,
                          countryCode: `${eachRegion.code.trim()}`,
                          flag: `${eachRegion.flag.trim()}`,
                        }));
                        setSelectedRegion(eachRegion);
                        setOpenRegion(false);
                      }}
                      className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-gray-400 w-full "
                      role="menuitem"
                      value={eachRegion.region}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* end region */}

            <h2 className="text-black text-3xl">{userAddressDetails.region}</h2>
            <input
              className="px-2 py-2.5 focus:border-[#1a9376] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="The Title Of The Address e.g.Home "
              name="title"
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  title: e.target.value,
                })
              }
              value={userAddressDetails.title}
            />
            <textarea
              className="px-2 py-2.5 focus:border-[#1a9376] transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
              rows={4}
              placeholder="Full Address e.g number 9 Solanke Ebube Street"
              name="address"
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  address: e.target.value,
                })
              }
              value={userAddressDetails.address}
            ></textarea>
            <input
              className="px-2 py-2.5 focus:border-[#1a9376] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="Just the name of the State e.g Anambra"
              name="state"
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  state: e.target.value,
                })
              }
              value={userAddressDetails.state}
            />
            <input
              className="px-2 py-2.5 focus:border-[#1a9376] transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
              type="text"
              placeholder="City e.g Lagos. "
              name="city"
              onChange={(e) =>
                setUserAddressDetails({
                  ...userAddressDetails,
                  city: e.target.value.trim(),
                })
              }
              value={userAddressDetails.city}
            />

            <div className="flex space-x-3">
              <div className="w-full max-w-xs">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-400"
                ></label>
                <div className="flex">
                  <div className="relative inline-flex items-center px-3 py-2 border border-gray-600 bg-gray-800 rounded-l-md w-40">
                    <select
                      className="appearance-none bg-transparent focus:outline-none text-sm text-gray-300 w-full"
                      name="country-code"
                      id="country-code"
                    >
                      {!userAddressDetails.region && (
                        <option value="" data-countrycode="">
                          Select Region Above
                        </option>
                      )}
                      {userAddressDetails.region && (
                        <option
                          value={selectedRegion?.region}
                          data-countrycode={selectedRegion?.code}
                        >
                          {selectedRegion?.flag}
                          {selectedRegion?.code}
                        </option>
                      )}
                    </select>

                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                      className="w-4 h-4 ml-2 text-gray-400 absolute right-2 pointer-events-none"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      ></path>
                    </svg> */}
                  </div>
                  <input
                    onChange={(e) =>
                      setUserAddressDetails({
                        ...userAddressDetails,
                        phone: e.target.value.trim(),
                      })
                    }
                    disabled={!userAddressDetails.region}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-900 text-gray-300 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Phone number"
                    name="phone"
                    id="phone"
                    type="tel"
                  />
                </div>
              </div>
            </div>
            <p className="text-black ">
              {userAddressDetails.region &&
                userAddressDetails.phone &&
                `This is your phone number: ${selectedRegion?.code} ${userAddressDetails.phone}`}
            </p>

            {!userAddressDetails.region && (
              <button className=" text-gray-600 py-3 text-sm">
                <span className="text-red-400">***</span>Please Select A region
                Above.
                <span className="text-red-400">***</span>
              </button>
            )}
            {disabled && (
              <button className=" text-gray-600 py-3 text-sm">
                <span className="text-red-400">***</span>All Fields Must Be
                Filled To Continue
                <span className="text-red-400">***</span>
              </button>
            )}
          </div>
          <button
            disabled={disabled}
            onClick={() => {
              handleAddress();
            }}
            type="submit"
            className={`max-w-sm w-full mt-6  ${
              disabled ? "bg-gray-400" : "bg-[#1a9376]"
            } text-white py-3 hover:bg-black uppercase`}
          >
            {loading ? "Saving Address" : "Save address"}
          </button>
        </div>
        <Image
          className="md:mr-16 mt-16 md:mt-0"
          src={assets.my_location_image}
          alt="my_location_image"
        />
      </div>
    </>
  );
};

export default NewAddress;
