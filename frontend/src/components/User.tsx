import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserIcon from "./UserIcon";
import UserMenu from "./UserMenu";
import Options from "../assets/options.svg?react";

const User = () => {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="h-fit p-4 py-3 flex items-center gap-4 select-none relative rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-all"
    >
      <UserIcon image={user!.image} status={user!.status} />
      <div className="text-sm *:leading-4.5 max-w-30 text-nowrap *:overflow-ellipsis *:overflow-hidden ">
        <h1 className="font-semibold">{user!.name}</h1>
        <p className="font-medium text-secondary">{user!.username}</p>
      </div>
      <button
        onClick={() => setMenuVisible(!menuVisible)}
        className={`${
          menuVisible && "bg-dark-background/5 dark:bg-light-background/5"
        } size-9 ml-auto rounded-full hover:bg-dark-background/5 dark:hover:bg-light-background/5 transition-colors`}
      >
        <Options className="mx-auto size-5 stroke-primary dark:stroke-foreground transition-colors" />
      </button>
      {menuVisible && <UserMenu />}
    </div>
  );
};

export default User;
