"use client";
import React from 'react';
import { useMediaQuery } from '@mui/material';
import CallInbox from '@/components/CallInbox';

export default function Layout({ children }) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTabletScreen = useMediaQuery("(max-width:840px)");
  return (
    <div className={isSmallScreen || isTabletScreen ? "flex flex-col" :"flex"}>
      <div className={isSmallScreen || isTabletScreen ?"w-full h-[70vh]" :"w-1/3 h-screen"}>
        <CallInbox />
      </div>
      <div className={isSmallScreen || isTabletScreen ?"w-full h-[30vh]" :"w-2/3 h-screen"}>
        {children}
      </div>
    </div>
  );
}
