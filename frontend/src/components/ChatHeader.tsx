import { useChat } from "../context/ChatContext";
import UserIcon from "./UserIcon";
import Options from "../assets/options.svg?react";

const ChatHeader = () => {
  const { selected, toggleDetails } = useChat();

  if (!selected) return null;
  const isFriend = selected.type === "friend";

  const handleClick = () => (isFriend ? null : toggleDetails());

  return (
    <header className="flex items-center px-4 py-3 select-none">
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
    </header>
  );
};

export default ChatHeader;
