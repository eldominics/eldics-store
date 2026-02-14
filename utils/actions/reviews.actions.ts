"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { OrderParams } from "@/shared.types";

interface ReviewDataParams {
  reviewTitle: string;
  reviewDescription: string;
  productRating: number;
  deliveryRating: number;
  reviewImageUrls: string[];
}
export async function uploadImagesToSupabase(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    console.log("No user found");
    redirect("/login");
  }

  if (!formData) {
    return { success: false };
  }

  try {
    const files = formData.getAll("reviewImages") as File[];
    console.log(files);
    const uploadedImageUrls: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uniqueFileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("review_bucket")
        .upload(uniqueFileName, buffer, {
          contentType: file.type,
        });

      if (error) {
        console.log("Error uploading file:", error.message);
        return { success: false };
      }

      const { data: urlData } = supabase.storage
        .from("review_bucket")
        .getPublicUrl(uniqueFileName);

      uploadedImageUrls.push(urlData.publicUrl);
    }

    return { success: true, imageUrls: uploadedImageUrls };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}

export async function createReview({
  reviewData,
  orderToReview,
}: {
  reviewData: ReviewDataParams;
  orderToReview: OrderParams;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    console.log("No user found");
    redirect("/login");
  }

  const { data: reviewDataFromDB, error } = await supabase
    .from("reviews")
    .insert({
      user_id: userId,
      order_id: orderToReview.id,
      review_images: reviewData.reviewImageUrls,
      review_title: reviewData.reviewTitle,
      review_description: reviewData.reviewDescription,
      product_rating: reviewData.productRating,
      delivery_rating: reviewData.deliveryRating,
      product_image_url: orderToReview.image_url,
      the_quantity: orderToReview.quantity_bought,
      amount_paid: orderToReview.amount_paid,
      product_name: orderToReview.product_name,
    })
    .eq("user_id", userId)
    .select();

  if (error) {
    console.log("Error creating review:", error.message);
    return { success: false, reviewData: null };
  }

  return { success: true, reviewData: reviewDataFromDB };
}
