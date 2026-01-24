

import { useTRPC} from "@/trpc/client";
import { Mutation, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export const useSuspenceWorkflow = ()=>{
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getmany.queryOptions())
}

export const useCreateWorkflow = ()=>{
    const router = useRouter();
    const querclient = useQueryClient()
    const trpc= useTRPC();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`workflow "${data.name}" created`);
                router.push(`/workflow/${data.id}`);
                querclient.invalidateQueries(
                    trpc.workflows.getmany.queryOptions(),
                );
          },
            onError:(error)=>{
                toast.error(`error creating workflow ${error.message}`)
            }
        })
    )
}