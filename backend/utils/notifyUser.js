import { io, onlineUsers } from "../socket/socket.js";

const notifyUser = (userId, eventName, data = null) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    if (data !== null) {
      io.to(socketId).emit(eventName, data);
    } else {
      io.to(socketId).emit(eventName);
    }
  }
};

export { notifyUser };
