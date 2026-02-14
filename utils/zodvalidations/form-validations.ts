import { z } from "zod";

export const emailValidationSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});
