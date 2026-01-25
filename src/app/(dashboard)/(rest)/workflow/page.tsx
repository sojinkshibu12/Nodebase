
import { requireAuth } from "@/lib/auth-utils";
import { prefetchworkflows } from "@/app/functionalities/workflows/servers/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowList, WorkflowsContainer } from "@/app/functionalities/workflows/servers/components/workflows";
import { SearchParams } from "nuqs";
import { workflowloader } from "@/app/functionalities/workflows/servers/paramloader";
type prop = {
  searchParams:Promise<SearchParams>
}

const page = async ({searchParams} : prop) => {

  await requireAuth();
  const params = await workflowloader(searchParams);
  prefetchworkflows(params);
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