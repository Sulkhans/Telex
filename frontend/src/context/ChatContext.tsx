import { createContext, ReactNode, useContext, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Channel, ChannelMessage, Friend, Message } from "../types/types";
import {
  getMessages,
  sendMessage as apiSendMessage,
  editMessage as apiEditMessage,
  deleteMessage as apiDeleteMessage,
} from "../api/messages";
import {
  getMessages as getChannelMessages,
  sendMessage as apiSendChannelMesssage,
  editMessage as apiEditChannelMessage,
  deleteMessage as apiDeleteChannelMessage,
} from "../api/channelMessages";
import { useAuth } from "./AuthContext";

type Selected =
  | { type: "friend"; data: Friend }
  | { type: "channel"; data: Channel }
  | null;

type QueryResult = { messages: Message[] } | { messages: ChannelMessage[] };

type messageToEdit = {
  id: string;
  content: string;
};

type ChatContextType = {
  selected: Selected | null;
  setSelected: React.Dispatch<React.SetStateAction<Selected | null>>;
  showDetails: boolean;
  toggleDetails: () => void;
  messages: Message[] | ChannelMessage[] | null;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  sendMessage: (content: string) => void;
  isSending: boolean;
  messageToEdit: messageToEdit | null;
  setMessageToEdit: React.Dispatch<React.SetStateAction<messageToEdit | null>>;
  editMessage: (id: string, content: string) => void;
  deleteMessage: (id: string) => void;
};

