import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import { markAsRead } from "../api/messages";
import { ChannelMessage, Friend, Message, Status } from "../types/types";
import notification from "../assets/sounds/notification.mp3";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const useSocketEvents = () => {
  const { socket } = useSocket();
  const { selected } = useChat();
  const debounceRef = useRef<any>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    debounceRef.current = debounce((friendshipId: string) => {
      markAsRead(friendshipId);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleStatus = ({
      userId,
      status,
    }: {
      userId: string;
      status: Status;
    }) => {
      queryClient.setQueryData(["friend"], (prev: { friends: Friend[] }) => {
        if (!prev) return prev;

        const index = prev.friends.findIndex((friend) => friend.id === userId);
        if (index === -1) return prev;

        const updatedFriends = [...prev.friends];
        updatedFriends[index] = {
          ...updatedFriends[index],
          status,
        };
        return { friends: updatedFriends };
      });
    };

    const handleNotification = (message: Message) => {
      const isSelected =
        selected?.type === "friend" &&
        selected.data.friendshipId === message.friendshipId;
      if (isSelected) {
        message.read = true;
        if (debounceRef.current) {
          debounceRef.current(selected.data.friendshipId);
        }
      } else {
        queryClient.setQueryData(["friend"], (prev: { friends: Friend[] }) => {
          if (!prev) return prev;
          const index = prev.friends.findIndex(
            (friend) => friend.id === message.senderId
          );
          if (index === -1) return prev;

          const updatedFriend = {
            ...prev.friends[index],
            unreadMessageCount: prev.friends[index].unreadMessageCount + 1,
          };
          const updatedFriends = [...prev.friends];
          updatedFriends.splice(index, 1);
          updatedFriends.unshift(updatedFriend);

          return { friends: updatedFriends };
        });
      }

      queryClient.setQueryData(
        ["messages", "friend", message.friendshipId],
        (prev: any) => {
          if (!prev) return prev;
          const newPages = [...prev.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [message, ...newPages[0].messages],
          };
          return { ...prev, pages: newPages };
        }
      );
      const sound = new Audio(notification);
      sound.play();
    };

    const handleMessageRead = (friendshipId: string) => {
      queryClient.setQueryData(
        ["messages", "friend", friendshipId],
        (prev: any) => {
          if (!prev) return prev;
          const newPages = prev.pages.map((page: any) => {
            const updatedMessages = page.messages.map((message: Message) => {
              return { ...message, read: true };
            });
            return { ...page, messages: updatedMessages };
          });
          return { ...prev, pages: newPages };
        }
      );
    };

    const handleMessageUpdate = (friendshipId: string) => {
      queryClient.refetchQueries({
        queryKey: ["messages", "friend", friendshipId],
      });
    };

    const handleFriendRequest = () => {
      queryClient.refetchQueries({ queryKey: ["requests"] });
    };

    const handleFriend = () => {
      queryClient.refetchQueries({ queryKey: ["friend"] });
    };

    const handleChannelUpdate = () => {
      queryClient.refetchQueries({ queryKey: ["channel"] });
    };

    const handleChannelMemberUpdate = ({
      channelId,
    }: {
      channelId: string;
    }) => {
      queryClient.refetchQueries({ queryKey: ["channel"] });
      queryClient.refetchQueries({ queryKey: ["members", channelId] });
    };

    const handleChannelMessage = (message: ChannelMessage) => {
      queryClient.setQueryData(
        ["messages", "channel", message.channelId],
        (prev: any) => {
          if (!prev) return prev;
          const newPages = [...prev.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [message, ...newPages[0].messages],
          };
          return { ...prev, pages: newPages };
        }
      );
    };

    const handleChannelMessageUpdate = (channelId: string) => {
      queryClient.refetchQueries({
        queryKey: ["messages", "channel", channelId],
      });
    };

    socket.on("user:status", handleStatus);
    socket.on("friend:message", handleNotification);
    socket.on("friend:message:read", handleMessageRead);
    socket.on("friend:message:update", handleMessageUpdate);
    socket.on("friend:request", handleFriendRequest);
    socket.on("friend:request:respond", handleFriend);
    socket.on("channel:update", handleChannelUpdate);
    socket.on("channel:member:update", handleChannelMemberUpdate);
    socket.on("channel:message", handleChannelMessage);
    socket.on("channel:message:update", handleChannelMessageUpdate);

    return () => {
      socket.off("user:status", handleStatus);
      socket.off("friend:message", handleNotification);
      socket.off("friend:message:read", handleMessageRead);
      socket.off("friend:message:update", handleMessageUpdate);
      socket.off("friend:request", handleFriendRequest);
      socket.off("friend:request:respond", handleFriend);
      socket.off("channel:update", handleChannelUpdate);
      socket.off("channel:member:update", handleChannelMemberUpdate);
      socket.off("channel:message", handleChannelMessage);
      socket.on("channel:message:update", handleChannelMessageUpdate);
    };
  }, [socket, selected, queryClient]);
};
