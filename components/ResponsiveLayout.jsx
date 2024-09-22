"use client";

import { useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import DrawerComp from "./Drawer";
import SnackbarComp from "./Snackbar";
import CallNotification from "./CallNotification";

export default function ResponsiveLayout({ children }) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTabletScreen = useMediaQuery("(max-width:840px)");

  return (
    <>
      {isSmallScreen || isTabletScreen ? (
        <div className="flex w-full h-screen flex-col">
          <Navbar />
          <div>{children}</div>
        </div>
      ) : (
        <div className="flex w-full h-screen">
          <div className="w-[17vw]">
            <DrawerComp />
          </div>
          <div className="w-[83vw] h-full flex flex-col gap-4">{children}</div>
        </div>
      )}
      <CallNotification></CallNotification>
      <SnackbarComp></SnackbarComp>
    </>
  );
}
