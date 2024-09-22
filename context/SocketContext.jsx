"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { RegistrationContext } from "./RegistrationContext";
import { usePathname } from "next/navigation";

export const SocketContext = createContext();

export default function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { signinSuccess, signupSuccess } = useContext(RegistrationContext);
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const pathname= usePathname();

  useEffect(() => {
    const newSocket = io(); 
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchUserDetails() {
      const userDetails = await fetch("/api/decrypt-name", { method: "GET" });
      const data = await userDetails.json();
      setUser(data);
    }

      if(pathname != "/credentials")
      {
        fetchUserDetails();
      }
  }, [socket]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("addNewUser", user);

    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getUsers",(users) => {
        setOnlineUsers(users);
      });
    };
  }, [socket,user]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ isConnected, socket,onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
