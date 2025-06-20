const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const getReceiverSocketId = (userId) => {
  return useSocketMap[userId];
};

const useSocketMap = {};

io.on("connection", (socket) => {
  console.log(`connected with id: ${socket.id}`);
  const userId = socket.handshake.query.userId;
  if (userId) {
    useSocketMap[userId] = socket.id;
  }

  io.emit("onlineUsers", Object.keys(useSocketMap));

  console.log(useSocketMap);
  socket.on("disconnect", () => {
    console.log(`disconnected with id: ${socket.id}`);
    delete useSocketMap[userId];
    io.emit("onlineUsers", Object.keys(useSocketMap));
  });
});

module.exports = { app, server, io, getReceiverSocketId };
