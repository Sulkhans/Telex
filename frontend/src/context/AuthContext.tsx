import { createContext, ReactNode, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, login as apiLogin, logout as apiLogout } from "../api/auth";
import { ErrorType, LoginData, User } from "../types/types";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  isError: boolean;
  error: ErrorType | null;
  login: (credentials: LoginData) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isInitialLoading: false,
  isError: false,
  error: null,
  login: async () => ({} as User),
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ErrorType | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: isInitialLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginData) => {
      setError(null);
      return apiLogin(credentials);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      setError(null);
      navigate("/chat");
    },
    onError: (err: ErrorType) => setError(err),
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
  });

  const login = async (credentials: LoginData) =>
    await loginMutation.mutateAsync(credentials);

  const logout = async () => await logoutMutation.mutateAsync();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: loginMutation.isPending,
        isInitialLoading,
        isError,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
