import { Server } from "socket.io";
import http from "http";
import express from "express";
import prisma from "../db/prisma.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const onlineUsers = new Map();
const offlineTimers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    const timer = offlineTimers.get(userId);
    if (timer) {
      clearTimeout(timer);
      offlineTimers.delete(userId);
    }
    onlineUsers.set(userId, socket.id);
    io.emit("user:status", { userId, status: socket.handshake.query.status });
  }

  socket.on("disconnect", () => {
    if (userId) {
      const timer = setTimeout(async () => {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { status: "offline" },
          });
          onlineUsers.delete(userId);
          io.emit("user:status", { userId, status: "offline" });
        } catch (err) {
          console.error("Error updating status on disconnect:", err);
        }
        offlineTimers.delete(userId);
      }, 5000);
      offlineTimers.set(userId, timer);
    }
  });
});

export { app, io, server, onlineUsers };
