"use client"
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "../placeholder-node";
import { Workflownode } from "./workflownode";

export const Initialnode = memo((prop:NodeProps)=>{
    const onOpenPicker = (prop.data as {onOpenPicker?: (nodeId: string) => void} | undefined)?.onOpenPicker;
    const onDeleteNode = (prop.data as {onDeleteNode?: (nodeId: string) => void} | undefined)?.onDeleteNode;

    return(
        <Workflownode
            name="initial node"
            description="click here to create a node"
            ondelete={() => onDeleteNode?.(prop.id)}
        >
            <PlaceholderNode
                {...prop}
                onclick={()=>onOpenPicker?.(prop.id)}
                
            >
                <div className="flex justify-center items-center cursor-pointer">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
        </Workflownode>
    )
})

Initialnode.displayName = "Initial Node"
