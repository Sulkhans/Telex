import { useState } from "react";
import { useChat } from "../context/ChatContext";
import ChatSkeleton from "./ChatSkeleton";
import UserIcon from "./UserIcon";
import Options from "../assets/options.svg?react";
import Send from "../assets/send.svg?react";

const Chat = () => {
  const { selected, isLoading, messages } = useChat();
  const [message, setMessage] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        setMessage("");
      }
    }
  };

  return (
    selected && (
      <div className="w-full flex flex-col rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-colors">
        <header className="flex items-center px-4 py-3 select-none">
          <div className="flex items-center gap-4">
            <UserIcon
              image={selected.data.image}
              status={selected.data.status}
              compact
            />
            <div className="text-sm *:leading-4.5">
              <h1 className="font-semibold">{selected.data.fullName}</h1>
              <p className="font-medium text-secondary">
                {selected.data.username}
              </p>
            </div>
          </div>
          <button
            className={`size-9 ml-auto rotate-90 rounded-full hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors`}
          >
            <Options className="mx-auto size-5 stroke-primary dark:stroke-foreground transition-colors" />
          </button>
        </header>
        <main className="h-full relative flex flex-col-reverse px-4 content-end overflow-y-auto border-y border-light-border dark:border-dark-border transition-colors">
          {isLoading ? (
            <ChatSkeleton />
          ) : messages && messages.length > 0 ? (
            messages.map((message, i) => (
              <div
                key={message.id}
                className={
                  i > 0 && messages[i - 1].senderId === message.senderId
                    ? "mb-1"
                    : "mb-4"
                }
              >
                <div className="flex items-end">
                  {message.senderId === selected.data.id && (
                    <UserIcon image={selected.data.image} compact />
                  )}
                  <div
                    className={`${
                      message.senderId !== selected.data.id
                        ? "ml-auto bg-indigo-600 dark:bg-purple-900 text-foreground"
                        : "ml-4 bg-light-background dark:bg-dark-background border border-transparent dark:border-dark-border"
                    } px-3 py-2 text-[15px] rounded-[1.25rem] max-w-2xs min-[880px]:max-w-sm xl:max-w-2xl break-words`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-secondary/75">
              No messages yet
            </span>
          )}
        </main>
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
      </div>
    )
  );
};

export default Chat;
