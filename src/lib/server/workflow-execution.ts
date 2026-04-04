import "server-only";

import { CATALOG_NODE_TYPES, type CatalogNodeType } from "@/config/node-catalog";
import { Nodetype } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import { sortNodesTopologically } from "@/lib/topological-sort";

const HTTP_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const GENERIC_CATALOG_NODE_TYPES = new Set<CatalogNodeType>(
  CATALOG_NODE_TYPES.filter(
    (type): type is Exclude<CatalogNodeType, typeof Nodetype.HTTPREQUEST> =>
      type !== Nodetype.HTTPREQUEST,
  ),
);

export type WorkflowExecutionNodeResult = {
  nodeId: string;
  type: string;
  status: "success" | "error" | "skipped";
  output?: unknown;
  error?: string;
};

export type WorkflowExecutionOutput = {
  workflowId: string;
  nodeCount: number;
  connectionCount: number;
  nodes: Array<{
    id: string;
    type: string;
    position: unknown;
    data: unknown;
  }>;
  connections: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle: string | null;
    targetHandle: string | null;
  }>;
  results: WorkflowExecutionNodeResult[];
};

const parseHttpNodeData = (data: unknown) => {
  const payload = (data ?? {}) as {
    method?: unknown;
    url?: unknown;
    body?: unknown;
  };

  const method =
    typeof payload.method === "string" && HTTP_METHODS.has(payload.method.toUpperCase())
      ? payload.method.toUpperCase()
      : "GET";
  const url = typeof payload.url === "string" ? payload.url.trim() : "";
  const body = typeof payload.body === "string" ? payload.body : "";

  return { method, url, body };
};

const parseScheduleNodeData = (data: unknown) => {
  const payload = (data ?? {}) as {
    scheduleType?: unknown;
    cronExpression?: unknown;
    intervalValue?: unknown;
    intervalUnit?: unknown;
    timezone?: unknown;
  };

  const scheduleType =
    payload.scheduleType === "interval" ? "interval" : "cron";
  const cronExpression =
    typeof payload.cronExpression === "string" && payload.cronExpression.trim().length > 0
      ? payload.cronExpression.trim()
      : "0 9 * * 1";
  const intervalValue =
    typeof payload.intervalValue === "number" && Number.isFinite(payload.intervalValue)
      ? Math.max(1, Math.floor(payload.intervalValue))
      : 5;
  const intervalUnit =
    payload.intervalUnit === "hours" || payload.intervalUnit === "days"
      ? payload.intervalUnit
      : "minutes";
  const timezone =
    typeof payload.timezone === "string" && payload.timezone.trim().length > 0
      ? payload.timezone.trim()
      : "UTC";

  return {
    scheduleType,
    cronExpression,
    intervalValue,
    intervalUnit,
    timezone,
  };
};

const parseIfSwitchNodeData = (data: unknown) => {
  const payload = (data ?? {}) as {
    mode?: unknown;
    leftOperand?: unknown;
    operator?: unknown;
    rightOperand?: unknown;
    switchValue?: unknown;
    defaultLabel?: unknown;
    cases?: unknown;
  };

  const mode = payload.mode === "switch" ? "switch" : "if";
  const leftOperand =
    typeof payload.leftOperand === "string" ? payload.leftOperand.trim() : "input.status";
  const operator =
    typeof payload.operator === "string" && payload.operator.trim().length > 0
      ? payload.operator.trim()
      : "equals";
  const rightOperand =
    typeof payload.rightOperand === "string" ? payload.rightOperand.trim() : "success";
  const switchValue =
    typeof payload.switchValue === "string" ? payload.switchValue.trim() : "input.type";
  const defaultLabel =
    typeof payload.defaultLabel === "string" && payload.defaultLabel.trim().length > 0
      ? payload.defaultLabel.trim()
      : "Default";
  const cases = Array.isArray(payload.cases)
    ? payload.cases
        .map((entry) => {
          const candidate = entry as { label?: unknown; value?: unknown };
          const label =
            typeof candidate.label === "string" && candidate.label.trim().length > 0
              ? candidate.label.trim()
              : null;
          const value =
            typeof candidate.value === "string" && candidate.value.trim().length > 0
              ? candidate.value.trim()
              : null;

          if (!label || !value) {
            return null;
          }

          return { label, value };
        })
        .filter((entry): entry is { label: string; value: string } => Boolean(entry))
    : [];

  return {
    mode,
    leftOperand,
    operator,
    rightOperand,
    switchValue,
    defaultLabel,
    cases,
  };
};

const parseMergeNodeData = (data: unknown) => {
  const payload = (data ?? {}) as {
    strategy?: unknown;
    joinField?: unknown;
  };

  const strategy =
    payload.strategy === "wait_any" ||
    payload.strategy === "by_index" ||
    payload.strategy === "by_key" ||
    payload.strategy === "append"
      ? payload.strategy
      : "wait_all";

  return {
    strategy,
    joinField:
      typeof payload.joinField === "string" && payload.joinField.trim().length > 0
        ? payload.joinField.trim()
        : "user_id",
  };
};

