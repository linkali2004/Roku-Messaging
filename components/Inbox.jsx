"use client";
import { Button, Chip, Divider, Stack } from '@mui/material'
import React, { useContext } from 'react'
import Messages from './Messages'
import SearchIcon from '@mui/icons-material/Search';
import { OverallContext } from '@/context/OverallContext';
import SearchModal from './SearchModal';
import { ChatContext } from '@/context/ChatContext';


export default function Inbox() {
  const {setsearchModal} = useContext(OverallContext);
  const{setPublic} = useContext(ChatContext);

  return (
    <>
    <SearchModal></SearchModal>
    <div className='bg-gray-800 p-4 w-full h-screen flex flex-col gap-3'>
    <div className='flex gap-4 items-center justify-between'>
       <Stack direction="row" spacing={2}>
       <p className='text-xl font-semibold text-white'>Messages</p>
       <Chip  label="3 New" sx={{padding:"12px",background:"#126887",color:"white",marginTop:"4px"}} size="small"/>
       </Stack>
       <Button variant="contained" onClick={()=>setsearchModal(true)}  startIcon={ <SearchIcon sx={{color:"white"}}></SearchIcon>} sx={{background:"transparent"}} disableElevation></Button>
    </div>
    <Divider className='bg-gray-600'></Divider>
    <div className='flex justify-center'>
      <div className='rounded-lg flex gap-2 bg-gray-900 p-[12px]'>
        <Chip label="Public Chats" size="small" className='bg-gray-800 text-white p-2 cursor-pointer' onClick={()=>setPublic(true)}></Chip>
        <Chip label="Private Chats" size="small" className='bg-gray-800 text-white p-2 cursor-pointer' onClick={()=>setPublic(false)}></Chip>
      </div>
      </div>
    <div>
        <Messages></Messages>
    </div>
    </div>
    </>
  )
}
