import { cookies } from "next/headers";
import jwt  from "jsonwebtoken";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbconfig";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

connect();

export async function GET()
{
    const cookieStore = cookies();
    const encodedToken = cookieStore.get("tokenJWT")?.value;

    const decodedToken = jwt.decode(encodedToken);
    const userID = decodedToken.id;
    const userData = await User.findById(userID).select("username email password avatar");
    return NextResponse.json({
        data:userData
    });
}

export async function POST(request)
{
    const reqBody = await request.json();
    const {username,email,password,avatar,id} = reqBody;
    try
    {
        let salt = bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        const user = await User.findOne({_id:new mongoose.Types.ObjectId(id)});
        const isSame = password === user.password
        if(isSame)
        {
            const response = await User.findByIdAndUpdate(id,{$set:{username:username,email:email,password:user.password,avatar:avatar}},{new:true});
            console.log(response);
        }
        else
        {
            const response = await User.findByIdAndUpdate(id,{$set:{username:username,email:email,password:hashedPassword,avatar:avatar}},{new:true});
            console.log(response);
        }
        return NextResponse.json({
            message:"User Information Updated Successfully",
            status:200
        })
    }catch(e)
    {
        return NextResponse.json({
            message:e.message,
            status:400
        })
    }
}