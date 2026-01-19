import Signupform from "@/app/functionalities/signupform";
import { requireNoAuth } from "@/lib/auth-utils";
const  page  = async ()=>{
    await requireNoAuth();
    return <div><Signupform /></div>;

}

export default page;