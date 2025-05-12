import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "../context/ChatContext";
import { getFriendRequests, getFriendsList } from "../api/friends";
import { markAsRead } from "../api/messages";
import { Friend } from "../types/types";
import Skeleton from "./ui/Skeleton";
import UserIcon from "./ui/UserIcon";
import Users from "../assets/users.svg?react";
import FriendsModal from "./FriendsModal";

const Friends = () => {
  const { id } = useParams();
  const { setSelected } = useChat();

  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["friend"],
    queryFn: getFriendsList,
    refetchOnWindowFocus: false,
  });

  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: getFriendRequests,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (id) {
      const target = data?.friends.find((user) => user.friendshipId === id);
      if (target) {
        setSelected({ type: "friend", data: target });
        if (target.unreadMessageCount !== 0) {
          queryClient.setQueryData(
            ["friend"],
            (prev: { friends: Friend[] }) => {
              if (!prev) return prev;
              const updatedFriends = [...prev.friends];
              const index = updatedFriends.findIndex(
                (friend) => friend.id === target.id
              );
              if (index !== -1) {
                updatedFriends[index] = {
                  ...updatedFriends[index],
                  unreadMessageCount: 0,
                };
              }
              return { friends: updatedFriends };
            }
          );
          markAsRead(target.friendshipId);
        }
      }
    }
  }, [id, data, setSelected]);

  return (
    <>
      <div className="overflow-y-auto scroll-hide space-y-1">
        {data
          ? data.friends.map((user) => (
              <Link
                key={user.friendshipId}
                to={"/chat/" + user.friendshipId}
                className={`${
                  user.friendshipId === id &&
                  "bg-dark-background/5 dark:bg-light-background/5"
                } h-fit p-2 flex items-center gap-4 select-none relative rounded-lg hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-all cursor-pointer`}
              >
                <UserIcon image={user.image} status={user.status} />
                <div className="text-sm *:leading-4.5 max-w-30 text-nowrap *:overflow-ellipsis *:overflow-hidden">
                  <h1 className="font-semibold">{user.fullName}</h1>
                  <p className="font-medium text-secondary">{user.username}</p>
                </div>
                {user.unreadMessageCount > 0 && (
                  <span className="w-9 py-0.25 ml-auto rounded-full bg-green-600 dark:bg-green-700 text-center text-sm font-medium text-foreground overflow-hidden">
                    {user.unreadMessageCount}
                  </span>
                )}
              </Link>
            ))
          : isLoading && <Skeleton quantity={6} />}
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="flex justify-center items-center rounded-lg text-foreground text-sm font-semibold bg-indigo-600 dark:bg-purple-900 transition-all select-none"
      >
        <Users className="size-4 mr-2 fill-foreground" />
        <span>Friend requests</span>
        {requests?.requests && (
          <span className="before:content-['•'] before:mx-2">
            {requests.requests.length}
          </span>
        )}
      </button>
      {requests && (
        <FriendsModal
          requests={requests.requests}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Friends;
