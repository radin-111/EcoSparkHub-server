import z from "zod";

export const categoryValidationSchema = z.object({
  name: z.string().min(3, "Category name is required"),
  description: z.string().optional(),
});

export const categoryUpdateValidationSchema = z
  .object({
    name: z.string().min(3, "Category name is required"),
    description: z.string(),
  })
  .partial();
