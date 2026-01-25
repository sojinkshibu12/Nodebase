import { useEffect,useState } from "react";
import { PAGINATION } from "@/config/constants";

interface UseEntitySearchProp<T extends{
    search:string,
    page:number
}>{
    params:T;
    setparams:(params:T) =>void;
    debounced?:number;
}

export function UseEntitySearch<T extends{
    search:string,
    page:number
}>({
    params,setparams,debounced = 500
}:UseEntitySearchProp<T>){
    const [localsearch ,setlocalsearch] = useState(params.search);
    useEffect(()=>{
        if(localsearch==="" && params.search!==""){
            setparams({
                ...params,
                search:"",
                page:PAGINATION.DEFAULT_PAGE


            });
            return
        }

        const timer = setTimeout(()=>{
            if(localsearch!== params.search){
                setparams({
                    ...params,
                    search:localsearch,
                    page:PAGINATION.DEFAULT_PAGE
                })
            }
        },debounced)

        return ()=> clearTimeout(timer)
    },[localsearch,params,setparams,debounced]);

    useEffect(()=>{
        setlocalsearch(params.search)
    },[params.search])


    return({
        searchvalue:localsearch,
        onsearchchange:setlocalsearch
    })
}