import { z } from "zod";

/** E.164: a leading `+`, a non-zero country digit, then 7-14 more digits. */
const e164Regex = /^\+[1-9]\d{7,14}$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Enter your email address or phone number")
    .max(255)
    .refine(
      (value) =>
        value.includes("@")
          ? z.string().email().safeParse(value).success
          : e164Regex.test(value),
      "Enter a valid email address or an international phone number"
    ),
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name").max(255),
    lastName: z.string().trim().min(1, "Enter your last name").max(255),
    email: z.string().trim().email("Enter a valid email address").max(255),
    phone: z.string().trim().regex(e164Regex, "Enter a valid phone number").max(16),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Use at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords do not match",
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Use at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords do not match",
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const checkoutSchema = z.object({
  address: z.string().trim().min(1, "Enter your street address").max(255),
  city: z.string().trim().min(1, "Enter your city").max(100),
  country: z.string().trim().min(1, "Enter your country").max(100),
  couponCode: z.string().trim().max(50).optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
