"use client";
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import SidebarNav from './SidebarNav';
import { OverallContext } from '@/context/OverallContext';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function DrawerComp() {
  const { open, toggleDrawer } = React.useContext(OverallContext);

  async function handleLogout() {
    const response = await fetch("/api/logout", {
      method: "GET",
      cache: "no-cache",
    });

    window.location.href = "http://localhost:3000/credentials";
  }

  return (
    <Drawer
      variant="persistent"
      open={true}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#070b14',
          color: '#fff',
          width: '17vw',
          position: 'relative',
          height:"100vh"
        },
      }}
    >
      <SidebarNav />
      <div className="h-full relative w-full">
        <div className="absolute bottom-0 w-full flex justify-center py-4">
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
    </Drawer>
  );
}
