import{useQueryStates} from "nuqs"
import { WorkflowParam} from "../../params"


export const workflowparamhook = ()=>{
    return useQueryStates(WorkflowParam)
}