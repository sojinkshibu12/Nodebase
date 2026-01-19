"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useRouter} from "next/navigation";
import Image from "next/image";

/* ------------------ Schema ------------------ */
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>


/* ------------------ Component ------------------ */
export default function Loginform() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {

    await authClient.signIn.email({
        email: data.email, // user email
        password:data.password, // user password -> min 8 characters by default
        callbackURL: "/" // A URL to redirect to after the user verifies their email (optional)
    }, {
        onSuccess: (ctx) => {
            router.push('/');
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
});
  }

  const isPernding = form.formState.isSubmitting;

  return (
    <div className="flex  items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPernding}>
                Login
              </Button>
              <Button variant ="outline" type ="button" className="w-full" disabled={isPernding}>
                <Image src="/google.svg" alt="Google Icon" width={20} height={20} className="mr-2" />
                signIn with Google
              </Button>
              <Button variant ="outline"type="button" className="w-full" disabled={isPernding}>
                <Image src="/github.svg" alt="GitHub Icon" width={20} height={20} className="mr-2" />
                signIn with GitHub
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/signup" className="cursor-pointer text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
