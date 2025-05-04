import { useState } from "react";
import User from "./User";
import Friends from "./Friends";
import Channels from "./Channels";

const Sidebar = () => {
  const [toggle, setToggle] = useState(
    window.location.pathname.split("/")[1] === "chat"
  );
  return (
    <aside className="min-w-72 xl:min-w-75 h-full flex flex-col gap-4">
      <div className="h-[calc(100%-5.625rem)] p-2 grid grid-rows-[2.75rem_1fr_2.25rem] gap-2 rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-colors">
        <div className="bg-dark-background/5 dark:bg-light-background/5 h-fit p-1.25 rounded-full text-sm font-medium select-none">
          <div className="relative grid grid-cols-2 place-content-center gap-2 text-center text-secondary">
            {["Friends", "Channels"].map((each, i) => (
              <button
                key={i}
                onClick={() => setToggle(i === 0)}
                className={`${
                  toggle === (i === 0) && "text-foreground dark:text-foreground"
                } p-1.75 transition-colors z-10`}
              >
                {each}
              </button>
            ))}
            <span
              className={`${
                !toggle && "translate-x-[calc(100%+0.5rem)]"
              } absolute w-[calc(50%-4px)] h-full bg-indigo-600 dark:bg-purple-900 rounded-full shadow-md shadow-primary/20 transition-all`}
            />
          </div>
        </div>
        {toggle ? <Friends /> : <Channels />}
      </div>
      <User />
    </aside>
  );
};

export default Sidebar;
