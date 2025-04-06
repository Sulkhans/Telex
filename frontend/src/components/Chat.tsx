import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useChat } from "../context/ChatContext";

const Chat = () => {
  const { selected } = useChat();
  if (!selected) return null;
  return (
    <div className="w-full flex flex-col rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-colors">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default Chat;
