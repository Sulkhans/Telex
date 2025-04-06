import prisma from "../db/prisma.js";
import crypto from "crypto";

const createChannel = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.length < 3)
      return res.status(400).json({ message: "Channel name is too short" });
    const channel = await prisma.channel.create({
      data: { name, createdById: req.user.id },
    });
    await prisma.channelMember.create({
      data: { channelId: channel.id, userId: req.user.id, isAdmin: true },
    });
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChannels = async (req, res) => {
  try {
    const memberships = await prisma.channelMember.findMany({
      where: { userId: req.user.id },
      include: {
        channel: {
          select: {
            id: true,
            name: true,
            messages: {
              orderBy: { createdAt: "asc" },
              take: 1,
              select: { createdAt: true },
            },
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });
    const channels = memberships
      .map((each) => ({
        id: each.channel.id,
        name: each.channel.name,
        memberCount: each.channel._count.members,
        isAdmin: each.isAdmin,
        lastMessageTime:
          each.channel.messages[0]?.createdAt || each.channel.createdAt,
      }))
      .sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    res.status(200).json({ channels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const channel = await prisma.channel.findFirst({ where: { id } });
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.createdById !== req.user.id)
      return res.status(403).json({ message: "Must be channel creator" });
    if (!name || name.length < 3)
      return res.status(400).json({ message: "Channel name is too short" });

    const updated = await prisma.channel.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await prisma.channel.findFirst({ where: { id } });
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.createdById !== req.user.id)
      return res.status(403).json({ message: "Must be channel creator" });

    await prisma.channelMessage.deleteMany({ where: { channelId: id } });
    await prisma.channelMember.deleteMany({ where: { channelId: id } });
    await prisma.channel.delete({ where: { id } });
    res.status(200).json({ message: "Channel was deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await prisma.channelMember.findFirst({
      where: { channelId: id, userId: req.user.id },
    });
    if (!membership)
      return res.status(403).json({ message: "Not a channel member" });
    const invite = await prisma.channelInvite.create({
      data: {
        token: crypto.randomBytes(16).toString("hex"),
        channelId: id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    res.status(201).json({
      invite: `${process.env.CORS_ORIGIN}/invite/${invite.token}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinChannel = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await prisma.channelInvite.findUnique({ where: { token } });
    if (!invite)
      return res.status(404).json({ message: "Invalid invite link" });
    if (invite.expiresAt < new Date())
      return res.status(400).json({ message: "Invite has expired" });

    const alreadyMember = await prisma.channelMember.findFirst({
      where: {
        channelId: invite.channelId,
        userId: req.user.id,
      },
    });
    if (alreadyMember)
      return res.status(400).json({ message: "Already a member" });

    await prisma.channelMember.create({
      data: {
        channelId: invite.channelId,
        userId: req.user.id,
      },
    });
    res.status(200).json({ channelId: invite.channelId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const leaveChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await prisma.channelMember.findFirst({
      where: { channelId: id, userId: req.user.id },
    });
    if (!membership)
      return res.status(404).json({ message: "Not a channel member" });

    await prisma.channelMember.delete({
      where: { id: membership.id },
    });
    res.status(200).json({ message: "Left channel successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const requester = await prisma.channelMember.findFirst({
      where: { channelId: id, userId: req.user.id },
    });
    if (!requester || !requester.isAdmin)
      return res.status(400).json({ message: "Bad request" });

    const member = await prisma.channelMember.findFirst({
      where: { channelId: id, userId: memberId },
    });
    if (!member) return res.status(404).json({ message: "Member not found" });

    const updated = await prisma.channelMember.update({
      where: { id: member.id },
      data: { isAdmin: !member.isAdmin },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const requester = await prisma.channelMember.findFirst({
      where: { channelId: id, userId: req.user.id },
    });
    if (!requester || !requester.isAdmin)
      return res.status(400).json({ message: "Bad request" });

    const member = await prisma.channelMember.findFirst({
      where: { channelId: id, userId: memberId },
    });
    if (!member) return res.status(404).json({ message: "Member not found" });

    await prisma.channelMember.delete({ where: { id: member.id } });
    res.status(200).json({ message: "Member was removed from the channel" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createChannel,
  getChannels,
  updateChannel,
  deleteChannel,
  generateInvite,
  joinChannel,
  leaveChannel,
  updateMember,
  removeMember,
};
