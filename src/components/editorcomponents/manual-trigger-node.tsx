"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { PlayIcon } from "lucide-react";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const onDeleteNode =
    (props.data as { onDeleteNode?: (nodeId: string) => void } | undefined)
      ?.onDeleteNode;

  return (
    <Workflownode
      name="Manual Trigger"
      description="Runs this workflow manually."
      ondelete={() => onDeleteNode?.(props.id)}
    >
      <BaseNode className="size-20 rounded-l-3xl rounded-r-md p-0">
        <div className="flex size-full items-center justify-center text-foreground">
          <PlayIcon className="size-4" />
        </div>
      </BaseNode>
      <Handle type="source" position={Position.Right} />
    </Workflownode>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
