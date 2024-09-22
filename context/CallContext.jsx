"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { RegistrationContext } from "./RegistrationContext";
import Peer from "simple-peer";

export const CallContext = createContext();

export default function CallContextProvider({ children }) {
    const { socket, onlineUsers } = useContext(SocketContext);
    const { name } = useContext(RegistrationContext);
    const [ongoingCall, setOngoingCall] = useState("");
    const [currentSocketUser, setCurrentSocketUser] = useState();
    const [localstream, setLocalStream] = useState();
    const [peer, setPeer] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const getMediaStream = useCallback(async (facemode) => {
        if (localstream) {
            return localstream;
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(item => item.kind == "videoinput");
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 360, ideal: 720, max: 1080 },
                    frameRate: { min: 16, ideal: 30, max: 30 },
                    facingMode: videoDevices.length > 0 ? facemode : "user"
                }
            });
            setLocalStream(stream);
            return stream;
        } catch (e) {
            setLocalStream(null);
            return null;
        }
    }, [localstream]);

    const createPeer = useCallback((stream, initiator) => {
        const iceServers = [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478"
                ]
            }
        ];

        const newPeer = new Peer({
            stream,
            initiator,
            trickle: true,
            config: { iceServers }
        });

        newPeer.on('stream', (remoteStream) => {
            setRemoteStream(remoteStream);
        });

        newPeer.on('error', console.error);
        newPeer.on('close', () => setPeer(null));

        return newPeer;
    }, []);

    const completePeerConnection = useCallback(async (connectionData) => {
        if (!localstream) return;

        if (peer && !peer.destroyed) {
            try {
                peer.signal(connectionData.sdp);
            } catch (err) {
                console.error('Error signaling peer:', err);
            }
            return;
        }

        const newPeer = createPeer(localstream, false);
        setPeer(newPeer);

        newPeer.once("signal", (data) => {
            if (socket) {
                socket.emit("webrtcsignal", {
                    sdp: data,
                    ongoingCall: ongoingCall,
                    isCaller: true
                });
            }
        });

        newPeer.signal(connectionData.sdp);
    }, [localstream, createPeer, peer, ongoingCall, socket]);

    const answerCall = useCallback(async () => {
        const stream = await getMediaStream();
        if (!stream) {
            return;
        }

        if (!peer) {
            const newPeer = createPeer(stream, true);
            setPeer(newPeer);

            newPeer.once("signal", (data) => {
                if (socket) {
                    socket.emit("webrtcsignal", {
                        sdp: data,
                        ongoingCall: ongoingCall,
                        isCaller: false
                    });
                }
            });
        }
    }, [getMediaStream, peer, ongoingCall, socket]);

    const handleCall = useCallback(async (user, caller) => {
        if (!socket || !currentSocketUser) return;

        const callingUser = onlineUsers?.find(ele => ele.id === user);
        const participants = { caller: currentSocketUser.socketId, receiver: callingUser.socketId };
        const stream = await getMediaStream();

        if (!stream) {
            return;
        }

        setOngoingCall({
            participants,
            isRinging: false,
            caller
        });

        socket.emit("call", { participants, caller });
    }, [socket, currentSocketUser, onlineUsers, getMediaStream]);

    const hangupCall = useCallback(() => {
        if (peer) {
            peer.destroy();
        }

        if (localstream) {
            localstream.getTracks().forEach(track => track.stop());
        }

        setPeer(null);
        setRemoteStream(null);
        setLocalStream(null);
        setOngoingCall("");
        socket.emit("endcall", ongoingCall);
    }, [peer, localstream, socket, ongoingCall]);

    useEffect(() => {
        const currentSocketUser = onlineUsers?.find(ele => ele.id === name.userID);
        setCurrentSocketUser(currentSocketUser);
    }, [name, onlineUsers]);

    useEffect(() => {
        if (!socket) return;

        socket.on("incomingcall", (data) => {
            const { participants, caller } = data;
            setOngoingCall({ participants, caller, isRinging: true });
        });

        socket.on("webrtcsignal", completePeerConnection);

        socket.on("endcall", () => {
            if (peer) {
                peer.destroy();
            }
            if (localstream) {
                localstream.getTracks().forEach(track => track.stop());
            }
            setPeer(null);
            setRemoteStream(null);
            setLocalStream(null);
            setOngoingCall("");
        });

        return () => {
            socket.off("incomingcall");
            socket.off("webrtcsignal");
            socket.off("endcall");
        };
    }, [socket, completePeerConnection, peer, localstream]);

    return (
        <CallContext.Provider value={{ ongoingCall, setOngoingCall, handleCall, localstream, answerCall, peer, remoteStream, hangupCall }}>
            {children}
        </CallContext.Provider>
    );
}
