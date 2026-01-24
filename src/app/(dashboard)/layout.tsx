

import { AppSidebar } from "@/components/appsidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
    return(
    <div className="flex flex-row">
        <AppSidebar/>
        
        {children}
    </div>
        
    ) 
       
    
}


export default layout;