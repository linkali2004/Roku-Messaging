import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/UserModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
connect();
export async function POST(request)
{
    const reqbody = await request.json();
    const{sender,receiver} = reqbody;
    const userid = new mongoose.Types.ObjectId(sender);
    const response = await User.findByIdAndUpdate(userid,{$push :{previousChats:receiver}},{new:true});
    const cookieStore = cookies();
    const currentUserID = cookieStore.get("tokenJWT")?.value;
    const decodedToken = jwt.decode(currentUserID);
    await User.findByIdAndUpdate(new mongoose.Types.ObjectId(receiver),{$push:{previousChats:decodedToken.id}})
    return NextResponse.json({
        message:"User added to previous chat"
    })
}