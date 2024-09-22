"use client";
import { OverallContext } from '@/context/OverallContext';
import { Alert, Backdrop, Box, Button, CircularProgress, Fade, Modal, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { ChatContext } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';

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

export default function SearchModal() {
    const { searchModal, setsearchModal } = useContext(OverallContext);
    const { searchQuery, setSearchQuery } = useContext(ChatContext);
    const [searchDataDisply, setSearchDataDisplay] = useState(null);
    const {setSelectedChat} = useContext(ChatContext);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function triggerSearch() {
        setIsLoading(true);
        setSearchDataDisplay(null);
        const response = await fetch("/api/searchuser", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(searchQuery),
            cache: "no-cache"
        });

        const data = await response.json();
        console.log(data);

        if (data.message && data.message.length > 0) {
            setSearchDataDisplay(data.message);
        } else {
            setSearchDataDisplay([]);
        }

        setIsLoading(false);
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={searchModal}
            onClose={() => { setsearchModal(false) }}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={searchModal}>
                <Box sx={style} className="flex flex-col items-center">
                    <div className='w-full flex flex-row gap-3'>
                        <TextField variant="outlined"
                            size="small"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Search User'
                            sx={{
                                background: "#1F1F28",
                                marginTop: "5px",
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#A6A7AD',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#A6A7AD',
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                    borderRadius: "24px"
                                },
                            }}
                        />
                        <Button onClick={triggerSearch} variant="contained"  startIcon={<SearchIcon sx={{ color: "white" }} />} sx={{ background: "black"}} disableElevation>search</Button>
                    </div>
                    <div className='p-4'>
                        {isLoading ? <CircularProgress /> : (
                            (searchDataDisply === null || searchDataDisply.length === 0) ? (
                                <p className='text-dark font-bold'>No Result, Type name of someone who uses our service</p>
                            ) : (
                                searchDataDisply.map((data, index) => (
                                    <Alert onClick={()=>router.push(`/chat/${data._id}`)} sx={{ background: "black", color: "white", textTransform: "capitalize", cursor: "pointer" }} key={data._id}>{data.username}</Alert>
                                ))
                            )
                        )}
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}
