"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { createPortal } from "react-dom";

import { BaseNode } from "@/components/base-node";
import {
  getCatalogNodeDefinition,
  type CatalogField,
  type CatalogNodeType,
} from "@/config/node-catalog";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";
import { Workflownode } from "./workflownode";

type CatalogNodeData = {
  onDeleteNode?: (nodeId: string) => void;
  onUpdateCatalogNode?: (
    nodeId: string,
    type: CatalogNodeType,
    payload: Record<string, unknown>,
  ) => void;
  executionStatus?: NodeExecutionStatus;
  [key: string]: unknown;
};

const FIELD_CLASSNAME =
  "h-10 rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const TEXTAREA_CLASSNAME =
  "min-h-28 rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const getFieldValue = (state: Record<string, unknown>, field: CatalogField) => {
  const value = state[field.key];
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return "";
};

export const CatalogNode = memo((props: NodeProps) => {
  const type = props.type as CatalogNodeType;
  const definition = getCatalogNodeDefinition(type);
  const nodeData = (props.data ?? {}) as CatalogNodeData;
  const onDeleteNode = nodeData.onDeleteNode;
  const onUpdateCatalogNode = nodeData.onUpdateCatalogNode;
  const executionStatus = nodeData.executionStatus;

  const configuredData = {
    ...definition.defaults,
    ...nodeData,
  } as Record<string, unknown>;

  const [openSettings, setOpenSettings] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>(configuredData);

  const resetDraft = () => {
    setDraft({
      ...definition.defaults,
      ...nodeData,
    });
  };

  return (
    <>
      <Workflownode
        name={definition.title}
        description={definition.getSummary(configuredData)}
        ondelete={() => onDeleteNode?.(props.id)}
        onsettings={() => {
          resetDraft();
          setOpenSettings(true);
        }}
      >
        <BaseNode
          className={`size-14 rounded-2xl p-0 ${getNodeExecutionClassName(executionStatus)}`}
        >
          <div className="flex size-full flex-col items-center justify-center text-foreground">
            <span className="text-[9px] font-semibold tracking-[0.22em] text-muted-foreground">
              {definition.category.split(" ")[0]?.toUpperCase() ?? "NODE"}
            </span>
            <span className="mt-0.5 text-[11px] font-semibold">{definition.badge}</span>
          </div>
        </BaseNode>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </Workflownode>

      {openSettings && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
                onClick={() => setOpenSettings(false)}
                aria-label={`Close ${definition.title} settings`}
              />
              <div className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,250,245,0.98),rgba(255,255,255,1)_24%,rgba(248,250,252,0.98))] shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)]">
                <div className="border-b border-slate-200/80 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {definition.category}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-950">
                        {definition.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{definition.subtitle}</p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      {definition.badge}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          What It Does
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-700">
                          {definition.description}
                        </p>
                        <div className="mt-4 space-y-2">
                          {definition.bullets.map((bullet) => (
                            <div
                              key={bullet}
                              className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm text-slate-700"
                            >
                              {bullet}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-amber-200/80 bg-amber-50/80 p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                          Use Case
                        </p>
                        <p className="mt-3 text-sm leading-6 text-amber-950/90">
                          {definition.useCase}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Edit Node
                      </p>
                      <div className="mt-4 space-y-4">
                        {definition.fields.map((field) => {
                          const value = getFieldValue(draft, field);

                          if (field.type === "textarea") {
                            return (
                              <div key={field.key} className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  {field.label}
                                </label>
                                <textarea
                                  className={TEXTAREA_CLASSNAME}
                                  placeholder={field.placeholder}
                                  rows={field.rows ?? 5}
                                  value={String(value)}
                                  onChange={(event) =>
                                    setDraft((current) => ({
                                      ...current,
                                      [field.key]: event.target.value,
                                    }))
                                  }
                                />
                              </div>
                            );
                          }

                          if (field.type === "select") {
                            return (
                              <div key={field.key} className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-700">
                                  {field.label}
                                </label>
                                <select
                                  className={FIELD_CLASSNAME}
                                  value={String(value)}
                                  onChange={(event) =>
                                    setDraft((current) => ({
                                      ...current,
                                      [field.key]: event.target.value,
                                    }))
                                  }
                                >
                                  {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          }

                          return (
                            <div key={field.key} className="flex flex-col gap-1.5">
                              <label className="text-xs font-medium text-slate-700">
                                {field.label}
                              </label>
                              <input
                                className={FIELD_CLASSNAME}
                                type={field.type}
                                placeholder={field.placeholder}
                                value={String(value)}
                                onChange={(event) =>
                                  setDraft((current) => ({
                                    ...current,
                                    [field.key]:
                                      field.type === "number"
                                        ? Number(event.target.value)
                                        : event.target.value,
                                  }))
                                }
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Summary
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {definition.getSummary(draft)}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="mt-5 h-10 w-full rounded-xl bg-slate-950 text-sm font-medium text-white transition hover:opacity-90"
                        onClick={() => {
                          const payload = definition.fields.reduce<Record<string, unknown>>(
                            (accumulator, field) => {
                              accumulator[field.key] = draft[field.key];
                              return accumulator;
                            },
                            {},
                          );

                          onUpdateCatalogNode?.(props.id, type, payload);
                          setOpenSettings(false);
                        }}
                      >
                        Save
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

CatalogNode.displayName = "CatalogNode";
