"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner"

export function Createbgjobs() {
  const trpc = useTRPC();
  const create = useMutation(trpc.createworkflow.mutationOptions({
    onSuccess: ()=>{
      toast.success("Background job queued!")
    }
  }))
  return (
    <Button
      onClick={()=>{
        create.mutate();
      }}
    >
      create
    </Button>
  )
}
