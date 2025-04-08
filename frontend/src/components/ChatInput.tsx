import { useState } from "react";
import { useChat } from "../context/ChatContext";
import Send from "../assets/send.svg?react";

const ChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const { sendMessage } = useChat();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center gap-2.5 px-4 py-3"
    >
      <textarea
        value={message}
        placeholder="Aa"
        onKeyDown={handleKeyDown}
        onChange={handleTextAreaChange}
        className="w-full max-h-33 px-3 py-1.5 rounded-[18px] bg-dark-background/3 dark:bg-light-background/5 placeholder:text-secondary resize-none field-sizing-content break-all outline-none"
      />
      <button className="min-w-9 flex-shrink-0">
        <Send className="mx-auto size-5.5 stroke-primary dark:stroke-foreground" />
      </button>
    </form>
  );
};

export default ChatInput;
