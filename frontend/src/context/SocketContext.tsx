import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

const socketURL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && !socket) {
      const socket = io(socketURL, {
        withCredentials: true,
        query: { userId: user.id, status: user.status },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      socket.on("connection", () => setIsConnected(true));
      setSocket(socket);
    }
    if (!user && socket) setSocket(null);
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
