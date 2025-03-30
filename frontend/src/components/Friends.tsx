import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getFriendsList } from "../api/friends";
import UserIcon from "./UserIcon";
import Skeleton from "./Skeleton";
import { useChat } from "../context/ChatContext";
import { useEffect } from "react";

const Friends = () => {
  const { id } = useParams();
  const { setSelected } = useChat();

  const { data, isLoading } = useQuery({
    queryKey: ["friend"],
    queryFn: getFriendsList,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (id) {
      const target = data?.friends.find((user) => user.friendshipId === id);
      if (target) setSelected({ type: "friend", data: target });
    }
  }, [id, data, setSelected]);

  return (
    <div className="overflow-y-auto space-y-1">
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
  );
};

export default Friends;
