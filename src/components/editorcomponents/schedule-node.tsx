"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Clock3Icon } from "lucide-react";
import { createPortal } from "react-dom";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";

type SchedulePayload = {
  scheduleType: "cron" | "interval";
  cronExpression: string;
  intervalValue: number;
  intervalUnit: "minutes" | "hours" | "days";
  timezone: string;
};

const getSchedulePayload = (raw: unknown): SchedulePayload => {
  const payload = (raw ?? {}) as Partial<SchedulePayload>;

  return {
    scheduleType: payload.scheduleType === "interval" ? "interval" : "cron",
    cronExpression:
      typeof payload.cronExpression === "string" && payload.cronExpression.trim().length > 0
        ? payload.cronExpression
        : "0 9 * * 1",
    intervalValue:
      typeof payload.intervalValue === "number" && Number.isFinite(payload.intervalValue)
        ? Math.max(1, Math.floor(payload.intervalValue))
        : 5,
    intervalUnit:
      payload.intervalUnit === "hours" || payload.intervalUnit === "days"
        ? payload.intervalUnit
        : "minutes",
    timezone:
      typeof payload.timezone === "string" && payload.timezone.trim().length > 0
        ? payload.timezone
        : "UTC",
  };
};

const getScheduleDescription = (payload: SchedulePayload) => {
  if (payload.scheduleType === "cron") {
    return `${payload.cronExpression} · ${payload.timezone}`;
  }

  return `Every ${payload.intervalValue} ${payload.intervalUnit} · ${payload.timezone}`;
};

export const ScheduleNode = memo((props: NodeProps) => {
  const nodeData = (props.data ?? {}) as {
    onDeleteNode?: (nodeId: string) => void;
    onUpdateScheduleNode?: (nodeId: string, payload: SchedulePayload) => void;
    executionStatus?: NodeExecutionStatus;
  } & Partial<SchedulePayload>;

  const onDeleteNode = nodeData.onDeleteNode;
  const onUpdateScheduleNode = nodeData.onUpdateScheduleNode;
  const executionStatus = nodeData.executionStatus;
  const configuredSchedule = getSchedulePayload(nodeData);

  const [openSettings, setOpenSettings] = useState(false);
  const [scheduleType, setScheduleType] = useState<"cron" | "interval">(
    configuredSchedule.scheduleType,
  );
  const [cronExpression, setCronExpression] = useState(configuredSchedule.cronExpression);
  const [intervalValue, setIntervalValue] = useState(String(configuredSchedule.intervalValue));
  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours" | "days">(
    configuredSchedule.intervalUnit,
  );
  const [timezone, setTimezone] = useState(configuredSchedule.timezone);

  const resetForm = () => {
    const nextSchedule = getSchedulePayload(nodeData);
    setScheduleType(nextSchedule.scheduleType);
    setCronExpression(nextSchedule.cronExpression);
    setIntervalValue(String(nextSchedule.intervalValue));
    setIntervalUnit(nextSchedule.intervalUnit);
    setTimezone(nextSchedule.timezone);
  };

  return (
    <>
      <Workflownode
        name="Schedule"
        description={getScheduleDescription(configuredSchedule)}
        ondelete={() => onDeleteNode?.(props.id)}
        onsettings={() => {
          resetForm();
          setOpenSettings(true);
        }}
      >
        <BaseNode
          className={`size-14 rounded-l-2xl rounded-r-md p-0 ${getNodeExecutionClassName(executionStatus)}`}
        >
          <div className="flex size-full items-center justify-center text-foreground">
            <Clock3Icon className="size-3.5" />
          </div>
        </BaseNode>
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-background !bg-slate-900"
          style={{ left: -6, transform: "translate(-50%, -50%)" }}
        />
      </Workflownode>
      {openSettings && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpenSettings(false)}
                aria-label="Close schedule settings"
              />
              <div className="relative z-10 w-full max-w-lg rounded-xl border bg-background p-4 shadow-xl">
                <h3 className="mb-1 text-sm font-semibold">Schedule Settings</h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  Configure this trigger using a cron expression or a simple recurring interval.
                </p>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`h-9 rounded-md border text-sm transition ${
                      scheduleType === "cron" ? "bg-foreground text-background" : "hover:bg-accent"
                    }`}
                    onClick={() => setScheduleType("cron")}
                  >
                    Cron
                  </button>
                  <button
                    type="button"
                    className={`h-9 rounded-md border text-sm transition ${
                      scheduleType === "interval" ? "bg-foreground text-background" : "hover:bg-accent"
                    }`}
                    onClick={() => setScheduleType("interval")}
                  >
                    Interval
                  </button>
                </div>

                {scheduleType === "cron" ? (
                  <div className="mb-3 flex flex-col gap-1">
                    <label className="text-xs font-medium" htmlFor={`cron-${props.id}`}>
                      Cron expression
                    </label>
                    <input
                      id={`cron-${props.id}`}
                      className="h-9 rounded-md border bg-background px-2 text-sm"
                      value={cronExpression}
                      onChange={(event) => setCronExpression(event.target.value)}
                      placeholder="0 9 * * 1"
                    />
                  </div>
                ) : (
                  <div className="mb-3 grid grid-cols-[1fr_1fr] gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium" htmlFor={`interval-value-${props.id}`}>
                        Every
                      </label>
                      <input
                        id={`interval-value-${props.id}`}
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                        type="number"
                        min="1"
                        value={intervalValue}
                        onChange={(event) => setIntervalValue(event.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium" htmlFor={`interval-unit-${props.id}`}>
                        Unit
                      </label>
                      <select
                        id={`interval-unit-${props.id}`}
                        className="h-9 rounded-md border bg-background px-2 text-sm"
                        value={intervalUnit}
                        onChange={(event) =>
                          setIntervalUnit(event.target.value as "minutes" | "hours" | "days")
                        }
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mb-4 flex flex-col gap-1">
                  <label className="text-xs font-medium" htmlFor={`timezone-${props.id}`}>
                    Timezone
                  </label>
                  <input
                    id={`timezone-${props.id}`}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    placeholder="UTC"
                  />
                </div>

                <button
                  type="button"
                  className="h-9 w-full rounded-md bg-accent-foreground text-sm font-medium text-white transition hover:opacity-90"
                  onClick={() => {
                    onUpdateScheduleNode?.(props.id, {
                      scheduleType,
                      cronExpression: cronExpression.trim() || "0 9 * * 1",
                      intervalValue: Math.max(1, Number(intervalValue) || 1),
                      intervalUnit,
                      timezone: timezone.trim() || "UTC",
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

ScheduleNode.displayName = "ScheduleNode";
