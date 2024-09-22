import { connect } from "@/dbConfig/dbconfig";
import User from "@/models/UserModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const userId = reqBody;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const response = await User.findById(userId);
    const talkedUsersArray = response.previousChats;
    const objectIds = talkedUsersArray.map(id => new mongoose.Types.ObjectId(id));

    const talkedUsers  = await User.find({_id:{$in:objectIds}}).select("username _id");
    return NextResponse.json({
      message: "Previous chats fetched successfully",
      previousChats: talkedUsers.length > 0 ? talkedUsers : []
    });
  } catch (error) {
    console.error("Error fetching previous chats:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
