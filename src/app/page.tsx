
import { requireAuth } from "@/lib/auth-utils"
import {LogoutButton} from "@/app/clientcomp/logoutbtn"
import { caller } from "@/trpc/server";

export default async function Home() {

await requireAuth();

const data = await caller.getusers();
  return (


    <div className="flex min-h-screen items-center justify-center">

        <h1 className="mb-4 text-2xl font-bold">Welcome {JSON.stringify(data[0].email
          
        )}</h1>
        <LogoutButton />

    </div>
  )
}
