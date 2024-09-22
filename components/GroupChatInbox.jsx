"use client";
import { Chip, CircularProgress, Divider, Stack } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import GroupChatInboxContainer from './GroupChatInboxContainer';
import { RegistrationContext } from '@/context/RegistrationContext';


export default function GroupChatInbox() {
    const [isLoading,setIsLoading] = useState(false);
    const[groups,setGroups] = useState([]);
    const {name} = useContext(RegistrationContext);
    useEffect(()=>{
        async function getgroups()
        {
            setIsLoading(true);
            const response = await fetch("/api/getgroupchatinfo",{method:"POST",
              body:JSON.stringify(name.userID)
            });
            const data = await response.json();
            console.log(data);
            setIsLoading(false);
            setGroups(data.chats);
        }
        getgroups();
    },[])
  return (
    <>
    <div className='bg-gray-800 p-4 w-full h-screen flex flex-col gap-3'>
    <div className='flex gap-4 items-center justify-between'>
       <Stack direction="row" spacing={2}>
       <p className='text-xl font-semibold text-white'>Groups</p>
       <Chip  label="3 New" sx={{padding:"12px",background:"#126887",color:"white",marginTop:"4px"}} size="small"/>
       </Stack>
    </div>
    <Divider className='bg-gray-600'></Divider>
    <div className='flex justify-center'>
      <div className='rounded-lg flex gap-2 bg-gray-900 p-[12px]'>
        <Chip label="Public Chats" size="small" className='bg-gray-800 text-white p-2 cursor-pointer'></Chip>
        <Chip label="Private Chats" size="small" className='bg-gray-800 text-white p-2 cursor-pointer'></Chip>
      </div>
      </div>
    <div>
    {isLoading ? (
        <div className="flex w-full justify-center">
          <CircularProgress />
        </div>
      ): 
        <GroupChatInboxContainer groups={groups}></GroupChatInboxContainer>}
    </div>
    </div>
    </>
  )
}
