import { useRemoveWorkflow } from "@/app/functionalities/workflows/servers/hooks/use-workflow";
import { Divide, Loader2Icon, MoreVertical, PackageOpen, PlusIcon, SearchIcon, Trash2, TriangleAlertIcon, Workflow } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


type EntityHeaderProps = {
    title:string;
    descrpition?:string;
    newButtonLabel?:string;
    disabled?:boolean;
    isCreating?:boolean;
}&(
   
    | {onNew:()=>void; newButtonHref?:never}
    | {newButtonHref:string ; onNew?:never}
    | {onNew?:never;newButtonHref?:never}
);

export const EntityHeader = ({
    title,
    descrpition,
    onNew,
    newButtonHref,
    newButtonLabel,
    disabled,
    isCreating
}:EntityHeaderProps)=>{
    return <div className="flex flex-row items-center justify-between gap-x-4">
        <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
            {descrpition && (
                <p className="text-xs md:text-sm text-muted-foreground ">
                    {descrpition}
                </p>
            )}
        </div>
        {onNew && !newButtonHref &&(
            <button disabled = {isCreating||disabled} onClick={onNew}  className="    inline-flex items-center justify-center gap-2
    rounded-lg bg-black px-4 py-2
    text-sm font-medium text-white
    shadow-sm transition
    hover:bg-gray-900">
                <PlusIcon className="size-4"/>
                <span>{newButtonLabel}</span>
            </button>
        )}
        {!onNew && newButtonHref &&(
            <button className="    inline-flex items-center justify-center gap-2
    rounded-lg bg-black px-4 py-2
    text-sm font-medium text-white
    shadow-sm transition
    hover:bg-gray-900" >
                <Link href={newButtonHref} prefetch/>
                <PlusIcon className="size-4"/>
                {newButtonLabel}
            </button>
        )}
    </div>
}

type EntityContainerProps = {
    children:React.ReactNode;
    header?:React.ReactNode;
    search?:React.ReactNode;
    pagination?:React.ReactNode
}


export const EntityContainer = ({
    children,
    header,
    search,
    pagination
}:EntityContainerProps)=>{
    return(
    <div className="p-4 md:px-10 md:py-6  max-w-6xl ">
        <div className=" flex-col gap-8  flex justify-between ">
            {header}
                <div className="shrink-0">
                    {search}
                </div>
       
            <div className="flex flex-col gap-4 rounded-xl border bg-card p-4
                    max-h-[60vh] overflow-hidden">
    
    {/* Search stays fixed */}
  

                {/* Content scrolls / wraps inside */}
                <div className="flex flex-col  whitespace-normal break-words ">
                    {children}
                </div>
            </div>
            {pagination}
        </div>
     </div>)

}
interface EntitySearchprop {
    value:string,
    onchange:(value :string)=>void
    placeholder?:string
}


export const Entitysearch = ({value,onchange,placeholder="serach"} : EntitySearchprop)=>{
    return (
        <div className="flex">
            <div className="relative ml-auto ">
                <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input
                type="search" 
                className="max-w-[200px] bg-background shadow-none border-border rounded-sm pl-8" 
                placeholder={placeholder}
                value={value}
                onChange={(event)=>{onchange(event.target.value)}}
                />
            
            </div>
        </div>
    )
}

interface EntitypaginationProp{
    page:number;
    totalpage:number;
    onPageChange:(page:number)=>void;
    disabled?:boolean

}
export const Entitypagination = ({
    page,
    totalpage,
    onPageChange,
    disabled
}:EntitypaginationProp)=>{
    return(
    <div className="flex justify-between items-center gap-x-2 w-full">
        <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalpage||1}
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <button
            disabled={page === 1|| disabled}
            onClick={()=>onPageChange(Math.max(1,page-1))}
            className="    inline-flex items-center justify-center
    rounded-md border border-border
    px-3 py-1 text-sm font-medium
    text-foreground
    hover:bg-accent hover:text-accent-foreground
    disabled:opacity-50 disabled:pointer-events-none
    transition-colors"
            >
                previous
            </button>
            <button
            
            disabled={page === totalpage||totalpage===0|| disabled}
            onClick={()=>onPageChange(Math.min(totalpage,page+1))}
            className="    inline-flex items-center justify-center
    rounded-md border border-border
    px-3 py-1 text-sm font-medium
    text-foreground
    hover:bg-accent hover:text-accent-foreground
    disabled:opacity-50 disabled:pointer-events-none
    transition-colors">
                next
            </button>

        </div>
    </div>
    )
}

interface Stateviewprop{
    message?:string
}



export const Loadingentity = ({message}:Stateviewprop)=>{
    return(
        <div className="flex justify-center items-center flex-1 flex-col gap-y-4 ">
            <Loader2Icon className="size-6 animate-spin text-primary"/>
            {!!message&&(
                <p className="text-sm text-muted-foreground">
                    {message}
                </p>
            )}
        
        </div>
    )
}

export const Errorentity = ({message}:Stateviewprop)=>{
    return(
        <div className="flex justify-center items-center flex-1 flex-col gap-y-4 ">
            <TriangleAlertIcon className="size-6  text-primary"/>
            {!!message&&(
                <p className="text-sm text-muted-foreground">
                    {message}
                </p>
            )}
        
        </div>
    )
}

interface  Worklflowlist<T>{
    items:T[],
    renderitem:(item :T ,index:number)=>React.ReactNode
    getKey?:(item:T,index:number) => string | number
    emptyview?:React.ReactNode
    classname:string
}


export function Workflowlistitems<T> ({items,renderitem,getKey,emptyview,classname}:Worklflowlist<T>){
    if (items.length == 0 && emptyview ){
        return(
        <div className="flex justify-center items-center flex-1 ">
            <div className="max-w-sm mx-auto">{emptyview}</div>
        </div>)
    }
    return(
        <div className="flex flex-col">
            {items.map((item,index)=>(
                <div key = {getKey ? getKey(item,index):index}>
                    {renderitem(item,index)}
                </div>
            ))}
        </div>
    )
}

interface emptystateprop{
    message:string,
    onAdd?:()=>void
}
export const EmptyState = ({message,onAdd}:emptystateprop) => {
  return (
    <div className="flex items-center justify-center min-h-[40vh] flex-col">
      
        <h2 className="text-lg font-semibold text-gray-900">
            <PackageOpen className = "w-20 h-20"/>
          No items
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>

        <button
          onClick={onAdd}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Item
        </button>
      
    </div>
  );
};

type WorkflowCardProps = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  
};
export default function WorkflowCard({
  id,
  name,
  createdAt,
  updatedAt,
  
  
}: WorkflowCardProps) {
  const [open, setOpen] = useState(false);
  const removeworkflow = useRemoveWorkflow()
  const handleremove = ()=>{
    removeworkflow.mutate({id:id})
  }

  return (
    <Link
      href={`/workflow/${id}`}
      className="relative flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition  hover:shadow-sm mt-2"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Workflow className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {name}
        </h3>


        <div className="mt-3 flex gap-4 text-xs text-gray-400">
          <span>Created: {formatDate(createdAt)}</span>
          <span>Updated: {formatDate(updatedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div
        className="relative"
        onClick={(e) => e.preventDefault()} // prevent Link navigation
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-md">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation();
                setOpen(false);
                handleremove()
                
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}


export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}