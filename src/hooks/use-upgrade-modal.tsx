
import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";

export const useUpgradeModal = ()=>{
    const [open , setopen] = useState(false)


const handlerror = (error:unknown)=>{
    if(error instanceof TRPCClientError){
        if(error.data?.code === "FORBIDDEN"){
            setopen(true)
            return true
        }
    }
    return false
}


const modal = <UpgradeModal open={open} onOpenChange={setopen}/>
return {handlerror,modal}
}