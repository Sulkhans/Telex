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
