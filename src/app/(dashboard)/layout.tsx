import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import App from "next/app";
import { AppSidebar } from "@/components/appsidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
    return(
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset className="bg-accent/20">
             {children}
        </SidebarInset>
       
    </SidebarProvider>)
}


export default layout;