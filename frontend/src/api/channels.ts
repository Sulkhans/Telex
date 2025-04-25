import axios from "axios";
import { Channel } from "../types/types";

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
