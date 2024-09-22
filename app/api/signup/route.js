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
        const {username,email,password} = reqBody;
        console.log(reqBody);
        const user = await User.findOne({username:reqBody.username});
        if(user)
        {
            return NextResponse.json({message:`User with name ${username} already exist`,status:404});
        }

        let salt = bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const newUser = new User({
            username,email,password:hashedPassword
        });

        const savedUser = await newUser.save();


        const tokenData = {
            id:savedUser._id,
            username:savedUser.username,
            avatar:savedUser.avatar || ""
        };

        const token = await jwt.sign(tokenData,process.env.TOKENSECRET,{expiresIn:'1d'});

        const response = NextResponse.json({
            message:"User Signed up Successfully",
            status:200
        })

        response.cookies.set("tokenJWT",token,{
            httpOnly:true
        });

        return response;
    }catch(e)
    {
        return NextResponse.json({error:e.message,status:404});
    }
}