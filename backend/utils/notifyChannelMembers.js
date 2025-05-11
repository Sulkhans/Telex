import prisma from "../db/prisma.js";
import { io, onlineUsers } from "../socket/socket.js";

const notifyChannelMembers = async (
  channelId,
  eventName,
  excludeUserId = null,
  data = null
) => {
  const members = await prisma.channelMember.findMany({
    where: { channelId },
    select: { userId: true },
  });

  members.forEach(({ userId }) => {
    if (userId === excludeUserId) return;
    const socketId = onlineUsers.get(userId);
    if (socketId) {
      if (data) {
        io.to(socketId).emit(eventName, data);
      } else {
        io.to(socketId).emit(eventName);
      }
    }
  });
};

export { notifyChannelMembers };
