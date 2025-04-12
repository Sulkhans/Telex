import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import Send from "../assets/send.svg?react";

const ChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { sendMessage, messageToEdit, setMessageToEdit, editMessage } =
    useChat();

  useEffect(() => {
    if (messageToEdit) {
      setMessage(messageToEdit.content);
      ref.current!.focus();
    }
  }, [messageToEdit]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageToEdit) {
      editMessage(messageToEdit.id, message);
    } else {
      sendMessage(message);
    }
    setMessageToEdit(null);
    setMessage("");
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (messageToEdit) {
        editMessage(messageToEdit.id, message);
      } else {
        sendMessage(message);
      }
      setMessageToEdit(null);
      setMessage("");
    }
  };

  const handleCancel = () => {
    setMessageToEdit(null);
    setMessage("");
  };

  return (
    <>
      {messageToEdit && (
        <div className="flex justify-between items-center px-4 pt-4 mb-2 text-sm font-medium select-none">
          <span>Edit message</span>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
      <form
        onSubmit={handleFormSubmit}
        className="relative flex items-center gap-2.5 px-4 py-3"
      >
        <textarea
          ref={ref}
          value={message}
          placeholder="Aa"
          onKeyDown={handleKeyDown}
          onChange={handleTextAreaChange}
          className="w-full max-h-33 px-3 py-1.5 rounded-[18px] bg-dark-background/3 dark:bg-light-background/5 placeholder:text-secondary resize-none field-sizing-content break-all outline-none"
        />
        <button className="min-w-9">
          <Send className="mx-auto size-5.5 stroke-primary dark:stroke-foreground" />
        </button>
      </form>
    </>
  );
};

export default ChatInput;
