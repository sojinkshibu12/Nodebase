
import LoginForm from "@/app/functionalities/loginform";
import { requireNoAuth } from "@/lib/auth-utils";

const  page  = async ()=>{
    await requireNoAuth();
    return <div><LoginForm /></div> 

}

export default page;