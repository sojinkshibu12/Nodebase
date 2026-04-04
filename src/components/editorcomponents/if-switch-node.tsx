"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  ArrowRightIcon,
  GitBranchPlusIcon,
  PlusIcon,
  SplitIcon,
  XIcon,
} from "lucide-react";
import { createPortal } from "react-dom";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";

type IfSwitchCase = {
  label: string;
  value: string;
};

type IfSwitchPayload = {
  mode: "if" | "switch";
  leftOperand: string;
  operator: string;
  rightOperand: string;
  switchValue: string;
  defaultLabel: string;
  cases: IfSwitchCase[];
};

const DEFAULT_CASES: IfSwitchCase[] = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
];

const slugifyHandleId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "branch";

const getIfSwitchPayload = (raw: unknown): IfSwitchPayload => {
  const payload = (raw ?? {}) as Partial<IfSwitchPayload>;
  const cases = Array.isArray(payload.cases)
    ? payload.cases
        .map((entry) => {
          const candidate = entry as Partial<IfSwitchCase>;

          return {
            label:
              typeof candidate.label === "string" && candidate.label.trim().length > 0
                ? candidate.label
                : "Case",
            value:
              typeof candidate.value === "string" && candidate.value.trim().length > 0
                ? candidate.value
                : "",
          };
        })
        .filter((entry) => entry.value.trim().length > 0)
    : DEFAULT_CASES;

  return {
    mode: payload.mode === "switch" ? "switch" : "if",
    leftOperand:
      typeof payload.leftOperand === "string" && payload.leftOperand.trim().length > 0
        ? payload.leftOperand
        : "input.status",
    operator:
      typeof payload.operator === "string" && payload.operator.trim().length > 0
        ? payload.operator
        : "equals",
    rightOperand:
      typeof payload.rightOperand === "string" && payload.rightOperand.trim().length > 0
        ? payload.rightOperand
        : "success",
    switchValue:
      typeof payload.switchValue === "string" && payload.switchValue.trim().length > 0
        ? payload.switchValue
        : "input.type",
    defaultLabel:
      typeof payload.defaultLabel === "string" && payload.defaultLabel.trim().length > 0
        ? payload.defaultLabel
        : "Default",
    cases: cases.length > 0 ? cases : DEFAULT_CASES,
  };
};

const getNodeSummary = (payload: IfSwitchPayload) => {
  if (payload.mode === "if") {
    return `IF ${payload.leftOperand} ${payload.operator} ${payload.rightOperand}`;
  }

  return `Switch on ${payload.switchValue}`;
};

const getBranchHandles = (payload: IfSwitchPayload) => {
  if (payload.mode === "if") {
    return [
      { id: "true", label: "True", tone: "bg-emerald-500/12 text-emerald-700 border-emerald-300/60" },
      { id: "false", label: "False", tone: "bg-rose-500/12 text-rose-700 border-rose-300/60" },
    ];
  }

  return [
    ...payload.cases.map((entry) => ({
      id: `case-${slugifyHandleId(entry.label)}`,
      label: entry.label,
      tone: "bg-amber-500/12 text-amber-800 border-amber-300/60",
    })),
    {
      id: "default",
      label: payload.defaultLabel,
      tone: "bg-slate-500/12 text-slate-700 border-slate-300/60",
    },
  ];
};

const FIELD_CLASSNAME =
  "h-10 rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

