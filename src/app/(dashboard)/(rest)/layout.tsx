import { Appheader } from "@/components/appheader";


const layout = ({ children }: { children: React.ReactNode }) => {
    return(

        <>
            <Appheader/>
            <main className="flex-1">
                {children}
            </main>
        </>
    );
}


export default layout;