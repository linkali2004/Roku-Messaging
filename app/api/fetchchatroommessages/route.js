import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { StoredChats } from "@/models/StoredChats";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbconfig";

connect();

export async function POST(request)
{
    const reqBody = await request.json();
    const {receiver,sender} = reqBody;
    const response = await StoredChats.find({
        participants: { 
          $all: [
            new mongoose.Types.ObjectId(receiver),
            new mongoose.Types.ObjectId(sender)
          ]
        }
      });
      
    return NextResponse.json({
        message:response
    })
}