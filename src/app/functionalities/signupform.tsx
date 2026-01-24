"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/* ------------------ Schema ------------------ */
const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

/* ------------------ Component ------------------ */
export default function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    await authClient.signUp.email(
      {
        name: data.email,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl  p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Create an Account</h1>
          <p className="text-sm text-gray-500">
            Sign up to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black py-2 font-medium text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          {/* OAuth */}
          <button
            type="button"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"
          >
            <Image src="/google.svg" alt="Google" width={18} height={18} />
            Sign up with Google
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"
          >
            <Image src="/github.svg" alt="GitHub" width={18} height={18} />
            Sign up with GitHub
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
