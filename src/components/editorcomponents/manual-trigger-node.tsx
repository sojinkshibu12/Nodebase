"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { PlayIcon } from "lucide-react";

import { BaseNode } from "@/components/base-node";
import { Workflownode } from "./workflownode";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const nodeData = (props.data as {
    onDeleteNode?: (nodeId: string) => void;
    executionStatus?: NodeExecutionStatus;
  } | undefined);
  const onDeleteNode = nodeData?.onDeleteNode;
  const executionStatus = nodeData?.executionStatus;

  return (
    <Workflownode
      name="Manual Trigger"
      description="Runs this workflow manually."
      ondelete={() => onDeleteNode?.(props.id)}
    >
      <BaseNode className={`size-14 rounded-l-2xl rounded-r-md p-0 ${getNodeExecutionClassName(executionStatus)}`}>
        <div className="flex size-full items-center justify-center text-foreground">
          <PlayIcon className="size-3.5" />
        </div>
      </BaseNode>
      <Handle type="source" position={Position.Right} />
    </Workflownode>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
