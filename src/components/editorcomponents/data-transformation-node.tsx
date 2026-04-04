"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { createPortal } from "react-dom";

import { BaseNode } from "@/components/base-node";
import { Nodetype } from "@/generated/prisma/enums";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";
import { Workflownode } from "./workflownode";

type TransformationNodeType =
  | typeof Nodetype.SET
  | typeof Nodetype.CODE
  | typeof Nodetype.FILTER
  | typeof Nodetype.SORT
  | typeof Nodetype.LIMIT
  | typeof Nodetype.SUMMARIZE
  | typeof Nodetype.RENAMEKEYS
  | typeof Nodetype.REMOVEDUPES
  | typeof Nodetype.CONVERT
  | typeof Nodetype.FLATTEN;

type TransformationNodeData = {
  onDeleteNode?: (nodeId: string) => void;
  onUpdateTransformationNode?: (
    nodeId: string,
    type: TransformationNodeType,
    payload: Record<string, unknown>,
  ) => void;
  executionStatus?: NodeExecutionStatus;
  [key: string]: unknown;
};

type TransformationField =
  | {
      key: string;
      label: string;
      type: "text" | "number";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      rows?: number;
    }
  | {
      key: string;
      label: string;
      type: "select";
      options: Array<{ label: string; value: string }>;
    };

type TransformationNodeDefinition = {
  type: TransformationNodeType;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  useCase: string;
  bullets: string[];
  defaults: Record<string, unknown>;
  fields: TransformationField[];
  getSummary: (data: Record<string, unknown>) => string;
};

const FIELD_CLASSNAME =
  "h-10 rounded-xl border border-border/70 bg-background px-3 text-sm shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const TEXTAREA_CLASSNAME =
  "min-h-28 rounded-2xl border border-border/70 bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

const TRANSFORMATION_NODE_DEFINITIONS: Record<
  TransformationNodeType,
  TransformationNodeDefinition
