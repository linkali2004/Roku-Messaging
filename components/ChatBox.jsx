"use client";
import { Avatar, Button, CircularProgress, Divider, TextField } from '@mui/material';
import React, { useContext, useCallback } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Btn from './Btn';
import { OverallContext } from '@/context/OverallContext';
import AboutContact from './AboutContact';
import { ChatContext } from '@/context/ChatContext';
import { RegistrationContext } from '@/context/RegistrationContext';
import { SocketContext } from '@/context/SocketContext';
import { useRouter } from 'next/navigation';

export default function ChatBox({ chatBoxUsername, sendMessage, actualMessages, isLoading, chatid }) {
  const { handleOpen } = useContext(OverallContext);
  const { currentChat, setCurrentChat, persistMessagesToDatabaseForSingleChat } = useContext(ChatContext);
  const { name } = useContext(RegistrationContext);
  const { onlineUsers } = useContext(SocketContext);
  const route = useRouter();

  const handlePersistMessages = useCallback(async () => {
    await persistMessagesToDatabaseForSingleChat(chatid);
    route.replace("/chat");
  }, [chatid, persistMessagesToDatabaseForSingleChat, route]);

  const handleSendMessage = useCallback(() => {
    sendMessage();
  }, [sendMessage]);

  const handleSetCurrentChat = useCallback((e) => {
    setCurrentChat(e.target.value);
  }, [setCurrentChat]);

  const handleCloseChat = useCallback(() => {
    handlePersistMessages();
  }, [handlePersistMessages]);

  return (
    <>
      <AboutContact />
      <div className='flex justify-between w-full p-4 h-[10%]'>
        <div className='flex gap-3' onClick={handleOpen}>
          <Avatar alt="placeholder" src="/assets/1.jpg" sx={{ border: "2px solid white" }} />
          <div className='flex flex-col'>
            <p className='text-md font-light text-white'>{chatBoxUsername}</p>
            {
              onlineUsers.find((item) => item.id === chatid) 
              ? <small className='text-green-400'>Active</small> 
              : <small className='text-gray-400'>Inactive</small>
            }
          </div>
        </div>

        <div className='flex gap-4 items-center'>
          <Button
            variant="contained"
            sx={{ background: "red", color: "white" }}
            onClick={handleCloseChat}
          >
            Close
          </Button>
        </div>
      </div>
      <Divider className='ml-2 mr-2 bg-gray-600'></Divider>

      <div className='h-[90%] w-full p-2'>
        <div className='h-[85%] w-full bg-[#070b14] rounded-lg p-4 overflow-y-auto'>
          {isLoading ? <CircularProgress /> : actualMessages?.map((data, index) => {
            let a = new Date(data.time || data.timestamp);
            let hours = a.getHours();
            let minutes = a.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            return (
              <div key={index} className={`flex ${data.sender === name.name ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs p-3 rounded-lg text-white ${data.sender === name.name ? 'bg-blue-500' : 'bg-gray-800'} shadow-lg`}>
                  <p className="text-md">{data.message || data.content}</p>
                  <small className="text-xs text-gray-300">{hours + ":" + minutes + " " + ampm}</small>
                  <p className="text-sm text-gray-600">-----{data.sender}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={"h-[15%] w-full bg-blue flex gap-4 items-center"}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={currentChat}
            onChange={handleSetCurrentChat}
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
                borderRadius: "24px",
              },
            }}
          />

          <Btn text="Send" icon={<SendIcon />} bg="#126887" variant="contained" onClick={handleSendMessage}></Btn>
        </div>
      </div>
    </>
  );
}