const executeSingleNode = async (node: {
  id: string;
  type: string;
  data: unknown;
}): Promise<WorkflowExecutionNodeResult> => {
  if (node.type === "EXECUTION" || node.type === "MANUALLTRIGGER") {
    return {
      nodeId: node.id,
      type: node.type,
      status: "success",
      output: {
        message: "Manual trigger executed",
      },
    };
  }

  if (node.type === "HTTPREQUEST") {
    const config = parseHttpNodeData(node.data);

    if (!config.url || config.url === "not configured") {
      return {
        nodeId: node.id,
        type: node.type,
        status: "error",
        error: "Endpoint URL is not configured",
      };
    }

    const requestInit: RequestInit = {
      method: config.method,
    };

    if (config.method !== "GET" && config.body.trim().length > 0) {
      requestInit.body = config.body;
      requestInit.headers = {
        "content-type": "application/json",
      };
    }

    try {
      const response = await fetch(config.url, requestInit);
      const contentType = response.headers.get("content-type") ?? "";
      const responseData = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => "");

      if (!response.ok) {
        return {
          nodeId: node.id,
          type: node.type,
          status: "error",
          error: `HTTP ${response.status} ${response.statusText}`,
          output: responseData,
        };
      }

      return {
        nodeId: node.id,
        type: node.type,
        status: "success",
        output: responseData,
      };
    } catch (error) {
      return {
        nodeId: node.id,
        type: node.type,
        status: "error",
        error: error instanceof Error ? error.message : "HTTP request failed",
      };
    }
  }

  if (node.type === "SCHEDULE") {
    const config = parseScheduleNodeData(node.data);

    return {
      nodeId: node.id,
      type: node.type,
      status: "success",
      output: {
        message:
          config.scheduleType === "cron"
            ? `Scheduled with cron: ${config.cronExpression}`
            : `Scheduled every ${config.intervalValue} ${config.intervalUnit}`,
        timezone: config.timezone,
      },
    };
  }

  if (node.type === "IFSWITCH") {
    const config = parseIfSwitchNodeData(node.data);

    return {
      nodeId: node.id,
      type: node.type,
      status: "success",
      output: {
        message:
          config.mode === "if"
            ? `IF ${config.leftOperand} ${config.operator} ${config.rightOperand}`
            : `Switch on ${config.switchValue}`,
        branches:
          config.mode === "if"
            ? ["true", "false"]
            : [...config.cases.map((entry) => entry.label), config.defaultLabel],
      },
    };
  }

  if (node.type === "MERGE") {
    const config = parseMergeNodeData(node.data);

    return {
      nodeId: node.id,
      type: node.type,
      status: "success",
      output: {
        message:
          config.strategy === "by_key"
            ? `Merge by key: ${config.joinField}`
            : `Merge strategy: ${config.strategy}`,
      },
    };
  }

  if (node.type !== Nodetype.HTTPREQUEST && GENERIC_CATALOG_NODE_TYPES.has(node.type as CatalogNodeType)) {
    return {
      nodeId: node.id,
      type: node.type,
      status: "success",
      output: {
        message: `${node.type} node configured`,
        config: node.data,
      },
    };
  }

  return {
    nodeId: node.id,
    type: node.type,
    status: "skipped",
    output: {
      message: "Node type is not executable yet",
    },
  };
};

export const executeWorkflowGraph = async (params: {
  workflowId: string;
  userId: string;
}): Promise<WorkflowExecutionOutput> => {
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: params.workflowId,
      userId: params.userId,
    },
    select: {
      id: true,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found for execution");
  }

  const nodes = await prisma.node.findMany({
    where: {
      workflowId: params.workflowId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const connections = await prisma.connection.findMany({
    where: {
      workflowId: params.workflowId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const sortedNodes = sortNodesTopologically(
    nodes,
    connections.map((connection) => ({
      source: connection.fromnodeid,
      target: connection.tonodeid,
    })),
  );

  const results: WorkflowExecutionNodeResult[] = [];
  for (const node of sortedNodes) {
    const result = await executeSingleNode({
      id: node.id,
      type: node.type,
      data: node.data,
    });
    results.push(result);
  }

  return {
    workflowId: params.workflowId,
    nodeCount: sortedNodes.length,
    connectionCount: connections.length,
    nodes: sortedNodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    connections: connections.map((connection) => ({
      id: connection.id,
      source: connection.fromnodeid,
      target: connection.tonodeid,
      sourceHandle: connection.fromoutput === "main" ? null : connection.fromoutput,
      targetHandle: connection.toinput === "main" ? null : connection.toinput,
    })),
    results,
  };
};
