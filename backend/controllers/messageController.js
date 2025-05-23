import prisma from "../db/prisma.js";
import { notifyUser } from "../utils/notifyUser.js";

const sendMessage = async (req, res) => {
  try {
    const { friendshipId, content } = req.body;
    if (!friendshipId || !content)
      return res.status(400).json({ message: "Bad request" });

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!friendship) return res.status(404).json({ message: "Not friends" });

    const message = await prisma.directMessage.create({
      data: { content, friendshipId, senderId: req.user.id },
    });

    const receiverId =
      friendship.senderId === req.user.id
        ? friendship.receiverId
        : friendship.senderId;
    notifyUser(receiverId, "friend:message", message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { friendshipId, cursor } = req.query;
    if (!friendshipId) return res.status(400).json({ message: "Bad request" });
    const messages = await prisma.directMessage.findMany({
      where: { friendshipId },
      orderBy: { createdAt: "desc" },
      take: 15,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    });

    await prisma.directMessage.updateMany({
      where: {
        friendshipId,
        senderId: { not: req.user.id },
        read: false,
      },
      data: {
        read: true,
      },
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { friendshipId } = req.body;
    if (!friendshipId) return res.status(400).json({ message: "Bad request" });

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });
    if (!friendship) return res.status(404).json({ message: "Not friends" });

    await prisma.directMessage.updateMany({
      where: {
        friendshipId,
        senderId: { not: req.user.id },
        read: false,
      },
      data: {
        read: true,
      },
    });

    const receiverId =
      friendship.senderId === req.user.id
        ? friendship.receiverId
        : friendship.senderId;
    notifyUser(receiverId, "friend:message:read", friendshipId);
    res.status(200).json({ message: "Messages were marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Bad request" });

    const message = await prisma.directMessage.findFirst({ where: { id } });
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updatedMessage = await prisma.directMessage.update({
      where: { id },
      data: { content },
    });

    const friendshipId = message.friendshipId;
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    const receiverId =
      friendship.senderId === req.user.id
        ? friendship.receiverId
        : friendship.senderId;
    notifyUser(receiverId, "friend:message:update", friendshipId);
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.directMessage.findFirst({ where: { id } });
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await prisma.directMessage.delete({ where: { id } });

    const friendshipId = message.friendshipId;
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    const receiverId =
      friendship.senderId === req.user.id
        ? friendship.receiverId
        : friendship.senderId;
    notifyUser(receiverId, "friend:message:update", friendshipId);
    res.status(200).json({ message: "Message was deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendMessage, getMessages, markAsRead, editMessage, deleteMessage };
