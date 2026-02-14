"use client";

import { ProductParams } from "@/shared.types";
import { Navbar } from "./Navbar";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { cartStore } from "./store/cart-store";
import toast from "react-hot-toast";

const ProductDetails = ({ product }: { product: ProductParams }) => {
  const handleAddToCart = () => {
    const addItem = cartStore.getState().addItem;
    addItem(product);
    toast.success("Check Cart");
  };
  return (
    <>
      <Navbar />
      <div className="max-md:p-0 px-6 md:px-16 lg:px-32 pt-14 space-y-10 max-md:mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={product.image_url_array[0]}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_icon}
                  alt="star_icon"
                />
                <Image
                  className="h-4 w-4"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              </div>
              <p>(4.5)</p>
            </div>
            <p className="text-gray-600 mt-3">{product.description}</p>
            <p className="text-3xl font-medium mt-6">
              {process.env.NEXT_PUBLIC_CURRENCY}
              {product?.price}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                {process.env.NEXT_PUBLIC_CURRENCY}
                {product?.offer_price}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Brand</td>
                    <td className="text-gray-800/50 ">{product.brand}</td>
                  </tr>
                  {product?.colors && (
                    <tr>
                      <td className="text-gray-600 font-medium">Colors</td>
                      <td className="text-gray-800/50 ">
                        {product.colors.map((each) => `${each} `)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">
                      {product.category.name}
                    </td>
                  </tr>
                </tbody>
              </table>
              {product.product_comment && (
                <div className="mt-4">
                  <p className="text-black">{product.product_comment}</p>
                </div>
              )}

              <div className="mt-2">
                {product.sizes?.map((each, index) => (
                  <button
                    className={` text-sm rounded-lg px-2 py-1 mr-1 `}
                    key={index}
                  >
                    {each}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 border border-[#043033] text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <Link
                href={`/buy-now/${product.id}`}
                className="w-full py-3.5 bg-[#043033] text-white hover:bg-black transition"
              >
                Buy now
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* extra imges */}
      {product.image_url_array.length > 1 &&
        product.image_url_array.length > 0 && (
          <div className="w-full flex justify-center mt-8 ">
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 w-full max-w-[1000px]">
              {product.image_url_array.map((eachImage, index) => (
                <div
                  key={index}
                  className="w-full md:w-[calc(33.333%-1rem)] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={eachImage}
                    alt={`Product extra image ${index}`}
                    className="object-cover w-full h-auto"
                    width={400}
                    height={400}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  );
};

export default ProductDetails;
