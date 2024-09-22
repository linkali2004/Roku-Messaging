import { connect } from "@/dbConfig/dbconfig";
import { StoredChats } from "@/models/StoredChats";
import mongoose from "mongoose";
import { NextResponse } from "next/server";



export async function POST(request) {
  await connect();
  try {
    const reqBody = await request.json();
    const userId = reqBody;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const storedChats = await StoredChats.find({
      $and: [
        { participants: userId },
        { $expr: { $gte: [{ $size: "$participants" }, 3] } }
      ]
    }).select("participants");

    return NextResponse.json({
      message: "Fetched Successfully",
      chats: storedChats.length > 0 ? storedChats : []
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
