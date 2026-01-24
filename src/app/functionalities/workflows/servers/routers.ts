import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db"
import { createTRPCRouter,protectedprocedure ,premiumprocedure} from "@/trpc/init"
import {z} from "zod"
import { id } from "zod/v4/locales"


export const workflowsrouter = createTRPCRouter({
    create :premiumprocedure.mutation(({ctx})=>{
        return prisma.workflow.create({
            data:{
                name:generateSlug(3),
                userId:ctx.auth.user.id
            }
        });
    }),
    remove:protectedprocedure
    .input(z.object({id:z.string()}))
    .mutation(({ctx,input})=>{
        return prisma.workflow.delete({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            }
        })
    }),

    updatename:protectedprocedure
    .input(z.object({id:z.string(),name:z.string().min(1)}))
    .mutation(({ctx,input})=>{
        return prisma.workflow.update({
            where:{
                id:input.id,
                userId:ctx.auth.user.id
            },
            data:{
                name:input.name
            }

        })
    }),

    getone:protectedprocedure
    .input(z.object({id:z.string()}))
    .query(({ctx,input})=>{
        return prisma.workflow.findUnique({
            where:{id:input.id,userId:ctx.auth.user.id},
        })
    }),

    getmany:protectedprocedure
    
    .query(({ctx})=>{
        return prisma.workflow.findMany({
            where:{userId:ctx.auth.user.id},
        })
    })
})