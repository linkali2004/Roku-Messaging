import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";


export async function POST(request)
{
    await connect();
    try
    {
        const reqBody = await request.json();
        const response = await User.findOne({ username: reqBody }).select("username _id");
        console.log(response);
        if(response == null)
        {
            return NextResponse.json({
                message:"No such User found",
                status:404
            })
        }
        
        return NextResponse.json({
            message:response,
            status:200
        })
    }
    catch(e)
    {
        console.log(e);
    }
}