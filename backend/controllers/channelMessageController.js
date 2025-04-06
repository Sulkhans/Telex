import prisma from "../db/prisma.js";

const sendMessage = async (req, res) => {
  try {
    const { channelId, content } = req.body;
    if (!channelId || !content)
      return res.status(400).json({ message: "Bad request" });
    const message = await prisma.channelMessage.create({
      data: { channelId, senderId: req.user.id, content },
    });
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
      select: { id: true, senderId: true, content: true, updatedAt: true },
    });
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.channelMessage.findFirst({ where: { id } });
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.senderId !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Unauthorized" });

    await prisma.channelMessage.delete({ where: { id } });
    res.status(200).json({ message: "Message was deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendMessage, getMessages, editMessage, deleteMessage };
