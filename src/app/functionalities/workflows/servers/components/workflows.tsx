"use client"
import { useCreateWorkflow, useSuspenceWorkflow } from "../hooks/use-workflow";
import WorkflowCard, { EmptyState, EntityContainer, EntityHeader, Entitypagination, Entitysearch, Errorentity, Loadingentity, Workflowlistitems } from "@/components/entity-component";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { workflowparamhook } from "../hooks/use-workflow-param";
import { UseEntitySearch } from "../hooks/use-entitysearch";



export const Workflowsearch =()=>{

    const[params,setparams] = workflowparamhook()
    const {searchvalue,onsearchchange} = UseEntitySearch({
        params,
        setparams
    })
    return(
        <Entitysearch
        value={searchvalue}
        onchange={onsearchchange}
        placeholder="search workflows"
        />
    );
};
export const WorkflowList = ()=>{
    const workflow = useSuspenceWorkflow();
    const router = useRouter();
    const createworkflow = useCreateWorkflow();
    const {handlerror,modal} = useUpgradeModal();
    const handlecreate= ()=>{
        createworkflow.mutate(undefined,{
            onSuccess:(data)=>{
                router.push(`/workflow/${data.id}`)
            },
            onError:(error)=>{
                handlerror(error)
            }
        });
    };

    return(<>
    {modal}
    <Workflowlistitems 
    items={workflow.data.items}
    getKey={(workflow)=>workflow.id}
    renderitem = {(workflow)=> 
        <WorkflowCard 
        id= {`${workflow.id}`}
        name={`${workflow.name}`}
        createdAt={`${workflow.createdAt}`}
        updatedAt={`${workflow.updatedAt}`}
        

        />
    }
    emptyview = {<EmptyState message="Not created workflow..."  onAdd={handlecreate}/>}
    classname=""
    />
    </>)

};

export const WorkflowHeader = ({disabled}:{disabled?:boolean})=>{
    const router = useRouter();
    const createworkflow = useCreateWorkflow();
    const {handlerror,modal} = useUpgradeModal();
    const handlecreate= ()=>{
        createworkflow.mutate(undefined,{
            onSuccess:(data)=>{
                router.push(`/workflow/${data.id}`)
            },
            onError:(error)=>{
                handlerror(error)
            }
        });
    };
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
    );
};

export const WorkflowPagination=()=>{
    const workflows = useSuspenceWorkflow();
    const [params,setparams] = workflowparamhook();
    return(
        <Entitypagination
        disabled={workflows.isFetching}
        totalpage={workflows.data.totalpage}
        page={workflows.data.page}
        onPageChange={(page)=>setparams({...params,page})}
        />

    )
}

export const WorkflowsContainer = ({
   children
}: {children: React.ReactNode}) => {
    return (
        <EntityContainer
            header = {<WorkflowHeader/>}
            search={<Workflowsearch/>}
            pagination={<WorkflowPagination/>}
            >
                {children}
        </EntityContainer>
    )
}

export const Workflowloader = ()=>{
    return(
    <Loadingentity message="Loading..." />)
}
export const WorkflowError = ()=>{
    return(
    <Errorentity message="Error..." />)
}