import { pusherServer, toPusherKey } from "@/chatconfig/pusher";
import { NextResponse } from "next/server";

export async function POST(request)
{
    const reqBody = await request.json();
    const {channelName,user,message,username} = reqBody
    console.log(channelName);
    pusherServer.trigger(toPusherKey(`user:${channelName}:incomingmessageforgroup`),"incomingmessageforgroup",{
        senderId:user,
        senderMessage:message,
        sender:username
    })
    return NextResponse.json({
        message:"hi",
        status:200
    })
}