import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db"
import { createTRPCRouter,protectedprocedure ,premiumprocedure} from "@/trpc/init"
import {z} from "zod"
import { PAGINATION } from "@/config/constants"



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
    .input(z.object({
        page:z.number().default(PAGINATION.DEFAULT_PAGE),
        pagesize:z
        .number()
        .min(PAGINATION.MIN_PAGE_SIZE)
        .max(PAGINATION.MAX_PAGE_SIZE),
        search:z.string().default("")        
    }))
    .query(async ({ctx,input})=>{
        const {page,pagesize,search} = input

        const [items , totalcount] = await Promise.all([
            prisma.workflow.findMany({
            skip:(page-1)*pagesize,
            take:pagesize,
            where:{
                userId:ctx.auth.user.id,
                name:{
                    contains:search,
                    mode:"insensitive"
            }
            },
            orderBy:{
                updatedAt:"desc"
            }

            }),
            prisma.workflow.count({
            where:{
                userId:ctx.auth.user.id,
                name:{
                    contains:search,
                    mode:"insensitive"
            }
                }
            }),
        ])

        const totalpage = Math.ceil(totalcount/pagesize);
        const hasnextpage = page<totalpage;
        const haspreviopuspage = page>1;
        return {
            items,
            page,
            pagesize,
            totalcount,
            totalpage,
            hasnextpage,
            haspreviopuspage

        }
    })
})