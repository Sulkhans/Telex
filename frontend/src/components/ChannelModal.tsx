import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal";
import Input from "./Input";
import { createChannel } from "../api/channels";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ChannelModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (name: string) => createChannel(name),
    onMutate: () => setError(null),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["channel"] });
      onClose();
      setName("");
      navigate(`/channel/${res.id}`);
    },
    onError: (err: any) => setError(err.response.data.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      mutate(name);
    }
  };

  return (
    <Modal title="Create New Channel" isOpen={isOpen} onClose={onClose}>
      <p className="-mt-2 mb-1 text-sm text-secondary">
        Only invited members will have access
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-2 grid grid-rows-2 sm:grid-cols-[1fr_6rem] sm:grid-rows-1 items-center gap-2"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="-mt-1.5"
        />
        <button
          disabled={isPending}
          className="h-full rounded-md text-sm text-white bg-indigo-600 dark:bg-purple-900"
        >
          Create
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-rose-700 font-medium">{error}</p>
      )}
    </Modal>
  );
};

export default ChannelModal;
