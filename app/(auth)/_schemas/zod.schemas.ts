import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.string().min(2).max(50).email().trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.string().min(2).max(50).email().trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
});

export const VerifyEmailSchema = z.object({
  code: z.string().min(6).max(6).trim(),
});

export const UserUpdateSchema = z
  .object({
    email: z.string().min(2).max(50).email().trim().optional(),
    oldPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim().optional(),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim().optional(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim().optional(),
    logoutFromOtherDevices: z.boolean().optional(),
  })

  .refine(
    (data) => {
      if (data.oldPassword && (!data.newPassword || !data.confirmPassword)) {
        return false;
      }
      return true;
    },
    {
      message: "New password and confirm password are required when old password is provided",
      path: ["newPassword", "confirmPassword"],
    },
  )
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.oldPassword && data.newPassword) {
        return data.newPassword !== data.oldPassword;
      }
      return true;
    },
    {
      message: "New password must be different from the current password",
      path: ["newPassword"],
    },
  );
