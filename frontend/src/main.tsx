import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { SocketProvider } from "./context/SocketContext";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
