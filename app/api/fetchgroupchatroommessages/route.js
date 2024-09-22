import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { StoredChats } from "@/models/StoredChats";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbconfig";

connect();

export async function POST(request)
{
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