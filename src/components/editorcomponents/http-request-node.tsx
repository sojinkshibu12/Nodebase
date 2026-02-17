"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";

export const HttpRequestNode = memo((props: NodeProps) => {
  const onDeleteNode =
    (props.data as { onDeleteNode?: (nodeId: string) => void } | undefined)
      ?.onDeleteNode;
  const configuredUrl =
    typeof props.data?.url === "string" ? props.data.url.trim() : "";
  const bottomDescription =
    configuredUrl.length > 0 ? configuredUrl : "Not configured - set desired link";

  return (
    <Workflownode
      name="HTTP Request"
      description={bottomDescription}
      ondelete={() => onDeleteNode?.(props.id)}
    >
      <BaseNode className="size-20 p-0">
        <div className="flex size-full items-center justify-center text-foreground">
          <GlobeIcon className="size-4" />
        </div>
      </BaseNode>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Workflownode>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
