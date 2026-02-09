import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db"
import { createTRPCRouter,protectedprocedure ,premiumprocedure} from "@/trpc/init"
import {z} from "zod"
import { PAGINATION } from "@/config/constants"
import { Nodetype } from "@/generated/prisma/enums"
import { Edge, Node, Position } from "@xyflow/react"



export const workflowsrouter = createTRPCRouter({
    create :premiumprocedure.mutation(({ctx})=>{
        return prisma.workflow.create({
            data:{
                name:generateSlug(3),
                userId:ctx.auth.user.id,
                node:{
                   create:{
                    type:Nodetype.INITIAL,
                    position:{x:0,y:0},
                    name:Nodetype.INITIAL
                   } 
                }
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
    .query(async ({ctx,input})=>{
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where:{id:input.id,userId:ctx.auth.user.id},
            include:{node:true,connections:true}
        })

        const nodes:Node[]=workflow.node.map((node)=>({
            id:node.id,
            type :node.type,
            position:node.position as {x :number,y:number},
            data:(node.data as Record<string,unknown>)|| {}
        }))
        const edges:Edge[]=workflow.connections.map((edge)=>({
            id:edge.id,
            source:edge.fromnodeid,
            target:edge.tonodeid,
            sourceHandle:edge.fromoutput,
            targetHandle:edge.toinput
        }))

        return{
            id:workflow.id,
            name:workflow.name,
            nodes,
            edges
        };
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