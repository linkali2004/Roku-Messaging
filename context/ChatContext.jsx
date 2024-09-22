"use client";

import { createContext, useState } from "react";

export const ChatContext = createContext();

export default function ChatContextProvider({children})
{
    const [chatUsers,setChatUsers] = useState([])
    const [searchQuery,setSearchQuery] = useState("");
    const[favourite,setFavourite] = useState([]);
    const[Public,setPublic] = useState(true);
    const [currentChat,setCurrentChat] = useState("");
    const[addedUsers,setAddedUsers] = useState([]);

    function storeMessageInLocalStorage(data,secondUser,type) {
      if(type == "singlechat")
      {
        let storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        
        storedMessages.push({
          message: data.message,
          sender: data.sender,
          time: data.time
        });
    
        localStorage.setItem('chatMessages', JSON.stringify(storedMessages));
    
        if (storedMessages.length >= 2) {
          persistMessagesToDatabaseForSingleChat(secondUser);
        }
      }
      else if(type == "groupchat")
      {
        let storedMessages = JSON.parse(localStorage.getItem('GroupchatMessages')) || [];
        
        storedMessages.push({
          message: data.message,
          sender: data.sender,
          time: data.time
        });
    
        localStorage.setItem('GroupchatMessages', JSON.stringify(storedMessages));
    
        if (storedMessages.length >= 2) {
          persistMessagesToDatabaseForGroupChat(secondUser);
        }
      }
      }
    
      async function persistMessagesToDatabaseForSingleChat(secondUser) {
        const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    
        if (storedMessages && storedMessages.length > 2) {
          const response = await fetch("/api/storemessage", {
            method: "POST",
            headers: {
              'Content-Type': "application/json"
            },
            body: JSON.stringify({ messages: storedMessages , secondUser:secondUser }),
            cache: "no-store"
          });
    
          if (response.ok) {
            localStorage.removeItem('chatMessages'); 
          } else {
            console.error("Failed to store messages");
          }
        }
      }

      async function persistMessagesToDatabaseForGroupChat(secondUser) {
        let participants = secondUser.split("%2C");
        const storedMessages = JSON.parse(localStorage.getItem('GroupchatMessages'));
    
        if (storedMessages && storedMessages.length > 2) {
          const response = await fetch("/api/storegroupmessages", {
            method: "POST",
            headers: {
              'Content-Type': "application/json"
            },
            body: JSON.stringify({ messages: storedMessages , participants:participants }),
            cache: "no-store"
          });
    
          if (response.ok) {
            localStorage.removeItem('GroupchatMessages'); 
          } else {
            console.error("Failed to store messages");
          }
        }
      }
    
    return (
        <ChatContext.Provider value={{storeMessageInLocalStorage,persistMessagesToDatabaseForSingleChat,persistMessagesToDatabaseForGroupChat,addedUsers,setAddedUsers,chatUsers,searchQuery,setSearchQuery,favourite,setFavourite,Public,setChatUsers,setPublic,currentChat,setCurrentChat}}>
            {children}
        </ChatContext.Provider>
    )
}