import Message from "../../assets/message.svg?react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      <Message className="size-16 fill-dark-background/20 dark:fill-light-background/15" />
      <h1 className="text-3xl font-extrabold text-dark-background/20 dark:text-light-background/15">
        No chat selected
      </h1>
    </div>
  );
};

export default NoChatSelected;
