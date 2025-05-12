import axios from "axios";
import { ChannelMessage } from "../types/types";

const api = axios.create({
  baseURL: "/api/channel-message",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const message =
        error.response.data.message || "An error occurred with the API";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error("An unexpected error occurred"));
  }
);

export const getMessages = async ({
  channelId,
  cursor,
}: {
  channelId: string;
  cursor: string | undefined;
}): Promise<{ messages: ChannelMessage[] }> => {
  const res = await api.get("/", { params: { channelId, cursor } });
  return res.data;
};

export const sendMessage = async ({
  channelId,
  content,
}: {
  channelId: string;
  content: string;
}): Promise<ChannelMessage> => {
  const res = await api.post("/", { channelId, content });
  return res.data;
};

export const editMessage = async ({
  id,
  content,
}: {
  id: string;
  content: string;
}) => {
  const res = await api.put(`/${id}`, { content });
  return res.data;
};

export const deleteMessage = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
