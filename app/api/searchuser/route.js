import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";


export async function POST(request)
{
    await connect();
    try
    {
        const reqBody = await request.json();
        const regex = new RegExp(`^${reqBody}`, 'i');
        const response = await User.find({ username: regex });
        console.log('Search Results:', response);
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