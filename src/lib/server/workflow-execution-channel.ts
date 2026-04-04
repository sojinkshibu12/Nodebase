import "server-only";

import type { WorkflowExecutionOutput } from "@/lib/server/workflow-execution";

type StoredExecutionResult =
  | { status: "success"; payload: WorkflowExecutionOutput }
  | { status: "error"; message: string };

type PendingExecution = {
  timer: ReturnType<typeof setTimeout>;
  result?: StoredExecutionResult;
  waiters: Array<{
    resolve: (value: WorkflowExecutionOutput) => void;
    reject: (error: Error) => void;
  }>;
};

const EXECUTION_RESULT_TTL_MS = 60_000;

const executionStore = new Map<string, PendingExecution>();

const clearExecution = (requestId: string) => {
  const entry = executionStore.get(requestId);
  if (!entry) {
    return;
  }

  clearTimeout(entry.timer);
  executionStore.delete(requestId);
};

const ensureEntry = (requestId: string) => {
  const existing = executionStore.get(requestId);
  if (existing) {
    return existing;
  }

  const timer = setTimeout(() => {
    executionStore.delete(requestId);
  }, EXECUTION_RESULT_TTL_MS);

  const next: PendingExecution = {
    timer,
    waiters: [],
  };

  executionStore.set(requestId, next);
  return next;
};

const finishExecution = (requestId: string, result: StoredExecutionResult) => {
  const entry = ensureEntry(requestId);
  entry.result = result;

  const waiters = [...entry.waiters];
  entry.waiters = [];

  for (const waiter of waiters) {
    if (result.status === "success") {
      waiter.resolve(result.payload);
      continue;
    }

    waiter.reject(new Error(result.message));
  }
};

export const markWorkflowExecutionSuccess = (
  requestId: string,
  payload: WorkflowExecutionOutput,
) => {
  finishExecution(requestId, {
    status: "success",
    payload,
  });
};

export const markWorkflowExecutionError = (requestId: string, message: string) => {
  finishExecution(requestId, {
    status: "error",
    message,
  });
};

export const waitForWorkflowExecutionResult = async (
  requestId: string,
  timeoutMs = 30_000,
) => {
  const entry = ensureEntry(requestId);

  if (entry.result?.status === "success") {
    const payload = entry.result.payload;
    clearExecution(requestId);
    return payload;
  }

  if (entry.result?.status === "error") {
    const message = entry.result.message;
    clearExecution(requestId);
    throw new Error(message);
  }

  return new Promise<WorkflowExecutionOutput>((resolve, reject) => {
    const waiter = {
      resolve: (value: WorkflowExecutionOutput) => {
        clearTimeout(timeout);
        clearExecution(requestId);
        resolve(value);
      },
      reject: (error: Error) => {
        clearTimeout(timeout);
        clearExecution(requestId);
        reject(error);
      },
    };

    const timeout = setTimeout(() => {
      const current = executionStore.get(requestId);
      if (current) {
        current.waiters = current.waiters.filter((pendingWaiter) => pendingWaiter !== waiter);
      }
      clearExecution(requestId);
      reject(new Error("Timed out waiting for workflow execution result"));
    }, timeoutMs);

    entry.waiters.push(waiter);
  });
};
