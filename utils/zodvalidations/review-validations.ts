import { z } from "zod";

export const reviewSchema = z.object({
  reviewTitle: z
    .string()
    .min(3, {
      message: "Please write up to three characters for Review Title",
    })
    .trim(),

  reviewDescription: z
    .string()
    .min(10, {
      message: "Please provide up to 10 characters for Review description",
    })
    .trim(),
});

export const reviewImagesSchema = z.object({
  reviewImages: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= 4 * 1024 * 1024, {
          message: "Each file must be less than or equal to 4MB",
        })
        .refine(
          (file) =>
            ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(
              file.type
            ),
          {
            message: "Image must be of type png, jpg, jpeg, or gif",
          }
        )
    )
    .min(1, { message: "At least one image is required" }),
});
