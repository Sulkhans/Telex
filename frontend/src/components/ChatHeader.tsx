import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { deleteFriend } from "../api/friends";
import UserIcon from "./UserIcon";
import Options from "../assets/options.svg?react";
import Modal from "./Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const ChatHeader = () => {
  const { selected, toggleDetails } = useChat();
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: removeFriend } = useMutation({
    mutationFn: (id: string) => deleteFriend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend"] });
      navigate("/chat");
    },
  });

  if (!selected) return null;
  const isFriend = selected.type === "friend";

  const handleClick = () => (isFriend ? setShowModal(true) : toggleDetails());

  return (
    <header className="flex items-center px-4 py-3 relative select-none">
      <div className="flex items-center gap-4">
        {isFriend ? (
          <UserIcon
            image={selected.data.image}
            status={selected.data.status}
            compact
          />
        ) : (
          <div className="size-10 bg-secondary/10 rounded-full" />
        )}
        <div className="text-sm *:leading-4.5">
          {isFriend ? (
            <h1 className="font-semibold">{selected.data.fullName}</h1>
          ) : (
            <h1 className="font-semibold text-[15px]">{selected.data.name}</h1>
          )}
          {isFriend && (
            <p className="font-medium text-secondary">
              {selected.data.username}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleClick}
        className={`size-9 ml-auto rotate-90 rounded-full hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors`}
      >
        <Options className="mx-auto size-5 stroke-primary dark:stroke-foreground transition-colors" />
      </button>
      {isFriend && (
        <Modal
          title="Remove Friend"
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <p className="-mt-2 mb-2 text-sm text-secondary">
            Are you sure you want to unfriend {selected.data.username}?
          </p>
          <div className="flex justify-end gap-2 text-sm font-medium">
            <button onClick={() => setShowModal(false)} className="px-4">
              Cancel
            </button>
            <button
              onClick={() => removeFriend(selected.data.friendshipId)}
              className="px-4 py-2 bg-red-600 hover:bg-red-600/80 text-white rounded-md"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </header>
  );
};

export default ChatHeader;
