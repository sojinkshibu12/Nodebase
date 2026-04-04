"use client"
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "../placeholder-node";
import { Workflownode } from "./workflownode";
import { getNodeExecutionClassName, type NodeExecutionStatus } from "./node-execution-state";

export const Initialnode = memo((prop:NodeProps)=>{
    const nodeData = (prop.data as {
        onOpenPicker?: (nodeId: string) => void;
        onDeleteNode?: (nodeId: string) => void;
        executionStatus?: NodeExecutionStatus;
    } | undefined);
    const onOpenPicker = nodeData?.onOpenPicker;
    const onDeleteNode = nodeData?.onDeleteNode;
    const executionStatus = nodeData?.executionStatus;

    return(
        <Workflownode
            name="initial node"
            description="click here to create a node"
            ondelete={() => onDeleteNode?.(prop.id)}
        >
            <PlaceholderNode
                {...prop}
                className={getNodeExecutionClassName(executionStatus)}
                onclick={()=>onOpenPicker?.(prop.id)}
                
            >
                <div className="flex justify-center items-center cursor-pointer">
                    <PlusIcon className="size-3.5"/>
                </div>
            </PlaceholderNode>
        </Workflownode>
    )
})

Initialnode.displayName = "Initial Node"
