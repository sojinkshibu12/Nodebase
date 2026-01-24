import { Appheader } from "@/components/appheader";


const layout = ({ children }: { children: React.ReactNode }) => {
    return(

        <div className="flex flex-col w-full">
            <Appheader/>
            <main className="flex-1">
                {children}
            </main>
        </div>

        
    );
}


export default layout;