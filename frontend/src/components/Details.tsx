import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { getMembers } from "../api/channels";
import { ChannelMember, ModalType } from "../types/types";
import DetailsModals from "./DetailsModals";
import Skeleton from "./Skeleton";
import UserIcon from "./UserIcon";
import Hash from "../assets/hash.svg?react";
import Link from "../assets/link.svg?react";
import Exit from "../assets/exit.svg?react";
import Settings from "../assets/settings.svg?react";

const Details = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeMember, setActiveMember] = useState<ChannelMember | null>(null);

  const { selected } = useChat();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["members", selected?.data.id],
    queryFn: () => getMembers(selected!.data.id),
    refetchOnWindowFocus: false,
  });

  if (!selected || selected.type !== "channel") return null;

  const handleMemberClick = (member: ChannelMember) => {
    if (!selected || selected.type !== "channel") return;
    if (selected.data.isAdmin && member.userId !== user!.id) {
      setActiveMember(member);
      setActiveModal("member");
    }
  };

  return (
    <>
      <aside className="min-w-72 xl:min-w-75 max-w-75 flex flex-col">
        <div className="h-screen rounded-xl flex flex-col border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow overflow-y-auto scroll-hide transition-colors">
          <div className="min-h-72 xl:min-h-75 content-center bg-linear-to-b from-secondary/20 to-secondary/0">
            <Hash className="mx-auto size-24 stroke-1" />
          </div>
          <h3 className="m-4 text-center text-xl font-medium break-words">
            {selected.data.name}
          </h3>
          <div className="mx-auto space-x-6 font-medium text-sm select-none">
            <button onClick={() => setActiveModal("invite")}>
              <div className="mx-auto mb-1 size-9 content-center rounded-full bg-secondary/5 dark:bg-secondary/10">
                <Link className="mx-auto size-6" />
              </div>
              Invite
            </button>
            {selected.data.isAdmin && (
              <button onClick={() => setActiveModal("manage")}>
                <div className="mx-auto mb-1 size-9 content-center rounded-full bg-secondary/5 dark:bg-secondary/10">
                  <Settings className="mx-auto size-4.5" />
                </div>
                Manage
              </button>
            )}
            <button onClick={() => setActiveModal("leave")}>
              <div className="mx-auto mb-1 size-9 content-center rounded-full bg-secondary/5 dark:bg-secondary/10">
                <Exit className="mx-auto size-4 stroke-2" />
              </div>
              Leave
            </button>
          </div>
          <div className="p-2 mt-2">
            <h4 className="text-sm font-medium ml-2 mb-1 select-none">
              Members
              <span className="before:content-['•'] before:mx-2">
                {selected.data.memberCount}
              </span>
            </h4>
            {data ? (
              <div>
                {data.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                    className="px-2 py-1.5 flex items-center gap-4 select-none relative rounded-lg hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-all cursor-pointer"
                  >
                    <UserIcon image={member.user.image} compact />
                    <div className="text-sm *:leading-4.5 max-w-30 text-nowrap *:overflow-ellipsis *:overflow-hidden">
                      <h1 className="font-semibold">{member.user.fullName}</h1>
                      <p className="font-medium text-secondary">
                        {member.user.username}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              isLoading && <Skeleton quantity={6} compact />
            )}
          </div>
        </div>
      </aside>
      {activeModal && (
        <DetailsModals
          active={activeModal}
          close={() => setActiveModal(null)}
          channel={selected.data}
          member={activeMember}
        />
      )}
    </>
  );
};

export default Details;
