import Logo from "../assets/logo.svg?react";

const Telex = () => {
  return (
    <div className="flex items-center">
      <Logo className="size-8 stroke-5 stroke-primary fill-primary dark:stroke-foreground dark:fill-foreground transition-colors" />
      <h1 className="text-2xl font-semibold tracking-wide select-none">
        TELEX
      </h1>
    </div>
  );
};

export default Telex;
