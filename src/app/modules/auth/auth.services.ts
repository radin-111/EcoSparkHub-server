import z from "zod";
import { signupSchema } from "./auth.validation";
import { auth } from "../../lib/auth";

const signup = async(payload:z.infer<typeof signupSchema>)=>{
    const data = await  auth.api.signUpEmail({
        body: payload,
    });
    
}

export const authServices={
    signup,
}
