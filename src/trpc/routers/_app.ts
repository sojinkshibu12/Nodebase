import {  createTRPCRouter} from '../init';


// import { inngest } from '@/inngest/client';
import {workflowsrouter} from "@/app/functionalities/workflows/servers/routers"


export const appRouter = createTRPCRouter({
    workflows:workflowsrouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;