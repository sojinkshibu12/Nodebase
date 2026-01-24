"use client"
import { Divide } from "lucide-react";
import { useCreateWorkflow, useSuspenceWorkflow } from "../hooks/use-workflow";
import { EntityContainer, EntityHeader } from "@/components/entity-component";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";


export const WorkflowList = ()=>{
    const workflow = useSuspenceWorkflow();

    return(
        <p>
            {JSON.stringify(workflow.data)}
        </p>


    )

}

export const WorkflowHeader = ({disabled}:{disabled?:boolean})=>{
    const createworkflow = useCreateWorkflow();
    const {handlerror,modal} = useUpgradeModal()
    const handlecreate= ()=>{
        createworkflow.mutate(undefined,{
            onError:(error)=>{
                handlerror(error)
            }
        })
    }
    return (
        <>
            {modal}
            <EntityHeader 
                title="workflows"
                descrpition="create and manage your workflow"
                onNew={handlecreate}
                newButtonLabel="new Workflow"
                disabled={disabled}
                isCreating={createworkflow.isPending}
            
            />
        </>
    )
}

export const WorkflowsContainer = ({
   children
}: {children: React.ReactNode}) => {
    return (
        <EntityContainer
            header = {<WorkflowHeader/>}
            search={<></>}
            pagination={<></>}
            >
                {children}
        </EntityContainer>
    )
}