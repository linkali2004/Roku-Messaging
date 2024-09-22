import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/UserModel";
import bcryptjs from "bcryptjs";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

connect();


export async function POST(request)
{
    try{
        const reqBody = await request.json();
        const {email,password} = reqBody;


        const user = await User.findOne({email:email});
        if(!user)
        {
            return NextResponse.json({message:`User with such email does not exist`,status:404});
        }
        const isMatch = await bcryptjs.compare(password,user.password)
        if(isMatch)
        {
            const tokenData = {
                id:user._id,
                username:user.username,
                  avatar:user.avatar || ""
            };

            const token = await jwt.sign(tokenData,process.env.TOKENSECRET,{expiresIn:'1d'});
            const response = NextResponse.json({
                message:"User Logged in Successfully",
                status:200
            })

            response.cookies.set("tokenJWT",token,{
                httpOnly:true
            });

            return response;
        }
        else
        {
            return NextResponse.json({
                message:"Invalid email or password",
                status:404
            })
        }
    }catch(e)
    {
        return NextResponse.json({error:e.message,status:404});
    }
}