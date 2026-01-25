

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