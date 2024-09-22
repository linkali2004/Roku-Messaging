"use client";
import { CallContext } from '@/context/CallContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import Btn from '@/components/Btn';

export default function Page() {
  const { localstream, peer, hangupCall, remoteStream } = useContext(CallContext);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);

  const videoRefSender = useRef();
  const videoRefReceiver = useRef();

  useEffect(() => {
    if (localstream) {
      const videoTrack = localstream.getVideoTracks()[0];
      setIsVidOn(videoTrack.enabled);
      const audioTrack = localstream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
    }
  }, [localstream]);

  const toggleCamera = useCallback(() => {
    if (localstream) {
      const videoTrack = localstream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidOn(videoTrack.enabled);
    }
  }, [localstream]);

  const toggleMic = useCallback(() => {
    if (localstream) {
      const audioTrack = localstream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localstream]);

  useEffect(() => {
    if (videoRefSender.current && localstream) {
      videoRefSender.current.srcObject = localstream;
    }
    if (videoRefReceiver.current && peer) {
      videoRefReceiver.current.srcObject = peer.streams[0];
    }
  }, [localstream, peer, remoteStream]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-full h-[500px] bg-black rounded-md overflow-hidden">
        <video ref={videoRefReceiver} autoPlay className="w-full h-full object-cover" />
        <span className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">Remote Video</span>

        <div className="absolute top-4 left-4 w-[150px] h-[100px] bg-black rounded-md overflow-hidden">
          <video ref={videoRefSender} autoPlay muted={true} className="w-full h-full object-cover" />
          <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">Your Video</span>
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full justify-center">
        {isMicOn ? (
          <Btn onClick={toggleMic} icon={<VolumeUpIcon />} variant="contained" bg="black" />
        ) : (
          <Btn onClick={toggleMic} icon={<VolumeOffIcon />} variant="contained" bg="black" />
        )}
        {isVidOn ? (
          <Btn onClick={toggleCamera} icon={<VideocamIcon />} variant="contained" bg="black" />
        ) : (
          <Btn onClick={toggleCamera} icon={<VideocamOffIcon />} variant="contained" bg="black" />
        )}
        <Btn onClick={hangupCall} icon={<CallEndIcon sx={{ color: "red" }} />} variant="contained" bg="black" />
      </div>
    </div>
  );
}
