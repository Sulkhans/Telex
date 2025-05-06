import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { ChannelMessage, Message } from "../types/types";
import ChatSkeleton from "./ChatSkeleton";
import UserIcon from "./UserIcon";
import MessageOptions from "./MessageOptions";

const ChatMessages = () => {
  const {
    selected,
    isLoading,
    messages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSending,
  } = useChat();
  const { user } = useAuth();

  const ref = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(-1);

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

  const getMessageStatus = () => {
    if (isSending) return "Sending";
    if (!messages?.length) return null;
    if (!isFriend || messages[0].senderId !== user!.id) return null;
    return (messages[0] as Message).read ? "Seen" : "Sent";
  };

  const getCornerStyle = (
    isOwnMessage: boolean,
    isSameSender: boolean,
    isNextSameSender: boolean
  ) => {
    if (isOwnMessage) {
      if (!isSameSender && !isNextSameSender) return "rounded-[1.25rem]";
      if (!isSameSender)
        return "rounded-b-[1.25rem] rounded-tl-[1.25rem] rounded-tr-md";
      if (!isNextSameSender)
        return "rounded-t-[1.25rem] rounded-bl-[1.25rem] rounded-br-md";
      return "rounded-l-[1.25rem] rounded-r-md";
    } else {
      if (!isSameSender && !isNextSameSender) return "rounded-[1.25rem]";
      if (!isSameSender)
        return "rounded-b-[1.25rem] rounded-tr-[1.25rem] rounded-tl-md";
      if (!isNextSameSender)
        return "rounded-t-[1.25rem] rounded-br-[1.25rem] rounded-bl-md";
      return "rounded-r-[1.25rem] rounded-l-md";
    }
  };

  if (!selected) return null;
  const isFriend = selected.type === "friend";

  return (
    <main
      ref={ref}
      className="h-full relative flex flex-col-reverse px-4 pt-4 content-end border-y border-light-border dark:border-dark-border overflow-y-scroll scroll transition-colors"
    >
      {isLoading ? (
        <ChatSkeleton />
      ) : messages?.length ? (
        <>
          <span className="ml-auto mr-2 mb-2 -mt-3 text-xs text-secondary/75 font-medium">
            {getMessageStatus()}
          </span>
          {messages.map((message, i) => {
            const isOwnMessage = message.senderId === user!.id;
            const isSameSender =
              i > 0 && messages[i - 1].senderId === message.senderId;
            const isNextSameSender =
              i < messages.length - 1 &&
              messages[i + 1].senderId === message.senderId;
            const showUserIcon = !isOwnMessage && (i === 0 || !isSameSender);
            const corner = getCornerStyle(
              isOwnMessage,
              isSameSender,
              isNextSameSender
            );
            return (
              <div
                key={message.id}
                className={isSameSender ? "mb-0.5" : "mb-4"}
              >
                <div className="flex items-end group">
                  {showUserIcon ? (
                    <UserIcon
                      compact
                      image={
                        isFriend
                          ? selected.data.image
                          : (message as ChannelMessage).sender.image
                      }
                    />
                  ) : (
                    !isOwnMessage && <div className="w-10 h-10 flex-shrink-0" />
                  )}
                  <div
                    onMouseLeave={() => setShowMore(-1)}
                    className={`${
                      isOwnMessage ? "ml-auto" : "ml-4"
                    } flex items-center gap-2`}
                  >
                    {isOwnMessage && (
                      <MessageOptions
                        index={i}
                        activeMessage={showMore}
                        setActiveMessage={setShowMore}
                        editable
                      />
                    )}
                    <div
                      className={`${
                        isOwnMessage
                          ? "bg-indigo-600 dark:bg-purple-900 text-foreground"
                          : "bg-light-background dark:bg-dark-background border border-transparent dark:border-dark-border"
                      } ${corner} px-3 py-2 text-[15px] min-w-9 max-w-2xs min-[880px]:max-w-sm xl:max-w-2xl break-words`}
                    >
                      {message.content}
                    </div>
                    {!isFriend && selected.data.isAdmin && !isOwnMessage && (
                      <MessageOptions
                        index={i}
                        activeMessage={showMore}
                        setActiveMessage={setShowMore}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-secondary/75 font-medium">
          No messages yet
        </span>
      )}
    </main>
  );
};

export default ChatMessages;
