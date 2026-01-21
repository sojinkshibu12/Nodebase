'use client'
import { url } from "inspector"
import { CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname,useRouter } from "next/navigation"
import { title } from "process"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { authClient } from "@/lib/auth-client"


const menuItems = [
    {
        title:"Workflows",
        items :[
            {
                title:"Workflows",
                url:"/workflow",
                icon:FolderOpenIcon
            },
            {
                title:"Credentials",
                url:"/credentials",
                icon:KeyIcon
            },
            {
                title:"Executions",
                url:"/executions",
                icon:HistoryIcon
            }
        ]
    }
];

export const AppSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
  return (
    <Sidebar collapsible="icon">
    <SidebarHeader>
        <SidebarMenuItem className="gap-x-4 h-10 px-4 flex items-center">
            
                <Link href="/" className="flex items-center gap-x-2 hover: rounded-md">
                    <Image 
                        src="/logo.svg"
                        alt="Nodebase Logo"
                        width={30}
                        height={30}
                    />
                    <span className="font-semibold text-sm">Nodebase</span>
                </Link>
            
        </SidebarMenuItem>
    </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
                {group.items.map((item) => (
                    <SidebarMenuItem key={item.title} >
                        <SidebarMenuButton 
                            tooltip={item.title}
                            asChild
                            isActive = {item.url == "/"? pathname == "/": pathname.startsWith(item.url)}
                            className="gap-x-4 h-10 px-4"
                        />
                        <Link href={item.url} prefetch className="flex items-center gap-x-2 h-10 px-4 hover:bg-accent rounded-md">
                            <item.icon className="size-4"/>
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}


      </SidebarContent>
<SidebarFooter className="flex justify-center">
  <SidebarMenuItem>
    <SidebarMenuButton
      tooltip="Upgrade-to-pro"
      className="gap-x-4 h-10 px-4"
    >
      <StarIcon className="size-4" />
      <span>Upgrade to Pro</span>
    </SidebarMenuButton>
  </SidebarMenuItem>


  <SidebarMenuItem>
    <SidebarMenuButton
      tooltip="Billing-portal"
      className="gap-x-4 h-10 px-4"
    >
      <CreditCardIcon className="size-4" />
      <span>Billing portal</span>
    </SidebarMenuButton>
  </SidebarMenuItem>


    <SidebarMenuItem>
    <SidebarMenuButton
      tooltip="Sign-out"
      className="gap-x-4 h-10 px-4"
      onClick={()=>{authClient.signOut({
        fetchOptions:{
            onSuccess:()=>{
                router.push("/login")
            }
        }
      })}}
    >
      <LogOutIcon className="size-4" />
      <span>Sign-out</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
</SidebarFooter>

    </Sidebar>
  )
}