export const IfSwitchNode = memo((props: NodeProps) => {
  const nodeData = (props.data ?? {}) as {
    onDeleteNode?: (nodeId: string) => void;
    onUpdateIfSwitchNode?: (nodeId: string, payload: IfSwitchPayload) => void;
    executionStatus?: NodeExecutionStatus;
  } & Partial<IfSwitchPayload>;

  const configuredNode = getIfSwitchPayload(nodeData);
  const handles = getBranchHandles(configuredNode);
  const onDeleteNode = nodeData.onDeleteNode;
  const onUpdateIfSwitchNode = nodeData.onUpdateIfSwitchNode;
  const executionStatus = nodeData.executionStatus;

  const [openSettings, setOpenSettings] = useState(false);
  const [mode, setMode] = useState<"if" | "switch">(configuredNode.mode);
  const [leftOperand, setLeftOperand] = useState(configuredNode.leftOperand);
  const [operator, setOperator] = useState(configuredNode.operator);
  const [rightOperand, setRightOperand] = useState(configuredNode.rightOperand);
  const [switchValue, setSwitchValue] = useState(configuredNode.switchValue);
  const [defaultLabel, setDefaultLabel] = useState(configuredNode.defaultLabel);
  const [cases, setCases] = useState<IfSwitchCase[]>(configuredNode.cases);

  const resetForm = () => {
    const nextConfig = getIfSwitchPayload(nodeData);
    setMode(nextConfig.mode);
    setLeftOperand(nextConfig.leftOperand);
    setOperator(nextConfig.operator);
    setRightOperand(nextConfig.rightOperand);
    setSwitchValue(nextConfig.switchValue);
    setDefaultLabel(nextConfig.defaultLabel);
    setCases(nextConfig.cases);
  };

  return (
    <>
      <Workflownode
        name="IF / Switch"
        description={getNodeSummary(configuredNode)}
        ondelete={() => onDeleteNode?.(props.id)}
        onsettings={() => {
          resetForm();
          setOpenSettings(true);
        }}
      >
        <div className="relative">
          <BaseNode
            className={`size-14 rounded-md p-0 ${getNodeExecutionClassName(executionStatus)}`}
          >
            <div className="flex size-full items-center justify-center text-foreground">
              {configuredNode.mode === "if" ? (
                <GitBranchPlusIcon className="size-3.5" />
              ) : (
                <SplitIcon className="size-3.5" />
              )}
            </div>
          </BaseNode>

          <Handle type="target" position={Position.Left} />
          {handles.map((handle, index) => {
            const top = `${((index + 1) / (handles.length + 1)) * 100}%`;

            return (
              <Handle
                key={handle.id}
                id={handle.id}
                type="source"
                position={Position.Right}
                className="!h-3 !w-3 !pointer-events-auto !border-2 !border-background !bg-slate-900"
                style={{ right: -6, top, transform: "translate(50%, -50%)" }}
              />
            );
          })}
        </div>
      </Workflownode>
      {openSettings && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
                onClick={() => setOpenSettings(false)}
                aria-label="Close IF / Switch settings"
              />
              <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,249,240,0.97),rgba(255,255,255,1)_24%,rgba(248,250,252,0.98))] shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)]">
                <div className="border-b border-slate-200/80 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Core / Flow Control
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-950">IF / Switch Settings</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Configure how this node decides which branch the workflow should follow.
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      {mode === "if" ? "Binary branch" : "Multi-branch"}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 px-6 py-6 lg:grid-cols-[220px_1fr]">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        mode === "if"
                          ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                          : "border-slate-200/80 bg-white/80 text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={() => setMode("if")}
                    >
                      <p className="text-sm font-semibold">IF</p>
                      <p className={`mt-1 text-xs ${mode === "if" ? "text-slate-200" : "text-slate-500"}`}>
                        True/false decision with two output paths.
                      </p>
                    </button>
                    <button
                      type="button"
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        mode === "switch"
                          ? "border-amber-500 bg-amber-500 text-white shadow-lg"
                          : "border-slate-200/80 bg-white/80 text-slate-700 hover:bg-slate-50"
                      }`}
                      onClick={() => setMode("switch")}
                    >
                      <p className="text-sm font-semibold">Switch</p>
                      <p className={`mt-1 text-xs ${mode === "switch" ? "text-amber-50" : "text-slate-500"}`}>
                        Match one value against multiple branch cases.
                      </p>
                    </button>

                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Preview
                      </p>
                      <div className="mt-3 space-y-2">
                        {getBranchHandles({
                          mode,
                          leftOperand,
                          operator,
                          rightOperand,
                          switchValue,
                          defaultLabel,
                          cases,
                        }).map((handle) => (
                          <div
                            key={handle.id}
                            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs ${handle.tone}`}
                          >
                            <span className="font-medium">{handle.label}</span>
                            <ArrowRightIcon className="size-3.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                    {mode === "if" ? (
                      <div className="space-y-5">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Condition</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Compare two values and route to either the `true` or `false` branch.
                          </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Left operand</span>
                            <input
                              id={`if-left-${props.id}`}
                              className={FIELD_CLASSNAME}
                              value={leftOperand}
                              onChange={(event) => setLeftOperand(event.target.value)}
                              placeholder="input.status"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Operator</span>
                            <select
                              id={`if-operator-${props.id}`}
                              className={FIELD_CLASSNAME}
                              value={operator}
                              onChange={(event) => setOperator(event.target.value)}
                            >
                              <option value="equals">equals</option>
                              <option value="not_equals">not equals</option>
                              <option value="contains">contains</option>
                              <option value="greater_than">greater than</option>
                              <option value="less_than">less than</option>
                              <option value="is_empty">is empty</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-slate-600">Right operand</span>
                            <input
                              id={`if-right-${props.id}`}
                              className={FIELD_CLASSNAME}
                              value={rightOperand}
                              onChange={(event) => setRightOperand(event.target.value)}
                              placeholder="success"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Branch Mapping</p>
                          <p className="mt-1 text-xs text-slate-500">
                            Match the switch value against ordered cases, then fall back to a default branch.
                          </p>
                        </div>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium text-slate-600">Switch value</span>
                          <input
                            id={`switch-value-${props.id}`}
                            className={FIELD_CLASSNAME}
                            value={switchValue}
                            onChange={(event) => setSwitchValue(event.target.value)}
                            placeholder="input.type"
                          />
                        </label>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Cases
                            </p>
                            <button
                              type="button"
                              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-950 px-3 text-xs font-medium text-white transition hover:opacity-90"
                              onClick={() =>
                                setCases((current) => [
                                  ...current,
                                  { label: `Case ${current.length + 1}`, value: "" },
                                ])
                              }
                            >
                              <PlusIcon className="size-3.5" />
                              Add case
                            </button>
                          </div>
                          {cases.map((entry, index) => (
                            <div
                              key={`${index}-${entry.label}`}
                              className="grid gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 md:grid-cols-[1fr_1fr_auto]"
                            >
                              <input
                                className={FIELD_CLASSNAME}
                                value={entry.label}
                                onChange={(event) =>
                                  setCases((current) =>
                                    current.map((item, itemIndex) =>
                                      itemIndex === index
                                        ? { ...item, label: event.target.value }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Case label"
                              />
                              <input
                                className={FIELD_CLASSNAME}
                                value={entry.value}
                                onChange={(event) =>
                                  setCases((current) =>
                                    current.map((item, itemIndex) =>
                                      itemIndex === index
                                        ? { ...item, value: event.target.value }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Match value"
                              />
                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center self-end rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                onClick={() =>
                                  setCases((current) =>
                                    current.length > 1
                                      ? current.filter((_, itemIndex) => itemIndex !== index)
                                      : current,
                                  )
                                }
                                aria-label="Remove case"
                              >
                                <XIcon className="size-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium text-slate-600">Default branch label</span>
                          <input
                            id={`default-label-${props.id}`}
                            className={FIELD_CLASSNAME}
                            value={defaultLabel}
                            onChange={(event) => setDefaultLabel(event.target.value)}
                            placeholder="Default"
                          />
                        </label>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        onClick={() => setOpenSettings(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-medium text-white transition hover:opacity-90"
                        onClick={() => {
                          onUpdateIfSwitchNode?.(props.id, {
                            mode,
                            leftOperand: leftOperand.trim() || "input.status",
                            operator: operator.trim() || "equals",
                            rightOperand: rightOperand.trim() || "success",
                            switchValue: switchValue.trim() || "input.type",
                            defaultLabel: defaultLabel.trim() || "Default",
                            cases: cases
                              .map((entry) => ({
                                label: entry.label.trim() || "Case",
                                value: entry.value.trim(),
                              }))
                              .filter((entry) => entry.value.length > 0),
                          });
                          setOpenSettings(false);
                        }}
                      >
                        Save Branch Logic
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
});

IfSwitchNode.displayName = "IfSwitchNode";
