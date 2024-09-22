"use client";
import React from 'react';
import GroupChatInbox from '@/components/GroupChatInbox';
import { useMediaQuery } from '@mui/material';

export default function Layout({ children }) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTabletScreen = useMediaQuery("(max-width:840px)");
  return (
    <div className={isSmallScreen || isTabletScreen?"flex flex-col":"flex"}>
      <div className={isSmallScreen || isTabletScreen ?"w-full h-[40vh]" :"w-1/3 h-screen"}>
        <GroupChatInbox />
      </div>
      <div className={isSmallScreen || isTabletScreen ?"w-full h-[60vh]" :"w-2/3 h-screen"}>
        {children}
      </div>
    </div>
  );
}
