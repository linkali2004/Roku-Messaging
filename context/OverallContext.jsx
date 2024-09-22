"use client";
import React, { createContext, useState } from "react";

export const OverallContext = createContext();

export default function OverallContextProvider({children})
{
    const [open, setOpen] = React.useState(false);
    const [searchModal,setsearchModal] = useState(false);
    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackbarMsg,setSnackbarMsg] = useState("");
    const [infoContact, setInfoConact] = React.useState(false);
    const handleOpen = () => setInfoConact(true);
    const handleClose = () => setInfoConact(false);
    return(
        <OverallContext.Provider value = {{snackbarMsg,setSnackbarMsg,snackOpen, setSnackOpen,open,toggleDrawer,setOpen,handleOpen,handleClose,infoContact,searchModal,setsearchModal}}>
            {children}
        </OverallContext.Provider>
    );
}