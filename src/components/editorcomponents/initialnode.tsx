"use client"
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo ,useState} from "react";
import { PlaceholderNode } from "../placeholder-node";
import { Workflownode } from "./workflownode";

export const Initialnode = memo((prop:NodeProps)=>{
    return(
        <Workflownode name="initial node" description="click here to create a node">
            <PlaceholderNode
                {...prop}
                onclick={()=>{}}
                
            >
                <div className="flex justify-center items-center cursor-pointer">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
        </Workflownode>
    )
})

Initialnode.displayName = "Initial Node"