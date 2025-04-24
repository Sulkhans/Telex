import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useTheme from "../hooks/useTheme";
import Chevron from "../assets/chevron.svg?react";
import { Status } from "../types/types";

type Props = {
  menuVisible: boolean;
};

const statusButtons: { status: Status; color: String }[] = [
  { status: "online", color: "bg-green-600" },
  { status: "away", color: "bg-amber-500" },
  { status: "offline", color: "bg-secondary" },
];

const UserMenu = ({ menuVisible }: Props) => {
  const { logout, updateStatus } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const [statusVisible, setStatusVisible] = useState(false);

  return (
    <div
      className={`${
        !menuVisible && "opacity-0 pointer-events-none"
      } absolute left-45 bottom-16 flex items-start gap-1 z-30`}
    >
      <div className="relative w-40 flex flex-col p-1 text-sm rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md transition-colors">
        <button
          onClick={() => setStatusVisible(!statusVisible)}
          onMouseEnter={() => setStatusVisible(true)}
          onMouseLeave={() => setStatusVisible(false)}
          className="flex justify-between items-center px-2 py-1.5 rounded-md hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors"
        >
          <span>Status</span>
          <Chevron className="size-4 stroke-primary dark:stroke-foreground transition-colors" />
          <span className="absolute -right-1.5 h-8 w-2.5 cursor-default" />
        </button>
        <button
          onClick={logout}
          className="text-start px-2 py-1.5 rounded-md hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors"
        >
          Log out
        </button>
        <hr className="my-1 border-light-border dark:border-dark-border transition-colors" />
        <button
          className="flex justify-between px-2 py-1.5 rounded-md hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors"
          onClick={() => setIsDark(!isDark)}
        >
          <p>Dark mode</p>
          <span className="font-semibold">{isDark ? "On" : "Off"}</span>
        </button>
      </div>
      {statusVisible && (
        <div
          onMouseEnter={() => setStatusVisible(true)}
          onMouseLeave={() => setStatusVisible(false)}
          className="w-23 flex flex-col p-1 text-sm rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md"
        >
          {statusButtons.map(({ status, color }) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-dark-background/5 dark:hover:bg-light-background/5 rounded-md transition-colors"
            >
              <span className={`${color} size-2.5 block rounded-full`} />
              {status[0].toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
