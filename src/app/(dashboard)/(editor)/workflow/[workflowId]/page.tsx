import { prefetchoneworkflows } from "@/app/functionalities/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient, prefetch } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { useoneSuspenceWorkflow } from "@/app/functionalities/workflows/servers/hooks/use-workflow";
import { Editorcontent, EditorError, EditorLoading } from "@/components/editorcomponents/workflowidcontent";
import { EditorHeader } from "@/components/editorcomponents/editorheader";

interface PageProps {
  params: Promise<{
    workflowId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { workflowId } = await  params
  prefetchoneworkflows(workflowId)

  return( 
  <HydrateClient >
        <ErrorBoundary fallback = {<EditorError/>}>
          <Suspense fallback = {<EditorLoading/>} >
          
          <main className="flex-1">
            <EditorHeader workflowid = {workflowId}/>
            <Editorcontent workflowid = {workflowId}/>
          </main>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
  );
}

export default Page
