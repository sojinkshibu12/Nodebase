import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createDeepSeek } from '@ai-sdk/deepseek';
import { z } from "zod";
import { NonRetriableError } from "inngest";
import { executeWorkflowGraph } from "@/lib/server/workflow-execution";
import { markWorkflowExecutionError, markWorkflowExecutionSuccess } from "@/lib/server/workflow-execution-channel";

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

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflow/execute.requested" },
  async ({ event }) => {
    try {
      const payload = z.object({
        workflowId: z.string().min(1, "workflowId is required"),
        userId: z.string().min(1, "userId is required"),
        requestId: z.string().min(1, "requestId is required"),
      }).parse(event.data);

      const executionResult = await executeWorkflowGraph({
        workflowId: payload.workflowId,
        userId: payload.userId,
      });

      markWorkflowExecutionSuccess(payload.requestId, executionResult);

      return executionResult;
    } catch (error) {
      if (error instanceof NonRetriableError) {
        const requestId =
          event.data &&
          typeof event.data === "object" &&
          typeof (event.data as { requestId?: unknown }).requestId === "string"
            ? (event.data as { requestId: string }).requestId
            : null;

        if (requestId) {
          markWorkflowExecutionError(requestId, error.message);
        }

        throw error;
      }

      const message =
        error instanceof Error ? error.message : "Failed to execute workflow";

      const requestId =
        event.data &&
        typeof event.data === "object" &&
        typeof (event.data as { requestId?: unknown }).requestId === "string"
          ? (event.data as { requestId: string }).requestId
          : null;

      if (requestId) {
        markWorkflowExecutionError(requestId, message);
      }

      throw new NonRetriableError(message);
    }
  },
);
