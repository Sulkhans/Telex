import axios from "axios";
import { Friend } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api/friend",
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

export const getFriendsList = async (): Promise<{ friends: Friend[] }> => {
  const res = await api.get("/list");
  return res.data;
};
