import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { StoredChats } from "@/models/StoredChats";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbconfig";



export async function POST(request)
{
  await connect();
    const reqBody = await request.json();
    const response = await StoredChats.find({
        participants: { 
          $all: reqBody
        }
      });

      console.log(response);
      
    return NextResponse.json({
        message:response
    })
}