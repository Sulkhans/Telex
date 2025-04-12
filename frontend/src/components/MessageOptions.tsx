import { useChat } from "../context/ChatContext";
import Options from "../assets/Options.svg?react";

type Props = {
  index: number;
  activeMessage: number;
  setActiveMessage: (i: number) => void;
};

const MessageOptions = ({ index, activeMessage, setActiveMessage }: Props) => {
  const { messages, setMessageToEdit, deleteMessage } = useChat();

  const handleEdit = (index: number) => {
    setMessageToEdit({
      id: messages![index].id,
      content: messages![index].content,
    });
    setActiveMessage(-1);
  };

  const handleDelete = (index: number) => {
    deleteMessage(messages![index].id);
    setActiveMessage(-1);
  };

  return (
    <div className="relative text-xs hidden group-hover:flex select-none">
      <button
        onClick={() => setActiveMessage(index)}
        className="size-8 ml-auto rounded-full hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors"
      >
        <Options className="mx-auto size-5 stroke-primary dark:stroke-foreground transition-colors" />
      </button>
      <div
        className={`${
          activeMessage === index ? "flex" : "hidden"
        } w-20 absolute z-10 -top-21 left-1/2 -translate-x-1/2 flex-col p-1`}
      >
        <div className="flex flex-col p-1 text-sm rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md transition-colors">
          <button
            onClick={() => handleEdit(index)}
            className="px-2 py-1.5 rounded-md hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(index)}
            className="px-2 py-1.5 rounded-md text-red-600 hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageOptions;