> = {
  [Nodetype.SET]: {
    type: Nodetype.SET,
    title: "Set",
    subtitle: "Map / assign fields",
    badge: "SET",
    description:
      "Maps, creates, or overwrites fields on the data object passing through the workflow.",
    useCase:
      "After an HTTP response, extract only the fields you need and shape them before inserting into PostgreSQL.",
    bullets: [
      "Add new fields to an item",
      "Overwrite existing field values",
      "Rename or restructure the data shape before passing downstream",
      "Set static values or dynamic expressions",
    ],
    defaults: {
      mappingMode: "merge",
      assignments: "user.fullName = firstName + ' ' + lastName\nuser.status = 'active'",
    },
    fields: [
      {
        key: "mappingMode",
        label: "Mode",
        type: "select",
        options: [
          { label: "Merge fields", value: "merge" },
          { label: "Overwrite target", value: "overwrite" },
          { label: "Restructure object", value: "restructure" },
        ],
      },
      {
        key: "assignments",
        label: "Assignments",
        type: "textarea",
        placeholder: "user.fullName = firstName + ' ' + lastName",
        rows: 5,
      },
    ],
    getSummary: (data) => String(data.mappingMode ?? "merge"),
  },
  [Nodetype.CODE]: {
    type: Nodetype.CODE,
    title: "Code",
    subtitle: "JS / Python",
    badge: "CODE",
    description:
      "Write and execute custom logic directly inside the node using JavaScript or Python.",
    useCase:
      "Complex business logic like calculating ATS scores, parsing resumes, or custom Kafka message formatting.",
    bullets: [
      "Full scripting power with loops, conditionals, regex, and math",
      "Transform data in ways no built-in node can",
      "Access all incoming items and return modified items",
      "Import standard libraries",
    ],
    defaults: {
      language: "javascript",
      code: "return items.map((item) => ({ ...item, score: 100 }));",
    },
    fields: [
      {
        key: "language",
        label: "Language",
        type: "select",
        options: [
          { label: "JavaScript", value: "javascript" },
          { label: "Python", value: "python" },
        ],
      },
      {
        key: "code",
        label: "Script",
        type: "textarea",
        placeholder: "return items;",
        rows: 8,
      },
    ],
    getSummary: (data) => String(data.language ?? "javascript"),
  },
  [Nodetype.FILTER]: {
    type: Nodetype.FILTER,
    title: "Filter",
    subtitle: "Keep matching items",
    badge: "FLT",
    description:
      "Evaluates each item against a condition and only passes items that match.",
    useCase:
      "From a Kafka consumer receiving all video events, filter only VIDEO_UPLOADED events.",
    bullets: [
      "Drop items that don't meet criteria",
      "Supports comparisons like equals, contains, greater than, and regex",
      "Acts like a WHERE clause in SQL or .filter() in Java streams",
    ],
    defaults: {
      field: "eventType",
      operator: "equals",
      value: "VIDEO_UPLOADED",
    },
    fields: [
      { key: "field", label: "Field", type: "text", placeholder: "eventType" },
      {
        key: "operator",
        label: "Operator",
        type: "select",
        options: [
          { label: "Equals", value: "equals" },
          { label: "Contains", value: "contains" },
          { label: "Greater than", value: "greater_than" },
          { label: "Regex", value: "regex" },
        ],
      },
      { key: "value", label: "Value", type: "text", placeholder: "VIDEO_UPLOADED" },
    ],
    getSummary: (data) =>
      `${String(data.field ?? "field")} ${String(data.operator ?? "equals")}`,
  },
  [Nodetype.SORT]: {
    type: Nodetype.SORT,
    title: "Sort",
    subtitle: "Order items",
    badge: "SRT",
    description: "Reorders the list of items based on a field value.",
    useCase:
      "Sort job listings by postedAt date before displaying or paginating results.",
    bullets: [
      "Sort ascending or descending",
      "Sort by string, number, or date fields",
      "Supports multi-field sorting",
    ],
    defaults: {
      field: "postedAt",
      direction: "desc",
      valueType: "date",
    },
    fields: [
      { key: "field", label: "Primary field", type: "text", placeholder: "postedAt" },
      {
        key: "direction",
        label: "Direction",
        type: "select",
        options: [
          { label: "Ascending", value: "asc" },
          { label: "Descending", value: "desc" },
        ],
      },
      {
        key: "valueType",
        label: "Value type",
        type: "select",
        options: [
          { label: "String", value: "string" },
          { label: "Number", value: "number" },
          { label: "Date", value: "date" },
        ],
      },
    ],
    getSummary: (data) =>
      `${String(data.field ?? "field")} ${String(data.direction ?? "asc")}`,
  },
  [Nodetype.LIMIT]: {
    type: Nodetype.LIMIT,
    title: "Limit",
    subtitle: "Slice N items",
    badge: "LIM",
    description: "Truncates the item list to a maximum number of items.",
    useCase:
      "After fetching search results from Elasticsearch, limit to top 10 before returning to client.",
    bullets: [
      "Keep only the first N items",
      "Pairs well with Sort for top-N results",
      "Acts like LIMIT in SQL or .limit() in MongoDB",
    ],
    defaults: {
      count: 10,
    },
    fields: [{ key: "count", label: "Max items", type: "number", placeholder: "10" }],
    getSummary: (data) => `Top ${String(data.count ?? 10)}`,
  },
  [Nodetype.SUMMARIZE]: {
    type: Nodetype.SUMMARIZE,
    title: "Summarize",
    subtitle: "Aggregate / group",
    badge: "SUM",
    description: "Groups and aggregates items like a GROUP BY in SQL.",
    useCase:
      "Count total video views per user, or sum application counts per job posting.",
    bullets: [
      "Count, sum, average, min, and max across a field",
      "Group items by a specific key",
      "Collapse many items into summary statistics",
    ],
    defaults: {
      groupBy: "userId",
      operation: "count",
      field: "views",
    },
    fields: [
      { key: "groupBy", label: "Group by", type: "text", placeholder: "userId" },
      {
        key: "operation",
        label: "Operation",
        type: "select",
        options: [
          { label: "Count", value: "count" },
          { label: "Sum", value: "sum" },
          { label: "Average", value: "avg" },
          { label: "Min", value: "min" },
          { label: "Max", value: "max" },
        ],
      },
      { key: "field", label: "Value field", type: "text", placeholder: "views" },
    ],
    getSummary: (data) =>
      `${String(data.operation ?? "count")} by ${String(data.groupBy ?? "group")}`,
  },
  [Nodetype.RENAMEKEYS]: {
    type: Nodetype.RENAMEKEYS,
    title: "Rename Keys",
    subtitle: "Field aliasing",
    badge: "KEY",
    description: "Renames fields on each item without changing their values.",
    useCase:
      "An external API returns jobTitle but your PostgreSQL schema expects job_title before insert.",
    bullets: [
      "Rename keys like userId to user_id",
      "Alias fields to match a target schema",
      "Map API response field names to your DB column names",
    ],
    defaults: {
      mappings: "jobTitle -> job_title\nuserId -> user_id",
    },
    fields: [
      {
        key: "mappings",
        label: "Key mappings",
        type: "textarea",
        placeholder: "jobTitle -> job_title",
        rows: 5,
      },
    ],
    getSummary: () => "Field mapping",
  },
  [Nodetype.REMOVEDUPES]: {
    type: Nodetype.REMOVEDUPES,
    title: "Remove Dupes",
    subtitle: "Deduplicate",
    badge: "DED",
    description: "Removes duplicate items from the list based on a key field.",
    useCase:
      "A Kafka topic replays events. Deduplicate by eventId before processing to ensure idempotency.",
    bullets: [
      "Compare items by one or more fields",
      "Keep only the first or last occurrence",
      "Acts like DISTINCT in SQL",
    ],
    defaults: {
      keyFields: "eventId",
      keep: "first",
    },
    fields: [
      { key: "keyFields", label: "Key fields", type: "text", placeholder: "eventId" },
      {
        key: "keep",
        label: "Keep",
        type: "select",
        options: [
          { label: "First occurrence", value: "first" },
          { label: "Last occurrence", value: "last" },
        ],
      },
    ],
    getSummary: (data) => `${String(data.keyFields ?? "eventId")} · ${String(data.keep ?? "first")}`,
  },
  [Nodetype.CONVERT]: {
    type: Nodetype.CONVERT,
    title: "Convert",
    subtitle: "JSON / CSV / XML",
    badge: "CNV",
    description: "Converts data between different serialization formats.",
    useCase:
      "Read a CSV job listing file, convert to JSON, then insert rows into MongoDB.",
    bullets: [
      "Convert between JSON, CSV, and XML",
      "Parse a CSV string into structured items",
      "Serialize items into XML for a SOAP API",
      "Convert API JSON response to CSV for export",
    ],
    defaults: {
      fromFormat: "json",
      toFormat: "csv",
    },
    fields: [
      {
        key: "fromFormat",
        label: "From",
        type: "select",
        options: [
          { label: "JSON", value: "json" },
          { label: "CSV", value: "csv" },
          { label: "XML", value: "xml" },
        ],
      },
      {
        key: "toFormat",
        label: "To",
        type: "select",
        options: [
          { label: "JSON", value: "json" },
          { label: "CSV", value: "csv" },
          { label: "XML", value: "xml" },
        ],
      },
    ],
    getSummary: (data) =>
      `${String(data.fromFormat ?? "json")} -> ${String(data.toFormat ?? "csv")}`,
  },
  [Nodetype.FLATTEN]: {
    type: Nodetype.FLATTEN,
    title: "Flatten",
    subtitle: "Nested -> flat",
    badge: "FLT",
    description:
      "Takes deeply nested objects or arrays and flattens them into a single-level structure.",
    useCase:
      "Elasticsearch returns nested _source objects. Flatten before mapping to your DTO or entity structure.",
    bullets: [
      "Flatten nested object paths into a single-level structure",
      "Unwrap nested arrays into individual items",
      "Makes nested API responses easier to process downstream",
    ],
    defaults: {
      mode: "object",
      delimiter: ".",
    },
    fields: [
      {
        key: "mode",
        label: "Flatten mode",
        type: "select",
        options: [
          { label: "Flatten object keys", value: "object" },
          { label: "Explode arrays", value: "array" },
          { label: "Both", value: "both" },
        ],
      },
      { key: "delimiter", label: "Path delimiter", type: "text", placeholder: "." },
    ],
    getSummary: (data) => `${String(data.mode ?? "object")} · ${String(data.delimiter ?? ".")}`,
  },
};

