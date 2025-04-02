import { Status } from "../types/types";

type Props = {
  image: string;
  status?: Status;
  compact?: boolean;
};

const colors = {
  online: "bg-green-600",
  offline: "bg-secondary",
  away: "bg-amber-500",
};

const UserIcon = ({ image, status, compact }: Props) => {
  return (
    <div className="relative">
      <img
        draggable={false}
        src={"https://avatar.iran.liara.run/public" + image}
        className={`${
          compact ? "size-10 min-w-10" : "size-12 min-w-12"
        } rounded-full select-none peer`}
      />
      {status && (
        <span
          className={`${colors[status]} ${
            compact ? "size-3.5" : "size-4"
          } content-[''] absolute rounded-full bottom-0 right-0 border-2 border-light-card dark:border-dark-card transition-colors`}
        />
      )}
    </div>
  );
};

export default UserIcon;
