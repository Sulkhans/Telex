const Bubble = ({
  style,
  isOutgoing,
}: {
  style: string;
  isOutgoing?: boolean;
}) => (
  <div
    className={`h-[38.5px] rounded-[1.25rem] animate-pulse ${style} ${
      isOutgoing
        ? "bg-indigo-600/20 dark:bg-purple-900/30"
        : "bg-dark-background/10 dark:bg-light-background/10"
    }`}
  />
);

const Avatar = () => (
  <div className="size-10 rounded-full bg-dark-background/10 dark:bg-light-background/10 animate-pulse" />
);

const ChatSkeleton = () => {
  return (
    <div>
      <div className="mb-4 flex items-end">
        <Avatar />
        <div className="ml-3 flex flex-col gap-1">
          <Bubble style="w-48" />
          <Bubble style="w-64" />
        </div>
      </div>
      <div className="mb-4 flex flex-row-reverse">
        <Bubble style="w-40" isOutgoing />
      </div>
      <div className="mb-4 flex items-end">
        <Avatar />
        <Bubble style="ml-3 w-56" />
      </div>
      <div className="mb-4 flex flex-row-reverse items-end">
        <div className="flex flex-col gap-1 items-end">
          <Bubble style="w-52" isOutgoing />
          <Bubble style="w-36" isOutgoing />
        </div>
      </div>
      <div className="mb-4 flex items-end">
        <Avatar />
        <Bubble style="ml-3 w-40" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
