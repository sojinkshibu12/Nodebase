import { Divide, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";


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