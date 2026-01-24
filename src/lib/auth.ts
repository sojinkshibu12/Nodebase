import {checkout,polar,portal} from "@polar-sh/better-auth"
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";


export const auth = betterAuth({
  database: prismaAdapter(prisma,{
    provider: "postgresql",
  }),
  emailAndPassword:{
    enabled: true,
    autoSignIn: true,
  },
      plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "f067b5b4-ecac-48b6-9c75-00a7173affeb",
                            slug: "Nodebase-pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodebase-pro
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal()
            ],
        })
    ]
});