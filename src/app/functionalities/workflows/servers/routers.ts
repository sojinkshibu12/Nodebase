import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db"
import { createTRPCRouter,protectedprocedure ,premiumprocedure} from "@/trpc/init"
import {z} from "zod"
import { PAGINATION } from "@/config/constants"
import { Nodetype } from "@/generated/prisma/enums"
import type { Prisma } from "@/generated/prisma/client"
import { Edge, Node } from "@xyflow/react"
import { TRPCError } from "@trpc/server"

const nodeTypeInputSchema = z.enum([
    "INITIAL",
    "EXECUTION",
    "MANUALLTRIGGER",
    "HTTPREQUEST",
]);

const MANUAL_TRIGGER_TYPES = ["EXECUTION", "MANUALLTRIGGER"] as const;
const isManualTriggerType = (type: z.infer<typeof nodeTypeInputSchema>) =>
    MANUAL_TRIGGER_TYPES.includes(
        type as (typeof MANUAL_TRIGGER_TYPES)[number],
    );

const toPrismaNodeType = (
    type: z.infer<typeof nodeTypeInputSchema>,
    preferManualTrigger: boolean,
) => {
    if (type === "EXECUTION" || type === "MANUALLTRIGGER") {
        return (preferManualTrigger ? "MANUALLTRIGGER" : "EXECUTION") as Nodetype;
    }

    return type as Nodetype;
};

const isInvalidNodeTypeError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return false;
    }

    return error.message.includes("Invalid value for argument `type`");
};

const toJsonInput = (value: unknown) => value as Prisma.InputJsonValue;

const createNodeWithFallbackType = async (params: {
    workflowId: string;
    type: z.infer<typeof nodeTypeInputSchema>;
    position: { x: number; y: number };
    data: Prisma.InputJsonValue;
}) => {
    const primaryType = toPrismaNodeType(params.type, false);

    try {
        return await prisma.node.create({
            data: {
                workflowId: params.workflowId,
                type: primaryType,
                name: primaryType,
                position: params.position,
                data: params.data,
            },
        });
    } catch (error) {
        const canFallback =
            isInvalidNodeTypeError(error) &&
            (params.type === "EXECUTION" || params.type === "MANUALLTRIGGER");

        if (!canFallback) {
            throw error;
        }

        const fallbackType = toPrismaNodeType(params.type, true);
        return prisma.node.create({
            data: {
                workflowId: params.workflowId,
                type: fallbackType,
                name: fallbackType,
                position: params.position,
                data: params.data,
            },
        });
    }
};

const updateNodeWithFallbackType = async (params: {
    nodeId: string;
    workflowId: string;
    type: z.infer<typeof nodeTypeInputSchema>;
    data: Prisma.InputJsonValue;
}) => {
    const primaryType = toPrismaNodeType(params.type, false);

    try {
        return await prisma.node.update({
            where: {
                id: params.nodeId,
                workflowId: params.workflowId,
            },
            data: {
                type: primaryType,
                name: primaryType,
                data: params.data,
            },
        });
    } catch (error) {
        const canFallback =
            isInvalidNodeTypeError(error) &&
            (params.type === "EXECUTION" || params.type === "MANUALLTRIGGER");

        if (!canFallback) {
            throw error;
        }

        const fallbackType = toPrismaNodeType(params.type, true);
        return prisma.node.update({
            where: {
                id: params.nodeId,
                workflowId: params.workflowId,
            },
            data: {
                type: fallbackType,
                name: fallbackType,
                data: params.data,
            },
        });
    }
};



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
    addnode: protectedprocedure
    .input(z.object({
        workflowId: z.string(),
        type: nodeTypeInputSchema,
        position: z.object({
            x: z.number(),
            y: z.number(),
        }),
        data: z.record(z.string(), z.unknown()).default({}),
    }))
    .mutation(async ({ctx, input})=>{
        await prisma.workflow.findUniqueOrThrow({
            where: {
                id: input.workflowId,
                userId: ctx.auth.user.id,
            },
        });

        if (isManualTriggerType(input.type)) {
            const existingManualTrigger = await prisma.node.findFirst({
                where: {
                    workflowId: input.workflowId,
                    type: {
                        in: [Nodetype.EXECUTION, Nodetype.MANUALLTRIGGER],
                    },
                },
                select: { id: true },
            });

            if (existingManualTrigger) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Only one manual trigger is allowed per workflow",
                });
            }
        }

        const node = await createNodeWithFallbackType({
            workflowId: input.workflowId,
            type: input.type,
            position: input.position,
            data: toJsonInput(input.data),
        });

        return {
            id: node.id,
            type: node.type,
            position: node.position as {x:number,y:number},
            data: (node.data as Record<string, unknown>) || {},
        };
    }),
    updatenode: protectedprocedure
    .input(z.object({
        workflowId: z.string(),
        nodeId: z.string(),
        type: nodeTypeInputSchema,
        data: z.record(z.string(), z.unknown()).default({}),
    }))
    .mutation(async ({ctx, input})=>{
        await prisma.workflow.findUniqueOrThrow({
            where: {
                id: input.workflowId,
                userId: ctx.auth.user.id,
            },
        });

        if (isManualTriggerType(input.type)) {
            const existingManualTrigger = await prisma.node.findFirst({
                where: {
                    workflowId: input.workflowId,
                    id: {
                        not: input.nodeId,
                    },
                    type: {
                        in: [Nodetype.EXECUTION, Nodetype.MANUALLTRIGGER],
                    },
                },
                select: { id: true },
            });

            if (existingManualTrigger) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Only one manual trigger is allowed per workflow",
                });
            }
        }

        const node = await updateNodeWithFallbackType({
            nodeId: input.nodeId,
            workflowId: input.workflowId,
            type: input.type,
            data: toJsonInput(input.data),
        });

        return {
            id: node.id,
            type: node.type,
            position: node.position as {x:number,y:number},
            data: (node.data as Record<string, unknown>) || {},
        };
    }),
    deletenode: protectedprocedure
    .input(z.object({
        workflowId: z.string(),
        nodeId: z.string(),
    }))
    .mutation(async ({ctx, input})=>{
        await prisma.workflow.findUniqueOrThrow({
            where: {
                id: input.workflowId,
                userId: ctx.auth.user.id,
            },
        });

        const node = await prisma.node.findFirst({
            where: {
                id: input.nodeId,
                workflowId: input.workflowId,
            },
        });

        if (!node) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Node not found",
            });
        }

        await prisma.node.delete({
            where: {
                id: input.nodeId,
                workflowId: input.workflowId,
            },
        });

        const remainingNodes = await prisma.node.count({
            where: {
                workflowId: input.workflowId,
            },
        });

        if (remainingNodes === 0) {
            const initialNode = await prisma.node.create({
                data: {
                    workflowId: input.workflowId,
                    type: Nodetype.INITIAL,
                    name: Nodetype.INITIAL,
                    position: { x: 0, y: 0 },
                    data: {},
                },
            });

            return {
                id: input.nodeId,
                initialNode: {
                    id: initialNode.id,
                    type: initialNode.type,
                    position: initialNode.position as { x: number; y: number },
                    data: (initialNode.data as Record<string, unknown>) || {},
                },
            };
        }

        return {
            id: input.nodeId,
            initialNode: null,
        };
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
