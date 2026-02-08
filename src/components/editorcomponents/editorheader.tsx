"use client"
import { useState ,useRef} from "react";
import { ArrowRightIcon } from "lucide-react"
import { useoneSuspenceWorkflow, useUpdateWorkflow } from "@/app/functionalities/workflows/servers/hooks/use-workflow";

export const EditorHeader =({workflowid}:{workflowid:string})=>{
    const {data} = useoneSuspenceWorkflow(workflowid)
    const textref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const updateworkflow = useUpdateWorkflow()


  const handleBlur = () => {
    const value = textref.current.textContent;
    if( value == data.name){
        setIsEditing(false)
        return
    }

    
    updateworkflow.mutate({
        id:workflowid,
        name:value
    })  
  };
return(
    <header className="flex w-full h-14 shrink-0 items-center gap-2  px-4 bg-background flex-row justify-between mb-3">
        <div className="text-muted-foreground flex flex-ow justify-center items-center "> 
            workflows <span>{<ArrowRightIcon/>}</span>
            <div
            contentEditable
            suppressContentEditableWarning
            
            ref={textref}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            style={{
                padding: "8px 12px",
                borderRadius: "6px",
                minWidth: "200px",
                cursor: "text"
            }}
            className="hover:text-gray-800"
            >
               {data.name} 
            </div>
            
        </div>
        {/* <div className="text-muted-foreground"> spiderman</div> */}
            
    </header>
)
}