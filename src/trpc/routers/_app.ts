import { email, z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedprocedure } from '../init';
import prisma from '@/lib/db';
import { create } from 'domain';
import { inngest } from '@/inngest/client';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
export const appRouter = createTRPCRouter({

    testai:protectedprocedure.mutation(async()=>{
        const response = await inngest.send({
            name: "test/ai",
            
        })
    }),
  getworkflow: protectedprocedure.query(({ctx})=>{
      return prisma.workflow.findMany();
  }),
  createworkflow: protectedprocedure.mutation(async ()=>{
        await inngest.send({
            name: "test/hello.world",
            data:{
                email:"sojinkshibu@gmail.com" 
            }           
        })

        return { success: true ,message:"job queded"};
  })



});
// export type definition of API
export type AppRouter = typeof appRouter;