"use client";
import { OverallContext } from '@/context/OverallContext';
import { Alert, Backdrop, Box, Button, CircularProgress, Fade, Modal, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter } from 'next/navigation';
import { CallContext } from '@/context/CallContext';
import Btn from './Btn';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '100%',
    bgcolor: 'rgb(17 24 39)',
    borderRadius: "20px",
    boxShadow: 24,
    color: "white",
    p: { xs: 2, sm: 4 },
    overflow: 'auto'
};

export default function CallNotification() {
    const {ongoingCall,setOngoingCall,answerCall} = useContext(CallContext);
    const router = useRouter();
    function onClickHandler()
    {
        setOngoingCall((prev)=>({...prev,isRinging:false}));
        answerCall()
    }
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={ongoingCall.isRinging}
            onClose={() => { setOngoingCall((prev) => ({...prev,isRinging:false})) }}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={ongoingCall?.isRinging}>
                <Box sx={style} className="flex flex-col items-center">
                    {ongoingCall?.caller} is calling you
                    <div className='flex gap-3'>
                        <Btn bg="black" icon ={<CheckIcon sx={{color:"green"}}></CheckIcon>} onClick={onClickHandler} ></Btn>
                        <Btn bg="black" icon ={<ClearIcon sx={{color:"red"}}></ClearIcon>} ></Btn>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}
