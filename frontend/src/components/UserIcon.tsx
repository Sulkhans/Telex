import { Status } from "../types/types";

type Props = {
  image: string;
  status: Status;
};

const colors = {
  online: "bg-green-600",
  offline: "bg-secondary",
  away: "bg-amber-500",
};

const UserIcon = ({ image, status }: Props) => {
  return (
    <div className="relative">
      <img
        draggable={false}
        src={"https://avatar.iran.liara.run/public" + image}
        className="size-12 min-w-12 rounded-full peer"
      />
      <span
        className={`${colors[status]} content-[''] size-4 absolute rounded-full bottom-0 right-0 border-2 border-light-card transition-colors`}
      />
    </div>
  );
};

export default UserIcon;
