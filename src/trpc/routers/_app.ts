import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedprocedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
  getusers: protectedprocedure.query(({ctx})=>{
      return prisma.user.findMany({
        where:{
          id:ctx.auth.user.id,
        }
      });
  })


});
// export type definition of API
export type AppRouter = typeof appRouter;