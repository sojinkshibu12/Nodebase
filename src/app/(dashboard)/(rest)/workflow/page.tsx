import { requireAuth } from "@/lib/auth-utils";
import { prefetchworkflows } from "@/app/functionalities/workflows/servers/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowList, WorkflowsContainer } from "@/app/functionalities/workflows/servers/components/workflows";
const page = async () => {
  await requireAuth();
  prefetchworkflows()
  return <div>
    <WorkflowsContainer>
    <HydrateClient>
      <ErrorBoundary fallback = {<p>Error</p>}>
        <Suspense fallback = {<p>Loading.....</p>}>
          <WorkflowList/>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </WorkflowsContainer>
  </div>;
}

export default page;