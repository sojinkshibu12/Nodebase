
'use client'
import { useoneSuspenceWorkflow } from "@/app/functionalities/workflows/servers/hooks/use-workflow"
import { Errorentity, Loadingentity } from "../entity-component"
interface Editorcontentprops{
    workflowid:string
}

export const Editorcontent = ({workflowid}:Editorcontentprops)=>{
    const {data} = useoneSuspenceWorkflow(workflowid)

    return(
        <p>
            {JSON.stringify(data,null,2)}
        </p>
    )
}

export const EditorLoading = ()=>{
    return(
        <Loadingentity message="Loading Editor"/>
    )
}

export const EditorError = ()=>{
    return(
        <Errorentity message="Casused an error while loading the editor.." />
    )
}