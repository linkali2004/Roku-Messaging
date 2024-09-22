import { connect } from "@/dbConfig/dbconfig";
import {NextResponse} from "next/server";

connect();


export async function GET(request)
{
    try{
        const response  = NextResponse.json({
            message:"logout successfully"
        })

        response.cookies.set("tokenJWT","", {
            httpOnly:true,
            expires: new Date(0)
        });
        return response;
    }catch(e)
    {
        return NextResponse.json({error:e.message,status:404});
    }
}