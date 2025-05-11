import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteChannel,
  generateInvite,
  leaveChannel,
  removeMember,
  updateChannel,
  updateMember,
} from "../api/channels";
import { Channel, ChannelMember, ModalType } from "../types/types";
import Modal from "./ui/Modal";

type Props = {
  active: ModalType;
  close: () => void;
  channel: Channel;
  member: ChannelMember | null;
};

const DetailsModals = ({ active, close, channel, member }: Props) => {
  const [name, setName] = useState(channel.name);
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: invitation } = useQuery({
    queryKey: ["channelInvite", channel.id],
    queryFn: () => generateInvite(channel.id),
    enabled: active === "invite",
    select: (data) => data.invite,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const { mutate: changeName } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateChannel({ id, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      close();
    },
  });

  const { mutate: leave } = useMutation({
    mutationFn: (id: string) => leaveChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      navigate("/channel");
    },
  });

  const { mutate: deleteChannelMutation } = useMutation({
    mutationFn: (id: string) => deleteChannel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      navigate("/channel");
    },
  });

  const { mutate: updateMemberMutation } = useMutation({
    mutationFn: ({
      channelId,
      memberId,
    }: {
      channelId: string;
      memberId: string;
    }) => updateMember({ channelId, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", channel.id] });
      close();
    },
  });

  const { mutate: removeMemberMutation } = useMutation({
    mutationFn: ({
      channelId,
      memberId,
    }: {
      channelId: string;
      memberId: string;
    }) => removeMember({ channelId, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", channel.id] });
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      close();
    },
  });

  return (
    <>
      <Modal title="Invite" isOpen={active === "invite"} onClose={close}>
        <p className="-mt-2 mb-2 text-sm text-secondary">
          Share this link to invite others to the channel
        </p>
        <div className="flex gap-2 font-medium">
          <input
            disabled
            value={invitation || ""}
            className="w-full py-1.5 px-2.5 rounded-md font-medium border border-light-border dark:border-dark-border shadow-input transition-colors"
          />
          <button
            onClick={() => navigator.clipboard.writeText(invitation || "")}
            className="px-6 rounded-md text-sm text-white bg-indigo-600 dark:bg-purple-900 active:bg-indigo-600/90 dark:active:bg-purple-900/90"
          >
            Copy
          </button>
        </div>
      </Modal>
      <Modal
        title="Manage Channel"
        isOpen={active === "manage"}
        onClose={close}
      >
        <p className="-mt-2 mb-2 text-sm text-secondary">
          Customize your channel’s name
        </p>
        <div className="flex gap-2 font-medium">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-1.5 px-2.5 rounded-md font-medium border border-light-border dark:border-dark-border shadow-input focus:ring-2 ring-primary dark:ring-foreground transition-colors"
          />
          <button
            onClick={() => changeName({ id: channel.id, name })}
            className="min-w-24 rounded-md text-sm text-white bg-indigo-600 dark:bg-purple-900 active:bg-indigo-600/90 dark:active:bg-purple-900/90"
          >
            Confirm
          </button>
        </div>
        <p className="mt-4 mb-1 text-sm text-secondary">
          Delete this channel permanently
        </p>
        <div className="flex justify-between text-sm font-medium">
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" checked={checked} />
            <label
              onClick={() => setChecked(checked ? false : true)}
              className="text-sm dark:before:border-dark-border peer-checked:dark:after:bg-foreground select-none"
            >
              I understand this action can't be undone
            </label>
          </div>
          <button
            disabled={!checked}
            onClick={() => deleteChannelMutation(channel.id)}
            className={`${
              checked ? "bg-red-600" : "bg-red-600/50"
            } w-24 py-2 text-white rounded-md`}
          >
            Delete
          </button>
        </div>
      </Modal>
      <Modal title="Leave Channel" isOpen={active === "leave"} onClose={close}>
        <p className="-mt-2 mb-2 text-sm text-secondary">
          Are you sure you want to leave "{channel.name}"?
        </p>
        <div className="flex justify-end gap-2 text-sm font-medium">
          <button onClick={close} className="px-4">
            Cancel
          </button>
          <button
            onClick={() => leave(channel.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-600/80 text-white rounded-md"
          >
            Leave
          </button>
        </div>
      </Modal>
      <Modal title="Manage Member" isOpen={active === "member"} onClose={close}>
        <p className="-mt-2 mb-2 text-sm text-secondary">
          Select an action to manage this member
        </p>
        <div className="flex justify-end gap-2 text-sm font-medium">
          <button
            onClick={() =>
              removeMemberMutation({
                channelId: channel.id,
                memberId: member!.id,
              })
            }
            className="w-full py-2 bg-red-600 active:bg-red-600/80 text-white rounded-md"
          >
            Remove
          </button>
          <button
            onClick={() =>
              updateMemberMutation({
                channelId: channel.id,
                memberId: member!.id,
              })
            }
            className="w-full py-2 rounded-md text-sm text-white bg-indigo-600 dark:bg-purple-900 active:bg-indigo-600/90 dark:active:bg-purple-900/90"
          >
            {member?.isAdmin ? "Demote" : "Promote"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DetailsModals;
