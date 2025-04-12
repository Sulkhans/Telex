import axios from "axios";
import { Message } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api/message",
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
  friendshipId,
  cursor,
}: {
  friendshipId: string;
  cursor: string | undefined;
}): Promise<{ messages: Message[] }> => {
  const res = await api.get("/", { params: { friendshipId, cursor } });
  return res.data;
};

export const sendMessage = async ({
  friendshipId,
  content,
}: {
  friendshipId: string;
  content: string;
}): Promise<Message> => {
  const res = await api.post("/", { friendshipId, content });
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
