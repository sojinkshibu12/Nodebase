import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { ReactNode } from "react";


interface workflownodeprops{
    children:ReactNode;
    showtoolbar?:boolean;
    ondelete?:()=>void;
    onsettings?:()=>void;
    name?:string;
    description?:string;
}

export const Workflownode = ({children,showtoolbar = true,ondelete,onsettings,name,description}:workflownodeprops)=>{
    return(
        <>
        {showtoolbar &&(
            <NodeToolbar className="flex gap-5">
                <button className="
    flex items-center justify-center
    h-7 w-7 rounded-md
    bg-muted text-muted-foreground
    hover:bg-accent hover:text-accent-foreground
    
    transition size-sm" onClick={onsettings}>
                    <SettingsIcon className="size-sm"/>
                </button>
                <button className="
    flex items-center justify-center
    h-7 w-7 rounded-md
    bg-muted text-muted-foreground
    hover:bg-accent hover:text-accent-foreground
    
    transition " onClick={ondelete}>
                    <TrashIcon className="size-sm"/>
                </button>
                </NodeToolbar>)}
                {children}
                {name && (
                    <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center"
                    >
                        <p className="font-medium">
                            {name}
                        </p>
                        {description&&(
                            <p className="text-muted-foreground truncate text-sm">
                                {description}
                            </p>
                        )}

                    </NodeToolbar>  
                )}
            
        
        </>
    )
}