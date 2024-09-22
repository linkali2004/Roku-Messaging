import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";  
const port = process.env.PORT || 3000;

const app = next({ dev, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",  
      methods: ["GET", "POST"],
    },
  });

  let onlineUsers = [];

  io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on("sendmessage", (chat) => {
      let temp = {message: chat.currentChat, sender: chat.username, time: new Date()};
      io.emit(`receivemessage-${chat.channelName}`, temp);
    });

    socket.on("addNewUser", (user) => {
      if (user != null) {
        const found = onlineUsers.find((item) => item.id == user.id);
        if (!found) {
          onlineUsers.push({
            id: user.id,
            socketId: socket.id,
            username: user.username,
          });
          if (dev) console.log(onlineUsers);  
        }
      }
      io.emit("getUsers", onlineUsers);
    });

    socket.on("call", (data) => {
      io.to(data.participants.receiver).emit("incomingcall", data);
    });

    socket.on("webrtcsignal", (data) => {
      if (data.isCaller) {
        if (data.ongoingCall.participants.receiver) {
          io.to(data.ongoingCall.participants.receiver).emit("webrtcsignal", data);
        }
      } else {
        if (data.ongoingCall.participants.caller) {
          io.to(data.ongoingCall.participants.caller).emit("webrtcsignal", data);
        }
      }
    });

    socket.on("endcall", (ongoingCall) => {
      if (ongoingCall?.participants?.caller) {
        io.to(ongoingCall.participants.caller).emit("endcall");
      }
      if (ongoingCall?.participants?.receiver) {
        io.to(ongoingCall.participants.receiver).emit("endcall");
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((item) => item.socketId !== socket.id);
      io.emit("getUsers", onlineUsers);
      console.log(`User with socket ID ${socket.id} disconnected`);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
