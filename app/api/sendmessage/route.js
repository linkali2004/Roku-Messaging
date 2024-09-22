import { pusherServer, toPusherKey } from "@/chatconfig/pusher";
import { NextResponse } from "next/server";

export async function POST(request)
{
    const reqBody = await request.json();
    const {content,user,currentUserId} = reqBody;
    const generateChannelName = () => {
        const ids = [user, currentUserId].sort();
        return `chat:${ids[0]}:${ids[1]}`; 
      };
      const channelname = generateChannelName();
    pusherServer.trigger(toPusherKey(`user:${channelname}:incoming_message`),"incoming_message",{
        senderId:currentUserId,
        senderMessage:content,
        receiverId:user
    })
    return NextResponse.json({
        message:"hi",
        status:200
    })
}