"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { createPortal } from "react-dom";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";

export const HttpRequestNode = memo((props: NodeProps) => {
  const nodeData = (props.data ?? {}) as {
    onDeleteNode?: (nodeId: string) => void;
    onUpdateHttpRequestNode?: (
      nodeId: string,
      payload: { method: string; url: string; body?: string },
    ) => void;
    method?: string;
    url?: string;
    body?: string;
  };
  const onDeleteNode =
    nodeData?.onDeleteNode;
  const onUpdateHttpRequestNode = nodeData?.onUpdateHttpRequestNode;
  const [openSettings, setOpenSettings] = useState(false);
  const [method, setMethod] = useState(
    typeof nodeData.method === "string" ? nodeData.method.toUpperCase() : "GET",
  );
  const [url, setUrl] = useState(
    typeof nodeData.url === "string" ? nodeData.url : "https://api.example.com",
  );
  const [body, setBody] = useState(
    typeof nodeData.body === "string" ? nodeData.body : '{\n  "example": "value"\n}',
  );
  const configuredMethod =
    typeof nodeData.method === "string" ? nodeData.method.toUpperCase() : "GET";
  const configuredUrl =
    typeof nodeData.url === "string" && nodeData.url.trim().length > 0
      ? nodeData.url.trim()
      : "https://api.example.com";

  return (
    <>
      <Workflownode
        name={configuredMethod}
        description={configuredUrl}
        ondelete={() => onDeleteNode?.(props.id)}
        onsettings={() => {
          setMethod(
            typeof nodeData.method === "string"
              ? nodeData.method.toUpperCase()
              : "GET",
          );
          setUrl(
            typeof nodeData.url === "string"
              ? nodeData.url
              : "https://api.example.com",
          );
          setBody(
            typeof nodeData.body === "string"
              ? nodeData.body
              : '{\n  "example": "value"\n}',
          );
          setOpenSettings(true);
        }}
      >
        <BaseNode className="size-14 p-0">
          <div className="flex size-full items-center justify-center text-foreground">
            <GlobeIcon className="size-3.5" />
          </div>
        </BaseNode>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </Workflownode>
      {openSettings && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpenSettings(false)}
                aria-label="Close settings"
              />
              <div className="relative z-10 w-full max-w-lg rounded-xl border bg-background p-4 shadow-xl">
                <h3 className="mb-4 text-sm font-semibold">HTTP Request Settings</h3>
                <div className="mb-3 flex flex-col gap-1">
                  <label className="text-xs font-medium" htmlFor={`method-${props.id}`}>
                    Method
                  </label>
                  <select
                    id={`method-${props.id}`}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                    value={method}
                    onChange={(event) => setMethod(event.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
                <div className="mb-3 flex flex-col gap-1">
                  <label className="text-xs font-medium" htmlFor={`url-${props.id}`}>
                    Endpoint URL
                  </label>
                  <input
                    id={`url-${props.id}`}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                    type="url"
                    placeholder="https://api.example.com/resource"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
                {method === "POST" ? (
                  <div className="mb-4 flex flex-col gap-1">
                    <label className="text-xs font-medium" htmlFor={`body-${props.id}`}>
                      Request Body
                    </label>
                    <textarea
                      id={`body-${props.id}`}
                      className="min-h-28 rounded-md border bg-background p-2 font-mono text-xs"
                      placeholder={'{\n  "example": "value"\n}'}
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                    />
                  </div>
                ) : null}
                <button
                  type="button"
                  className="h-9 w-full rounded-md bg-accent-foreground text-sm font-medium text-white transition hover:opacity-90"
                  onClick={() => {
                    onUpdateHttpRequestNode?.(props.id, {
                      method,
                      url: url.trim(),
                      body: method === "POST" ? body : "",
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

HttpRequestNode.displayName = "HttpRequestNode";
