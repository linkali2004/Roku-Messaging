"use client";
import { Avatar, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SidebarNav from './SidebarNav';
import LogoutIcon from '@mui/icons-material/Logout';
export default function SideBar() {
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchName() {
      try {
        const response = await fetch('/api/decrypt-name', { method: 'GET' });
        const data = await response.json();
        if (response.ok) {
          setName(data.username);
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    }

    fetchName();
  }, []);

  async function handleLogout() {
    const response = await fetch("/api/logout", {
      method: "GET",
      cache: "no-cache"
    });

    window.location.href = "http://localhost:3000/credentials";
  }

  return (
    <>
      <div className='flex gap-4 items-center justify-center w-full'>
        <Avatar alt="placeholder" src="/assets/1.jpg" sx={{ border: "2px solid white" }} />
        <p className='text-xl font-semibold text-white'>Hi, {name || 'User'}</p>
      </div>
      <div>
        <SidebarNav />
      </div>
      <div className='h-full relative w-full'>
        <div className='absolute bottom-0 w-full flex justify-center'>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ background: "#126887", color: "white" }}
          >
            Log Out
          </Button>
        </div>
      </div>
    </>
  );
}
