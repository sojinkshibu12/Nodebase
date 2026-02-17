"use client";

import { forwardRef, type ReactNode } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "@/components/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onclick?:()=>void
};

export const PlaceholderNode = forwardRef<HTMLDivElement,PlaceholderNodeProps>(({ children,onclick }: PlaceholderNodeProps, ref) =>{
  void ref;
  return (
    <BaseNode
      className="bg-card size-20 border-dashed border-gray-400 p-0 text-center text-gray-400 shadow-none cursor-pointer hover:border-gray-500 hover:bg-gray-50"
      onClick={onclick}
    >
      <div className="flex size-full items-center justify-center">{children}</div>
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
})

PlaceholderNode.displayName = "PlaceholderNode";
