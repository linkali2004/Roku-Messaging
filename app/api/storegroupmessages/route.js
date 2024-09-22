import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { StoredChats } from "@/models/StoredChats";
import { connect } from "@/dbConfig/dbconfig";

connect();

export async function POST(request) {
  const reqBody = await request.json();
  const {messages,participants} = reqBody;

  await handleChatUpdateOrCreate(messages,participants);
  return NextResponse.json({ message: "Chats processed successfully" });
}

async function handleChatUpdateOrCreate(messages,participants) {
  try {
    const query = { participants: { $all: participants } };

    const existingConversation = await StoredChats.findOne(query);

    if (existingConversation) {
      messages.forEach((chat) => {
        existingConversation.messages.push({
          content: chat.message,
          sender: chat.sender,
          timestamp: chat.time,
        });
      });
      await existingConversation.save();
    } else {
      const newConversation = new StoredChats({
        participants: participants,
        messages: messages.map((chat) => ({
          content: chat.message,
          sender: chat.sender,
          timestamp: new Date(),
        })),
      });
      await newConversation.save();
    }
  } catch (error) {
    console.error(`Error handling chat`, error);
  }
}
