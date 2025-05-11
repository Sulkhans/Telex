import prisma from "../db/prisma.js";
import { notifyChannelMembers } from "../utils/notifyChannelMembers.js";

const sendMessage = async (req, res) => {
  try {
    const { channelId, content } = req.body;
    if (!channelId || !content)
      return res.status(400).json({ message: "Bad request" });
    const message = await prisma.channelMessage.create({
      data: { channelId, senderId: req.user.id, content },
      include: { sender: { select: { fullName: true, image: true } } },
    });
    await notifyChannelMembers(
      channelId,
      "channel:message",
      req.user.id,
      message
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { channelId, cursor } = req.query;
    if (!channelId) return res.status(400).json({ message: "Bad request" });
    const messages = await prisma.channelMessage.findMany({
      where: { channelId },
      select: {
        id: true,
        senderId: true,
        content: true,
        updatedAt: true,
        sender: { select: { fullName: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Bad request" });

    const message = await prisma.channelMessage.findFirst({ where: { id } });
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updatedMessage = await prisma.channelMessage.update({
      where: { id },
      data: { content },
    });

    const channelId = updatedMessage.channelId;
    await notifyChannelMembers(
      channelId,
      "channel:message:update",
      req.user.id,
      channelId
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.channelMessage.findFirst({
      where: { id },
      include: { channel: true },
    });
    if (!message) return res.status(404).json({ message: "Message not found" });

    const channelId = message.channelId;
    const membership = await prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId: req.user.id,
        },
      },
    });
    const isAdmin = membership?.isAdmin || false;
    if (message.senderId !== req.user.id && !isAdmin)
      return res.status(403).json({ message: "Unauthorized" });

    await prisma.channelMessage.delete({ where: { id } });
    await notifyChannelMembers(
      channelId,
      "channel:message:update",
      req.user.id,
      channelId
    );
    res.status(200).json({ message: "Message was deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendMessage, getMessages, editMessage, deleteMessage };
