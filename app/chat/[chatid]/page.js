"use client";

import ChatBox from "@/components/ChatBox";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { RegistrationContext } from "@/context/RegistrationContext";
import { SocketContext } from "@/context/SocketContext";

export default function Page({ params }) {
  const { currentChat, setCurrentChat, storeMessageInLocalStorage, chatUsers } = useContext(ChatContext);
  const { name } = useContext(RegistrationContext);
  const [chatBoxUsername, setChatBoxUsername] = useState("");
  const [realChat, setRealChat] = useState([]);
  const { socket, isConnected } = useContext(SocketContext);
  const [channelName, setChannelName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [chatAddedToPrevious, setChatAddedToPrevious] = useState(false); // New state

  useEffect(() => {
    async function previousMesssages() {
      setIsLoading(true);
      let dataToBeSent = { receiver: params.chatid, sender: name.userID };
      const res = await fetch("/api/fetchchatroommessages", {
        method: "POST",
        body: JSON.stringify(dataToBeSent),
        cache: "no-store",
      });
      const data = await res.json();
      setRealChat((prevchat) => [...data.message[0].messages]);
      setIsLoading(false);
    }
    previousMesssages();
  }, [name]);

  useEffect(() => {
    const channel = [params.chatid, name.userID].sort();
    setChannelName(channel.toString());
  }, [name]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => {
      setRealChat((prevMessages) => [...prevMessages, msg]);
      storeMessageInLocalStorage(msg, params.chatid, "singlechat");
    };

    socket.on(`receivemessage-${channelName}`, handleMessage);

    return () => {
      socket.off(`receivemessage-${channelName}`, handleMessage);
    };
  }, [socket, channelName]);

  async function sendMessage() {
    if (!isConnected || !socket) {
      console.log("Socket not connected");
      return;
    }

    console.log("Sending message:", { currentChat, channelName });
    let tobeSent = { currentChat, channelName, username: name.name };
    socket.emit("sendmessage", tobeSent);
    setCurrentChat("");

    if (!chatAddedToPrevious) {
      const userExists = chatUsers.find((user) => user._id === params.chatid);
      if (!userExists) {
        await fetch("/api/addToPreviousChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sender: name.userID, receiver: params.chatid }),
          cache: "no-store",
        });
        setChatAddedToPrevious(true); 
      }
    }
  }

  useEffect(() => {
    async function fetchName() {
      try {
        const response = await fetch("/api/decrypt-name", {
          method: "POST",
          body: JSON.stringify(params.chatid),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          setChatBoxUsername(data.message.username);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    }

    fetchName();
  }, [params.chatid]);

  return (
    <ChatBox
      chatid={params.chatid}
      isLoading={isLoading}
      chatBoxUsername={chatBoxUsername}
      sendMessage={sendMessage}
      actualMessages={realChat}
    />
  );
}
