import axios from "axios";
import { Channel, ChannelMember } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api/channel",
  withCredentials: true,
});

export const getChannelsList = async (): Promise<{ channels: Channel[] }> => {
  const res = await api.get("/");
  return res.data;
};

export const createChannel = async (name: string): Promise<Channel> => {
  const res = await api.post("/", { name });
  return res.data;
};

export const updateChannel = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<Channel> => {
  const res = await api.put(`/${id}`, { name });
  return res.data;
};

export const leaveChannel = async (id: string) => {
  const res = await api.delete(`/${id}/leave`);
  return res.data;
};

export const deleteChannel = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};

export const generateInvite = async (
  id: string
): Promise<{ invite: string }> => {
  const res = await api.post(`/${id}/invite`);
  return res.data;
};

export const joinChannel = async (
  token: string
): Promise<{ channelId: string }> => {
  const res = await api.post(`/join/${token}`);
  return res.data;
};

export const getMembers = async (
  id: string
): Promise<{ members: ChannelMember[] }> => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const updateMember = async ({
  channelId,
  memberId,
}: {
  channelId: string;
  memberId: string;
}) => {
  const res = await api.put(`/${channelId}/admin`, { memberId });
  return res.data;
};

export const removeMember = async ({
  channelId,
  memberId,
}: {
  channelId: string;
  memberId: string;
}): Promise<Channel> => {
  const res = await api.delete(`/${channelId}/admin/${memberId}`);
  return res.data;
};
