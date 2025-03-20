import { createContext, ReactNode, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, login as apiLogin, logout as apiLogout } from "../api/auth";
import { ErrorType, LoginData, User } from "../types/types";

const getCookie = (name: string) =>
  document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${name}=`));

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  error: ErrorType | null;
  login: (credentials: LoginData) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isError: false,
  error: null,
  login: async () => ({} as User),
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ErrorType | null>(null);

  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: getCookie("jwt"),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginData) => apiLogin(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      setError(null);
    },
    onError: (err: ErrorType) => setError(err),
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleLogin = async (credentials: LoginData) =>
    await loginMutation.mutateAsync(credentials);

  const handleLogout = async () => await logoutMutation.mutateAsync();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isError,
        error,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
