import { createContext, ReactNode, useContext, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Friend, Message } from "../types/types";
import { getMessages } from "../api/messages";

type Selected = { type: "friend"; data: Friend } | null;

type ChatContextType = {
  selected: Selected | null;
  setSelected: React.Dispatch<React.SetStateAction<Selected | null>>;
  messages: Message[] | null;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};

const ChatContext = createContext<ChatContextType>({
  selected: null,
  setSelected: () => {},
  messages: null,
  isLoading: false,
  isError: false,
  fetchNextPage: () => {},
  hasNextPage: false,
  isFetchingNextPage: false,
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<Selected | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: selected
      ? ["messages", "friend", selected.data.friendshipId]
      : ["messages", "none"],
    queryFn: ({ pageParam }) => {
      if (!selected) return Promise.resolve({ messages: [] });
      return getMessages({
        friendshipId: selected.data.friendshipId,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (data) => {
      if (!data || data.messages.length < 15) return undefined;
      return data.messages[data.messages.length - 1].id;
    },
    enabled: !!selected,
    staleTime: 60000,
  });

  const messages = data?.pages.flatMap((page) => page.messages) || [];

  return (
    <ChatContext.Provider
      value={{
        selected,
        setSelected,
        messages,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
