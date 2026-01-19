import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching", "5s");
    await step.sleep("transcribing", "5s");
    await step.sleep("giving to ai", "5s");
    await step.run("create workflow",()=>{
        return prisma.workflow.create({
            data:{
                name: "backgroud-job-from-inngest",
            }
        })
    })
    
  },
);