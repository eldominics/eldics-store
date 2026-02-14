"use client";

import { OrderParams } from "@/shared.types";
import Image from "next/image";
import { useState } from "react";
import StarRating from "./StarRating";
import {
  reviewImagesSchema,
  reviewSchema,
} from "@/utils/zodvalidations/review-validations";
import toast from "react-hot-toast";
import {
  uploadImagesToSupabase,
  createReview,
} from "@/utils/actions/reviews.actions";
import { useRouter } from "next/navigation";

const ReviewOrderPage = ({ orderData }: { orderData: OrderParams }) => {
  const [reviewImageFiles, setReviewImageFiles] = useState<
    (File | undefined)[]
  >([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [productRating, setProductRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Array<Record<string, string>>>(
    []
  );
  const [imagesError, setImagesError] = useState<string[]>([]);

  const colorDisabled =
    !reviewTitle || !reviewDescription || reviewImageFiles.length <= 0;

  const handleSubmitReview = async () => {
    let localError = false;
    const reviewFormValidation = reviewSchema.safeParse({
      reviewTitle,
      reviewDescription,
    });

    const reviewImagesValidation = reviewImagesSchema.safeParse({
      reviewImages: reviewImageFiles,
    });

    const reviewResult = reviewFormValidation.error?.issues.map((each) => {
      return { [each.path[0]]: each.message };
    });

    if (reviewResult) {
      localError = true;
      setFormErrors(reviewResult);
    }

    if (reviewImagesValidation.error?.issues) {
      localError = true;
      setImagesError(
        reviewImagesValidation.error.issues.map((each) => each.message)
      );
    }

    if (localError) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      const imageReviewsFormData = new FormData();
      reviewImageFiles.forEach((file) => {
        if (file) {
          imageReviewsFormData.append("reviewImages", file);
        }
      });
      const imageUrlsInSupabase = await uploadImagesToSupabase(
        imageReviewsFormData
      );

      if (imageUrlsInSupabase.success) {
        const { reviewData } = await createReview({
          orderToReview: orderData,
          reviewData: {
            reviewTitle,
            reviewDescription,
            productRating,
            deliveryRating,
            reviewImageUrls: imageUrlsInSupabase.imageUrls || [],
          },
        });
        if (reviewData) {
          toast.success("Review created successfully!");
          router.push("/");
        } else {
          toast.error("Failed to create review. Please try again.");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setReviewTitle("");
      setReviewDescription("");
      setProductRating(5);
      setDeliveryRating(5);
      setReviewImageFiles([]);
    }
  };
  return (
    <>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* adding the review */}
      <div className="flex-1 min-h-screen flex flex-col justify-between items-center">
        <div className="md:p-10 p-4 space-y-5 max-w-lg">
          {/* image upload code begin */}
          <div>
            <label
              htmlFor="imageFiles"
              className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-[#043033] border-2 border-gray-300 border-dashed cursor-pointer rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>

              <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                Upload Review Images
              </h2>

              <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                Upload or drag & drop your file SVG, PNG, JPG or GIF.{" "}
              </p>

              <input
                onChange={(e) => {
                  setImagesError([]);
                  setReviewImageFiles(
                    e.target.files ? Array.from(e.target.files) : []
                  );
                }}
                id="imageFiles"
                type="file"
                className="hidden"
                multiple
                accept="image/*"
              />
            </label>

            <div className="flex flex-row flex-wrap ">
              {reviewImageFiles &&
                reviewImageFiles.map((eachFile, index) =>
                  eachFile ? (
                    <Image
                      key={index}
                      className="max-w-32 cursor-pointer m-1"
                      src={URL.createObjectURL(eachFile)}
                      alt=""
                      width={100}
                      height={100}
                    />
                  ) : null
                )}
            </div>

            {imagesError &&
              imagesError.map((each, index) => (
                <p key={index} className="block text-sm text-red-400 ">
                  {each}
                </p>
              ))}
          </div>

          {/* end image upload */}
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              Review Title
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => {
                setFormErrors([]);
                setReviewTitle(e.target.value);
              }}
              value={reviewTitle}
              required
            />

            {formErrors &&
              formErrors.map((each, index) => {
                if (each.reviewTitle) {
                  return (
                    <p key={index} className="block text-sm text-red-400 ">
                      {each.reviewTitle}
                    </p>
                  );
                }
              })}
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium"
              htmlFor="product-description"
            >
              Review Description
            </label>
            <textarea
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
              placeholder="Type here"
              onChange={(e) => {
                setFormErrors([]);
                setReviewDescription(e.target.value);
              }}
              value={reviewDescription}
              required
            ></textarea>
            {formErrors &&
              formErrors.map((each, index) => {
                if (each.reviewDescription) {
                  return (
                    <p key={index} className="block text-sm text-red-400 ">
                      {each.reviewDescription}
                    </p>
                  );
                }
              })}
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              Product Rating
            </label>
            <StarRating rating={productRating} setRating={setProductRating} />
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              Delivery Rating
            </label>
            <StarRating rating={deliveryRating} setRating={setDeliveryRating} />
          </div>

          <button
            onClick={handleSubmitReview}
            type="submit"
            className={`px-8 py-2.5  text-white font-medium rounded ${
              colorDisabled ? "bg-gray-500" : "bg-[#043033]"
            }`}
          >
            Submit Review
          </button>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default ReviewOrderPage;
