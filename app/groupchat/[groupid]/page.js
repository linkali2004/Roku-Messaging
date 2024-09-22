"use client";
import Btn from '@/components/Btn';
import { ChatContext } from '@/context/ChatContext';
import { RegistrationContext } from '@/context/RegistrationContext';
import { TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { SocketContext } from '@/context/SocketContext';

export default function page({ params }) {
    const [realChat, setRealChat] = useState([]);
    const { name } = useContext(RegistrationContext);
    const { currentChat, setCurrentChat,storeMessageInLocalStorage } = useContext(ChatContext);
    const channelName = params.groupid;
    const { socket, isConnected } = useContext(SocketContext);


    useEffect(()=>{
        async function getGroupChats()
        {
            const participants = params.groupid.split("%2C");
            const res = await fetch("/api/fetchgroupchatroommessages",{
                method:"POST",
                body:JSON.stringify(participants)
            });
            const data =await res.json();
            setRealChat(()=>[...data.message[0].messages])
        }
        getGroupChats();
    },[])

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (msg) => {
          setRealChat((prevMessages) => [...prevMessages, msg]);
          storeMessageInLocalStorage(msg,params.groupid,"groupchat")
        };
    
        socket.on(`receivemessage-${channelName}`, handleMessage);
    
        return () => {
          socket.off(`receivemessage-${channelName}`, handleMessage);
        };
      }, [socket,channelName]);
    
    
      async function sendMessage() {
        if (!isConnected || !socket) {
          console.log("Socket not connected");
          return;
        }
    
        let tobeSent = {currentChat,channelName,username:name.name}
        socket.emit("sendmessage", tobeSent);
        setCurrentChat(""); 
    
      }
    return (
        <div className='h-full w-full p-2'>
            <div className='h-[85%] w-full bg-[#070b14] rounded-lg p-4 overflow-y-auto'>
                {realChat.map((data, index) => {
                        let a = new Date(data.time || data.timestamp);
                        let hours = a.getHours();
                        let minutes = a.getMinutes();
                        let ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; 
                        minutes = minutes < 10 ? '0'+minutes : minutes;
                    return (
                        <div key={index} className={`flex ${data.isCurrentUserSender === true ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className={`max-w-xs p-3 rounded-lg text-white ${data.isCurrentUserSender === true ? 'bg-blue-500' : 'bg-gray-800'} shadow-lg`}>
                            <p className="text-xs text-gray-400 mb-1">
                                {data.sender}
                            </p>
                            <p className="text-md">{data.message || data.content}</p>
                                    <small className="text-xs text-gray-300">{hours + ":" + minutes + " " + ampm}</small>
                        </div>
                    </div>
                    )
})}
            </div>
            <div className={"h-[15%] w-full bg-blue flex gap-4 items-center"}>
                <TextField variant="outlined"
                    size="small"
                    fullWidth
                    value={currentChat}
                    onChange={(e) => setCurrentChat(e.target.value)}
                    placeholder='Write a message'
                    sx={{
                        background: "#1F1F28",
                        marginTop: "5px",
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: '#A6A7AD',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#A6A7AD',
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                            borderRadius: "24px"
                        },
                    }}
                />

                <Btn text="Send" icon={<SendIcon></SendIcon>} bg="#126887" variant="contained" onClick={sendMessage}></Btn>
            </div>
        </div>
    )
}
