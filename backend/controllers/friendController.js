import prisma from "../db/prisma.js";

const sendFriendRequest = async (req, res) => {
  try {
    const receiver = await prisma.user.findUnique({
      where: { username: req.body.username },
    });
    if (!receiver || receiver.id === req.user.id)
      return res.status(404).json({ message: "User was not found" });

    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: receiver.id },
          { senderId: receiver.id, receiverId: req.user.id },
        ],
      },
    });
    if (existingFriendship)
      return res
        .status(400)
        .json({ message: "You are already friends or the request is pending" });

    await prisma.friendship.create({
      data: { senderId: req.user.id, receiverId: receiver.id },
    });
    res.status(200).json({ message: "Friend request was sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const requests = await prisma.friendship.findMany({
      where: { receiverId: req.user.id, status: false },
      select: {
        createdAt: true,
        sender: {
          select: { id: true, fullName: true, username: true, image: true },
        },
      },
    });
    if (requests.length === 0)
      return res.status(200).json({ message: "No new friend requests" });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFriendsList = async (req, res) => {
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: req.user.id, status: true },
          { receiverId: req.user.id, status: true },
        ],
      },
      include: {
        sender: {
          select: { id: true, fullName: true, username: true, image: true },
        },
        receiver: {
          select: { id: true, fullName: true, username: true, image: true },
        },
      },
    });
    const friends = friendships.map((friendship) =>
      friendship.senderId === req.user.id
        ? friendship.receiver
        : friendship.sender
    );
    res.status(200).json({ friends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await prisma.friendship.findUnique({ where: { id } });
    if (!friendship || friendship.receiverId !== req.user.id)
      return res.status(404).json({ message: "Friend request is invalid" });
    await prisma.friendship.update({ where: { id }, data: { status: true } });
    res.status(200).json({ message: "Friend request was accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const friendship = await prisma.friendship.findUnique({ where: { id } });
    if (
      !friendship ||
      (user.id !== friendship.receiverId && user.id !== friendship.senderId)
    )
      return res.status(404).json({ message: "Friend request was not found" });

    await prisma.friendship.delete({ where: { id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  sendFriendRequest,
  getFriendRequests,
  getFriendsList,
  acceptFriendRequest,
  deleteFriend,
};
