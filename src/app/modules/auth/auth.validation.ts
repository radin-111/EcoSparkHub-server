import z from "zod";
export const signUpSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is required"),
  password: z.string("Password is required").min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.email("Email is required"),
  password: z.string("Password is required").min(8, "Password must be at least 8 characters"),
});