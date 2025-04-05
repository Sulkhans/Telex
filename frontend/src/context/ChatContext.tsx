import { createContext, ReactNode, useContext, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Friend, Message } from "../types/types";
import { getMessages, sendMessage as apiSendMessage } from "../api/messages";
import { useAuth } from "./AuthContext";

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
  sendMessage: (content: string) => void;
  isSending: boolean;
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
  sendMessage: () => {},
  isSending: false,
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<Selected | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

  const sendMessageMutation = useMutation({
    mutationFn: ({
      friendshipId,
      content,
    }: {
      friendshipId: string;
      content: string;
    }) => apiSendMessage({ friendshipId, content }),

    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", "friend", selected!.data.friendshipId],
      });
      const previousMessages = queryClient.getQueryData([
        "messages",
        "friend",
        selected!.data.friendshipId,
      ]);
      const optimisticMessage: Message = {
        id: "temp" + Date.now(),
        content,
        senderId: user!.id,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      queryClient.setQueryData(
        ["messages", "friend", selected!.data.friendshipId],
        (prev: any) => {
          const newPages = [...prev.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [optimisticMessage, ...newPages[0].messages],
          };
          return { ...prev, pages: newPages };
        }
      );
      return { previousMessages };
    },
    onError: (_err, _newMessage, context) => {
      queryClient.setQueryData(
        ["messages", "friend", selected!.data.friendshipId],
        context?.previousMessages
      );
    },
    onSuccess: (_res) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "friend", selected!.data.friendshipId],
      });
    },
  });

  const sendMessage = (content: string) => {
    sendMessageMutation.mutate({
      friendshipId: selected!.data.friendshipId,
      content: content.trim(),
    });
  };

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
        sendMessage,
        isSending: sendMessageMutation.isPending,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
