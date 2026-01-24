import { PlusIcon } from "lucide-react";
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
    <div className="p-4 md:px-10 md:py-6 h-full">
        <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-8 h-full">
            {header}
       
        <div className="flex flex-col gap-y-4 h-full  ">
        {search}
        {children}
        </div>
        {pagination}
    </div>
     </div>)
}