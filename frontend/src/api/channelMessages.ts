import axios from "axios";
import { ChannelMessage } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api/channel-message",
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

export const getChannelMessages = async ({
  channelId,
  cursor,
}: {
  channelId: string;
  cursor: string | undefined;
}): Promise<{ messages: ChannelMessage[] }> => {
  const res = await api.get("/", { params: { channelId, cursor } });
  return res.data;
};
