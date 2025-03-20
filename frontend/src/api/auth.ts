import axios from "axios";
import { LoginData, SignupData, User } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:5000/api/user",
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

export const signup = async (data: SignupData) => {
  await api.post("/signup", data);
};

export const verify = async (token: string) => {
  await api.put(`/verify?token=${token}`);
};

export const login = async (credentials: LoginData): Promise<User> => {
  const res = await api.post("/login", credentials);
  return res.data;
};

export const getUser = async (): Promise<User> => {
  const res = await api.get("/");
  return res.data;
};

export const logout = async () => {
  await api.post("/logout");
};