const ChatContext = createContext<ChatContextType>({
  selected: null,
  setSelected: () => {},
  showDetails: true,
  toggleDetails: () => {},
  messages: null,
  isLoading: false,
  isError: false,
  fetchNextPage: () => {},
  hasNextPage: false,
  isFetchingNextPage: false,
  sendMessage: () => {},
  isSending: false,
  messageToEdit: null,
  setMessageToEdit: () => {},
  editMessage: () => {},
  deleteMessage: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<Selected | null>(null);
  const [messageToEdit, setMessageToEdit] = useState<messageToEdit | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(true);
  const toggleDetails = () => setShowDetails(!showDetails);

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
      ? selected.type === "friend"
        ? ["messages", "friend", selected.data.friendshipId]
        : ["messages", "channel", selected.data!.id]
      : ["messages", "none"],
    queryFn: ({ pageParam }): Promise<QueryResult> => {
      if (!selected) return Promise.resolve({ messages: [] });
      if (selected.type === "friend") {
        return getMessages({
          friendshipId: selected.data.friendshipId,
          cursor: pageParam,
        });
      }
      if (selected.type === "channel") {
        return getChannelMessages({
          channelId: selected.data.id,
          cursor: pageParam,
        });
      }
      return Promise.resolve({ messages: [] });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (data) => {
      if (!data || data.messages.length < 15) return undefined;
      return data.messages[data.messages.length - 1].id;
    },
    enabled: !!selected,
    staleTime: 60000,
  });

  let messages: Message[] | ChannelMessage[] = [];
  if (data?.pages) {
    if (selected?.type === "friend") {
      messages = data.pages.flatMap(
        (page) => (page.messages || []) as Message[]
      );
    } else if (selected?.type === "channel") {
      messages = data.pages.flatMap(
        (page) => (page.messages || []) as ChannelMessage[]
      );
    }
  }

  const sendMessageMutation = useMutation({
    mutationFn: ({
      id,
      content,
    }: {
      id: string;
      content: string;
    }): Promise<Message | ChannelMessage> => {
      if (selected?.type === "friend")
        return apiSendMessage({ friendshipId: id, content });
      else return apiSendChannelMesssage({ channelId: id, content });
    },

    onMutate: async ({ id, content }) => {
      if (selected?.type === "friend") {
        await queryClient.cancelQueries({
          queryKey: ["messages", "friend", id],
        });
        const previousMessages = queryClient.getQueryData([
          "messages",
          "friend",
          id,
        ]);
        const optimisticMessage: Message = {
          id: "temp" + Date.now(),
          content,
          senderId: user!.id,
          read: false,
          friendshipId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        queryClient.setQueryData(["messages", "friend", id], (prev: any) => {
          const newPages = [...prev.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [optimisticMessage, ...newPages[0].messages],
          };
          return { ...prev, pages: newPages };
        });
        return { previousMessages, type: "friend", id };
      } else if (selected?.type === "channel") {
        await queryClient.cancelQueries({
          queryKey: ["messages", "channel", id],
        });
        const previousMessages = queryClient.getQueryData([
          "messages",
          "channel",
          id,
        ]);
        const optimisticMessage: ChannelMessage = {
          id: "temp" + Date.now(),
          content,
          senderId: user!.id,
          channelId: id,
          sender: {
            fullName: user!.fullName,
            image: user!.image,
          },
          updatedAt: new Date(),
        };
        queryClient.setQueryData(["messages", "channel", id], (prev: any) => {
          const newPages = [...prev.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [optimisticMessage, ...newPages[0].messages],
          };
          return { ...prev, pages: newPages };
        });
        return { previousMessages, type: "channel", id };
      }
    },

    onError: (_err, _newMessage, context) => {
      if (!context) return;
      if (context.type === "friend") {
        queryClient.setQueryData(
          ["messages", "friend", context.id],
          context.previousMessages
        );
      } else if (context.type === "channel") {
        queryClient.setQueryData(
          ["messages", "channel", context.id],
          context.previousMessages
        );
      }
    },

    onSuccess: (res, { id }) => {
      if (selected?.type === "friend") {
        queryClient.setQueryData(["messages", "friend", id], (prev: any) => {
          const newPages = [...prev.pages];
          newPages[0].messages[0] = res;
          return { ...prev, pages: newPages };
        });
      } else if (selected?.type === "channel") {
        queryClient.setQueryData(["messages", "channel", id], (prev: any) => {
          const newPages = [...prev.pages];
          newPages[0].messages[0] = res;
          return { ...prev, pages: newPages };
        });
      }
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => {
      if (selected?.type === "friend") return apiEditMessage({ id, content });
      else return apiEditChannelMessage({ id, content });
    },
    onSuccess: (_res) => {
      if (selected?.type === "friend") {
        queryClient.invalidateQueries({
          queryKey: ["messages", "friend", selected.data.friendshipId],
        });
      } else if (selected?.type === "channel") {
        queryClient.invalidateQueries({
          queryKey: ["messages", "channel", selected.data.id],
        });
      }
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => {
      if (selected?.type === "friend") return apiDeleteMessage(id);
      else return apiDeleteChannelMessage(id);
    },
    onSuccess: (_res) => {
      if (selected?.type === "friend") {
        queryClient.invalidateQueries({
          queryKey: ["messages", "friend", selected.data.friendshipId],
        });
      } else if (selected?.type === "channel") {
        queryClient.invalidateQueries({
          queryKey: ["messages", "channel", selected.data.id],
        });
      }
    },
  });

  const sendMessage = (content: string) => {
    if (!selected) return;
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    if (selected.type === "friend") {
      sendMessageMutation.mutate({
        id: selected.data.friendshipId,
        content: trimmedContent,
      });
    } else if (selected.type === "channel") {
      sendMessageMutation.mutate({
        id: selected.data.id,
        content: trimmedContent,
      });
    }
  };

  const editMessage = (id: string, content: string) => {
    const trimmedContent = content.trim();
    if (!trimmedContent) return;
    editMessageMutation.mutate({
      id: id,
      content: trimmedContent,
    });
  };

  const deleteMessage = (id: string) => {
    deleteMessageMutation.mutate(id);
  };

  return (
    <ChatContext.Provider
      value={{
        selected,
        setSelected,
        showDetails,
        toggleDetails,
        messages,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        sendMessage,
        isSending: sendMessageMutation.isPending,
        messageToEdit,
        setMessageToEdit,
        editMessage,
        deleteMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
