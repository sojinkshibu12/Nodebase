"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner"

export function TestAI() {
  const trpc = useTRPC();
  const create = useMutation(trpc.testai.mutationOptions({
    onSuccess: ()=>{
      toast.success("ai job quedued!")
    }
  }))
  return (
    <Button
        disabled={create.isPending}
      onClick={()=>{
        create.mutate();
      }}
    >
      AI
    </Button>
  )
}
