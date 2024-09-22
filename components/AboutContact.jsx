"use client";
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import { OverallContext } from '@/context/OverallContext';
import { Avatar, Chip, Divider } from '@mui/material';

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

export default function AboutContact() {
  const { infoContact, handleClose } = React.useContext(OverallContext);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={infoContact}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={infoContact}>
          <Box sx={style} className="flex flex-col items-center">
            <div className='w-full flex flex-col items-center'>
              <Avatar alt="placeholder" src="/assets/1.jpg" sx={{
                border: "2px solid white",
                width: { xs: "60px", sm: "80px" },
                height: { xs: "60px", sm: "80px" }
              }} />
              <div className='flex flex-col items-center gap-2'>
                <p className='text-lg sm:text-xl font-light text-white font-bold'>Jon Jacobs</p>
                <div className='flex gap-2'>
                  <PermPhoneMsgIcon className='text-gray-300' fontSize='small' />
                  <p className='text-xs sm:text-sm font-light text-gray-300'>+918303870736</p>
                </div>
              </div>
              <div className='w-full mt-2'>
                <Divider className='bg-gray-700' />
              </div>
              <div className='flex flex-col items-center gap-1'>
                <p className='text-lg sm:text-xl font-light text-white font-semibold'>About</p>
                <div className='flex gap-2'>
                  <p className='text-xs sm:text-sm font-light text-gray-300'>
                    Hello! I'm Shiva Gangadhar Koppireddy, a passionate and driven Mechanical Engineering student with a deep interest in merging the worlds of mechanical engineering and computer science
                  </p>
                </div>
              </div>
              <div className='w-full mt-2'>
                <Divider className='bg-gray-700' />
              </div>
              <div className='rounded-lg flex gap-2 bg-gray-800 p-[8px] sm:p-[12px] mt-2'>
                <Chip label="Images" size="small" className='bg-gray-900 text-white p-2 cursor-pointer'></Chip>
                <Chip label="Videos" size="small" className='bg-gray-900 text-white p-2 cursor-pointer'></Chip>
                <Chip label="Documents" size="small" className='bg-gray-900 text-white p-2 cursor-pointer'></Chip>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
