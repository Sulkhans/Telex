import { useState } from "react";
import { Friend } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  deleteFriend,
  sendFriendRequest,
} from "../api/friends";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import UserIcon from "./ui/UserIcon";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  requests: Friend[];
};

const FriendsModal = ({ isOpen, onClose, requests }: Props) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    mutate: sendRequest,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (username: string) => sendFriendRequest(username),
    onMutate: () => setMessage(null),
    onSettled: (res, err) => {
      if (res) {
        setMessage(res.message);
        setUsername("");
      } else setMessage(err!.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      sendRequest(username);
    }
  };

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (id: string) => acceptFriendRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const { mutate: deleteRequest } = useMutation({
    mutationFn: (id: string) => deleteFriend(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requests"] }),
  });

  return (
    <Modal title="Add Friend" isOpen={isOpen} onClose={onClose}>
      <p className="-mt-2 mb-1 text-sm text-secondary">
        You can add friends with their username
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-2 grid grid-rows-2 sm:grid-cols-[1fr_6rem] sm:grid-rows-1 items-center gap-2"
      >
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="-mt-1.5"
        />
        <button
          disabled={isPending}
          className="h-full rounded-md text-sm text-white bg-indigo-600 dark:bg-purple-900"
        >
          Send
        </button>
      </form>
      {message && (
        <p
          className={`${
            isError ? "text-rose-700" : "text-indigo-600 dark:text-purple-500"
          } mt-2 text-sm font-medium`}
        >
          {message}
        </p>
      )}
      <h3 className="mt-4 font-medium">Friend Requests</h3>
      {requests ? (
        <>
          <p className="text-sm text-secondary">
            Check out who wants to add you
          </p>
          <div className="mt-4 space-y-4 max-h-66 overflow-y-auto scroll">
            {requests.map(({ id, sender }: any) => (
              <div key={sender.id} className="flex items-center gap-4">
                <UserIcon image={sender.image} compact />
                <div className="text-sm *:leading-4.5 max-w-48 text-nowrap *:overflow-ellipsis *:overflow-hidden">
                  <h1 className="font-semibold">{sender.fullName}</h1>
                  <p className="font-medium text-secondary">
                    {sender.username}
                  </p>
                </div>
                <div className="ml-auto mr-2 text-sm font-medium space-x-4">
                  <button
                    onClick={() => deleteRequest(id)}
                    className="text-rose-700"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => acceptRequest(id)}
                    className="text-indigo-600 dark:text-purple-500"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-secondary">No new requests</p>
      )}
    </Modal>
  );
};

export default FriendsModal;
