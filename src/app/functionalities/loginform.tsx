"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

/* ------------------ Schema ------------------ */
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/* ------------------ Component ------------------ */
export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await authClient.signIn.email(
      {
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
    <div className=" flex items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-xl  shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-sm text-gray-500">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black text-white py-2 font-medium hover:bg-gray-900 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* OAuth Buttons */}
          <button
            type="button"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"
          >
            <Image src="/google.svg" alt="Google" width={18} height={18} />
            Sign in with Google
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"
          >
            <Image src="/github.svg" alt="GitHub" width={18} height={18} />
            Sign in with GitHub
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-black font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
