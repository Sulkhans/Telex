import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Skeleton from "./Skeleton";
import { useChat } from "../context/ChatContext";
import { useEffect } from "react";
import { getChannelsList } from "../api/channels";

const Channels = () => {
  const { id } = useParams();
  const { setSelected } = useChat();

  const { data, isLoading } = useQuery({
    queryKey: ["channel"],
    queryFn: getChannelsList,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (id) {
      const target = data?.channels.find((channel) => channel.id === id);
      if (target) setSelected({ type: "channel", data: target });
    }
  }, [id, data, setSelected]);

  return (
    <div className="overflow-y-auto space-y-1">
      {data
        ? data.channels.map((channel) => (
            <Link
              key={channel.id}
              to={"/channel/" + channel.id}
              className={`${
                channel.id === id &&
                "bg-dark-background/5 dark:bg-light-background/5"
              } h-fit p-2 flex items-center gap-4 select-none relative rounded-lg hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-all cursor-pointer`}
            >
              <div className="size-12 bg-secondary/20 rounded-full" />
              <div className="text-sm *:leading-4.5 max-w-30 text-nowrap *:overflow-ellipsis *:overflow-hidden">
                <h1 className="font-semibold">{channel.name}</h1>
                <p className="font-medium text-xs text-secondary">
                  {channel.memberCount} Members
                </p>
              </div>
            </Link>
          ))
        : isLoading && <Skeleton quantity={6} />}
    </div>
  );
};

export default Channels;
