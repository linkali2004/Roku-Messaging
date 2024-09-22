"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CallIcon from '@mui/icons-material/Call';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, CircularProgress } from '@mui/material';
import { RegistrationContext } from '@/context/RegistrationContext';
import Btn from './Btn';
import LoginIcon from '@mui/icons-material/Login';
import { usePathname, useRouter } from 'next/navigation';
import GroupIcon from '@mui/icons-material/Group';
import { SocketContext } from '@/context/SocketContext';

export default function SidebarNav() {
  const { signinSuccess, signupSuccess, name, setName,isUpdated } = React.useContext(RegistrationContext);
  const [loading, setLoading] = React.useState(true); 
  const pathname = usePathname();
  

  async function fetchName() {
    try {
      const response = await fetch('/api/decrypt-name', { method: 'GET' ,cache:"no-store"});
      const data = await response.json();
      if (response.ok) {
        setName({ name: data.username, userID: data.id });
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching name:', error);
    } finally {
      setLoading(false);
    }
  }
  
  React.useEffect(() => {
      if(pathname != "/credentials")
      {
        fetchName();
      }
      setLoading(false)
  }, [signinSuccess, signupSuccess,isUpdated]);

  React.useEffect(() => {
    if(pathname != "/credentials")
    {
      fetchName();
    }
    setLoading(false)
  }, []);
  

  const router = useRouter();
  function redirectToSign() {
    router.push("/credentials");
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'transparent', color: 'white' }}>
      <div className='flex gap-2 p-4 items-center justify-center'>
        <Image src="/assets/chat.png" alt="Logo" width={30} height={30} />
        <p className='text-2xl font-bold text-white'>Roku</p>
      </div>

      <div className='flex gap-4 items-center justify-center w-full mt-4 mb-3'>
        {loading ? (
          <CircularProgress sx={{ color: 'white' }} />
        ) : (
          name.userID != null ? (
            <>
              <Avatar alt="placeholder" src="/assets/1.jpg" sx={{ border: "2px solid white" }} />
              <p className='text-xl font-semibold text-white'>Hi, {name.name || 'User'}</p>
            </>
          ) : (
            <Btn text="Sign up or Login" onClick={redirectToSign} bg="black" variant="contained" icon={<LoginIcon />} />
          )
        )}
      </div>

      <nav aria-label="main mailbox folders" className='mt-1'>
        <List>
          <ListItem disablePadding>
            <Link href="/" passHref legacyBehavior>
              <ListItemButton
                selected={pathname == '/'}
              >
                <ListItemIcon>
                  <HomeIcon sx={{ color: 'rgb(203 213 225)' }} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/chat" passHref legacyBehavior>
              <ListItemButton
                selected={pathname == "/chat"}
              >
                <ListItemIcon>
                  <ChatBubbleIcon sx={{ color: 'rgb(203 213 225)' }} />
                </ListItemIcon>
                <ListItemText primary="Chats" />
              </ListItemButton>
            </Link>
          </ListItem>

          <ListItem disablePadding>
            <Link href="/calls" passHref legacyBehavior>
              <ListItemButton
                selected={pathname == "/calls"}
              >
                <ListItemIcon>
                  <CallIcon sx={{ color: 'rgb(203 213 225)' }} />
                </ListItemIcon>
                <ListItemText primary="Calls" />
              </ListItemButton>
            </Link>
          </ListItem>


          <ListItem disablePadding>
            <Link href="/groupchat" passHref legacyBehavior>
              <ListItemButton
                selected={pathname == "/groupchat"}
              >
                <ListItemIcon>
                  <GroupIcon sx={{ color: 'rgb(203 213 225)' }} />
                </ListItemIcon>
                <ListItemText primary="Group Chat" />
              </ListItemButton>
            </Link>
          </ListItem>


          <ListItem disablePadding>
            <Link href="/settings" passHref legacyBehavior>
              <ListItemButton
                selected={pathname == "/settings"}
              >
                <ListItemIcon>
                  <SettingsIcon sx={{ color: 'rgb(203 213 225)' }} />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
