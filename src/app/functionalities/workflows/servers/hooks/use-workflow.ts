

import { useTRPC} from "@/trpc/client";
import { Mutation, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { workflowparamhook } from "./use-workflow-param";
import { Param } from "@prisma/client/runtime/client";

export const useSuspenceWorkflow = ()=>{
    const trpc = useTRPC();
    const [params] = workflowparamhook()
    return useSuspenseQuery(trpc.workflows.getmany.queryOptions(params))
}

export const useCreateWorkflow = ()=>{
    const router = useRouter();
    const querclient = useQueryClient()
    const trpc= useTRPC();
     const [params] = workflowparamhook()

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`workflow "${data.name}" created`);
                // router.push(`/workflow/${data.id}`);
                querclient.invalidateQueries(
                    trpc.workflows.getmany.queryOptions(params),
                );
          },
            onError:(error)=>{
                toast.error(`error creating workflow ${error.message}`)
            }
        })
    )
}

export const useRemoveWorkflow = ()=>{
    const querclient = useQueryClient()
    const trpc= useTRPC();
    const [params] = workflowparamhook()

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`workflow "${data.name}" removed`);
                // router.push(`/workflow/${data.id}`);
                querclient.invalidateQueries(
                    trpc.workflows.getmany.queryOptions(params),
                );
                querclient.invalidateQueries(
                    trpc.workflows.getone.queryFilter({id:data.id}),
                );

          },
            onError:(error)=>{
                toast.error(`error removing workflow ${error.message}`)
            }
        })
    )
}

export const useoneSuspenceWorkflow = (id:string)=>{
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getone.queryOptions({id}))
}


export const useUpdateWorkflow = ()=>{
    const router = useRouter();
    const querclient = useQueryClient()
    const trpc= useTRPC();
     const [params] = workflowparamhook()

    return useMutation(
        trpc.workflows.updatename.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`workflow "${data.name}" updated`);
                // router.push(`/workflow/${data.id}`);
                querclient.invalidateQueries(
                    trpc.workflows.getmany.queryOptions(params),
                );
                querclient.invalidateQueries(
                    trpc.workflows.getone.queryFilter({id:data.id}),
                );
          },
            onError:(error)=>{
                toast.error(`error updating workflow ${error.message}`)
            }
        })
    )
}