"use client";
import { Button, Chip, Divider, Stack } from '@mui/material'
import React, { useContext } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ChatContext } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import { RegistrationContext } from '@/context/RegistrationContext';
import { CircularProgress } from '@mui/material';
import { SocketContext } from '@/context/SocketContext';
import { CallContext } from '@/context/CallContext';


export default function CallInbox() {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const {chatUsers, setChatUsers } = React.useContext(ChatContext);
  const { name } = React.useContext(RegistrationContext);
  const {socket} = React.useContext(SocketContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const {handleCall} = useContext(CallContext);

  const handleListItemClick = (event, index, link) => {
    setSelectedIndex(index);
    handleCall(link,name.name);
  };
  
  React.useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const response = await fetch("/api/fetchtalkeduser", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(name.userID),
        cache: "no-store"
      });
      const data = await response.json();
      setChatUsers(data.previousChats);
      setIsLoading(false);
    }
    if (name.userID != null) {
      fetchUsers();
    }
  }, [name,socket]);

  return (
    <>
    <div className='bg-gray-800 p-4 w-full h-screen flex flex-col gap-3'>
    <div className='flex gap-4 items-center justify-between'>
       <Stack direction="row" spacing={2}>
       <p className='text-xl font-semibold text-white'>Call Inbox</p>
       <Chip  label="3 New" sx={{padding:"12px",background:"#126887",color:"white",marginTop:"4px"}} size="small"/>
       </Stack>
    </div>
    <Divider className='bg-gray-600'></Divider>
    <div>
    <>
      {isLoading && (
        <div className="flex w-full justify-center">
          <CircularProgress />
        </div>
      )}
      <List sx={{ width: '100%', bg: "transparent", color: "white" }}>
        {chatUsers?.map((item, index) => {
          return (
            <React.Fragment key={item._id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  backgroundColor: selectedIndex === index ? '#191924' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={(event) => handleListItemClick(event, index, item._id)}
              >
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/assets/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={item.username}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: '#A6A7AD', display: 'inline' }}
                    >
                      Click to initiate a video call
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </>
    </div>
    </div>
    </>
  )
}
