"use client";
import Btn from '@/components/Btn';
import { ChatContext } from '@/context/ChatContext';
import { RegistrationContext } from '@/context/RegistrationContext';
import { Button, Chip, CircularProgress, TextField } from '@mui/material'
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'

export default function page() {
  const {name} = useContext(RegistrationContext)
  const [user, setUser] = useState("");
  const {addedUsers,setAddedUsers} = useContext(ChatContext);
  const[isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState("");

  const router = useRouter();


  
  async function  startChat()
  {
    const ids = addedUsers.map(user => user.id);
    ids.push(name.userID);
    const sortedIds = ids.sort();
    router.push(`/groupchat/${sortedIds.toString().trim()}`);
  }
  async function userAdder() {
    setIsLoading(true);
    setError("");
    const response = await fetch("/api/groupchatuserinfo",{
      method:"POST",
      body:JSON.stringify(user),
      headers:{
        'Content-Type':"application/json"
      },
      cache:"no-store"
    });
    const data = await response.json();
    if(data.status == 404)
    {
      setError(data.message); 
      setIsLoading(false);
    }
    else if(data.status == 200)
    {
      setAddedUsers((prev)=>[...prev,{username:data.message.username,id:data.message._id}])
      setIsLoading(false);
    }
  }
  return (
    <div className='h-full w-full flex flex-col justify-center items-center gap-2'>
      <p className='text-white font-semibold text-xl'>Type username to include into group chat</p>
      <div className='flex gap-2 w-full justify-center'>
        <TextField value={user}  onChange={(e) => setUser(e.target.value)} sx={{
          background: "#1F1F28",
          marginTop: "5px",
          borderRadius: "24px",
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
              borderRadius: "24px"
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
        }} />

        <Btn variant="contained" bg="black" text="Add" onClick={userAdder}></Btn>
      </div>
      {isLoading?<CircularProgress></CircularProgress>:(error != "" ? (
        <p className='text-white font-semibold font-md'>{error}</p>
      ):(
        <div className='flex gap-3 mt-4'>
        {addedUsers.map((item,index)=>{
          return (
            <Chip label={item.username} key = {item.id} className='bg-gray-800 text-white p-2 cursor-pointer'></Chip>
          )
        })}
       </div>
      )
      )}
      {addedUsers.length >=2 && <Btn variant="contained" bg="black" onClick={startChat} text="Start Chat"></Btn>}
    </div>
  )
}
