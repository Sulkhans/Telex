import { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import ChatSkeleton from "./ChatSkeleton";
import UserIcon from "./UserIcon";
import ChatInput from "./ChatInput";
import Options from "../assets/options.svg?react";

const Chat = () => {
  const {
    selected,
    isLoading,
    messages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useChat();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage || !ref.current) return;

    const element = ref.current;
    const handleScroll = () => {
      const { scrollHeight, clientHeight, scrollTop } = element;
      if (Math.abs(scrollTop) > scrollHeight - clientHeight - 20)
        fetchNextPage();
    };
    if (element.scrollHeight <= element.clientHeight && hasNextPage)
      fetchNextPage();

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, messages]);

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
        <main
          ref={ref}
          className="h-full relative flex flex-col-reverse px-4 pt-4 content-end overflow-y-auto text-center border-y border-light-border dark:border-dark-border transition-colors"
        >
          {isLoading ? (
            <ChatSkeleton />
          ) : messages && messages.length > 0 ? (
            messages.map((message, i) => (
              <div
                key={message.id}
                className={
                  i > 0 && messages[i - 1].senderId === message.senderId
                    ? "mb-0.5"
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
                    } px-3 py-2 text-[15px] rounded-[1.25rem] min-w-9 max-w-2xs min-[880px]:max-w-sm xl:max-w-2xl break-words`}
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
        <ChatInput />
      </div>
    )
  );
};

export default Chat;
