"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitMergeIcon } from "lucide-react";
import { createPortal } from "react-dom";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";

type MergeStrategy = "wait_all" | "wait_any" | "by_index" | "by_key" | "append";

type MergePayload = {
  strategy: MergeStrategy;
  joinField: string;
};

const STRATEGY_OPTIONS: Array<{
  value: MergeStrategy;
  title: string;
  description: string;
}> = [
  { value: "wait_all", title: "Wait for All", description: "Wait for all branches before continuing." },
  { value: "wait_any", title: "Wait for Any", description: "Continue as soon as the first branch completes." },
  { value: "by_index", title: "Merge by Index", description: "Zip branch results together by position." },
  { value: "by_key", title: "Merge by Key", description: "Join branch data using a shared field." },
  { value: "append", title: "Append", description: "Concatenate all branch outputs into one list." },
];

const getMergePayload = (raw: unknown): MergePayload => {
  const payload = (raw ?? {}) as Partial<MergePayload>;

  const strategy = STRATEGY_OPTIONS.some((option) => option.value === payload.strategy)
    ? (payload.strategy as MergeStrategy)
    : "wait_all";

  return {
    strategy,
    joinField:
      typeof payload.joinField === "string" && payload.joinField.trim().length > 0
        ? payload.joinField.trim()
        : "user_id",
  };
};

const getMergeDescription = (payload: MergePayload) => {
  const strategy = STRATEGY_OPTIONS.find((option) => option.value === payload.strategy);
  if (payload.strategy === "by_key") {
    return `${strategy?.title ?? "Merge"} · ${payload.joinField}`;
  }

  return strategy?.title ?? "Merge";
};

export const MergeNode = memo((props: NodeProps) => {
  const nodeData = (props.data ?? {}) as {
    onDeleteNode?: (nodeId: string) => void;
    onUpdateMergeNode?: (nodeId: string, payload: MergePayload) => void;
    executionStatus?: NodeExecutionStatus;
  } & Partial<MergePayload>;

  const onDeleteNode = nodeData.onDeleteNode;
  const onUpdateMergeNode = nodeData.onUpdateMergeNode;
  const executionStatus = nodeData.executionStatus;
  const configuredMerge = getMergePayload(nodeData);

  const [openSettings, setOpenSettings] = useState(false);
  const [strategy, setStrategy] = useState<MergeStrategy>(configuredMerge.strategy);
  const [joinField, setJoinField] = useState(configuredMerge.joinField);

  const resetForm = () => {
    const nextMerge = getMergePayload(nodeData);
    setStrategy(nextMerge.strategy);
    setJoinField(nextMerge.joinField);
  };

  return (
    <>
      <Workflownode
        name="Merge"
        description={getMergeDescription(configuredMerge)}
        ondelete={() => onDeleteNode?.(props.id)}
        onsettings={() => {
          resetForm();
          setOpenSettings(true);
        }}
      >
        <BaseNode
          className={`size-14 rounded-md p-0 ${getNodeExecutionClassName(executionStatus)}`}
        >
          <div className="flex size-full items-center justify-center text-foreground">
            <GitMergeIcon className="size-3.5" />
          </div>
        </BaseNode>
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-background !bg-slate-900"
          style={{ left: -6, transform: "translate(-50%, -50%)" }}
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-background !bg-slate-900"
          style={{ right: -6, transform: "translate(50%, -50%)" }}
        />
      </Workflownode>
      {openSettings && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpenSettings(false)}
                aria-label="Close merge settings"
              />
              <div className="relative z-10 w-full max-w-2xl rounded-xl border bg-background p-4 shadow-xl">
                <h3 className="mb-1 text-sm font-semibold">Merge Settings</h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  Configure how this node combines multiple incoming branches into one flow.
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  {STRATEGY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`rounded-xl border p-3 text-left transition ${
                        strategy === option.value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setStrategy(option.value)}
                    >
                      <p className="text-sm font-semibold">{option.title}</p>
                      <p
                        className={`mt-1 text-xs ${
                          strategy === option.value ? "text-slate-200" : "text-muted-foreground"
                        }`}
                      >
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>

                {strategy === "by_key" ? (
                  <div className="mt-4 flex flex-col gap-1">
                    <label className="text-xs font-medium" htmlFor={`merge-join-field-${props.id}`}>
                      Join field
                    </label>
                    <input
                      id={`merge-join-field-${props.id}`}
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                      value={joinField}
                      onChange={(event) => setJoinField(event.target.value)}
                      placeholder="user_id"
                    />
                  </div>
                ) : null}

                <button
                  type="button"
                  className="mt-5 h-9 w-full rounded-md bg-accent-foreground text-sm font-medium text-white transition hover:opacity-90"
                  onClick={() => {
                    onUpdateMergeNode?.(props.id, {
                      strategy,
                      joinField: joinField.trim() || "user_id",
                    });
                    setOpenSettings(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
});

MergeNode.displayName = "MergeNode";
