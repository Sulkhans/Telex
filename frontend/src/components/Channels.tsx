import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "../context/ChatContext";
import { getChannelsList } from "../api/channels";
import Skeleton from "./ui/Skeleton";
import Plus from "../assets/plus.svg?react";
import Hash from "../assets/hash.svg?react";
import ChannelModal from "./ChannelModal";

const Channels = () => {
  const { id } = useParams();
  const { setSelected } = useChat();

  const [showModal, setShowModal] = useState(false);

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
    <>
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
                <div className="size-12 bg-secondary/20 rounded-full content-center">
                  <Hash className="mx-auto stroke-primary dark:stroke-foreground" />
                </div>
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
      <button
        onClick={() => setShowModal(true)}
        className="flex justify-center items-center rounded-lg text-foreground text-sm font-semibold bg-indigo-600 dark:bg-purple-900 transition-all select-none"
      >
        <Plus className="size-5 mr-1 fill-foreground" />
        Create new channel
      </button>
      <ChannelModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Channels;
