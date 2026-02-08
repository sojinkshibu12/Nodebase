import { inferInput } from "@trpc/tanstack-react-query";
import {prefetch,trpc} from "@/trpc/server";


type Input = inferInput<typeof trpc.workflows.getmany>;
export const prefetchworkflows = (params:Input)=>{
    return prefetch(trpc.workflows.getmany.queryOptions(params));
}

export const prefetchoneworkflows = (id:string)=>{
    return prefetch(trpc.workflows.getone.queryOptions({id}));
}