export const getTransformationNodeDefinition = (type: TransformationNodeType) =>
  TRANSFORMATION_NODE_DEFINITIONS[type];

export const getTransformationNodeDefaults = (type: TransformationNodeType) => ({
  ...TRANSFORMATION_NODE_DEFINITIONS[type].defaults,
});

const getValueFromData = (data: Record<string, unknown>, field: TransformationField) => {
  const value = data[field.key];

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  const fallback = TRANSFORMATION_NODE_DEFINITIONS[
    data.__type as TransformationNodeType
  ]?.defaults[field.key];

  return typeof fallback === "string" || typeof fallback === "number" ? fallback : "";
};

export const DataTransformationNode = memo((props: NodeProps) => {
  const type = props.type as TransformationNodeType;
  const definition = getTransformationNodeDefinition(type);
  const nodeData = ((props.data ?? {}) as TransformationNodeData) ?? {};
  const executionStatus = nodeData.executionStatus;
  const onDeleteNode = nodeData.onDeleteNode;
  const onUpdateTransformationNode = nodeData.onUpdateTransformationNode;
  const [openSettings, setOpenSettings] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  const configuredData = {
    ...definition.defaults,
    ...nodeData,
    __type: type,
  };

  const resetDraft = () => {
    setDraft({ ...definition.defaults, ...nodeData });
  };

  const formState = { ...configuredData, ...draft };
  const formValues = formState as Record<string, unknown>;

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
              DATA
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
              <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,250,245,0.98),rgba(255,255,255,1)_24%,rgba(248,250,252,0.98))] shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)]">
                <div className="border-b border-slate-200/80 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Data Transformation
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
                        const value = getValueFromData(formState, field);

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
                        {definition.getSummary(formState)}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-5 h-10 w-full rounded-xl bg-slate-950 text-sm font-medium text-white transition hover:opacity-90"
                      onClick={() => {
                        const payload = definition.fields.reduce<Record<string, unknown>>(
                          (accumulator, field) => {
                            accumulator[field.key] = formValues[field.key];
                            return accumulator;
                          },
                          {},
                        );

                        onUpdateTransformationNode?.(props.id, type, payload);
                        setOpenSettings(false);
                      }}
                    >
                      Save
                    </button>
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

DataTransformationNode.displayName = "DataTransformationNode";
