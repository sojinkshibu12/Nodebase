import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDeepSeek } from '@ai-sdk/deepseek';

const google = createGoogleGenerativeAI();

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
});


export const testai = inngest.createFunction(
  { id: "geimini-google" },
  { event: "test/ai" },
  async ({ event, step }) => {
    const{ text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: "You are a helpful assistant that provides recipes.",
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });

    return {text}
  },
);

