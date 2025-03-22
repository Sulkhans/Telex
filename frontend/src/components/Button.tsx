type Props = {
  value: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button = ({ value, disabled, onClick, className = "" }: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className} py-1.5 px-2.5 rounded-md text-foreground bg-primary dark:bg-foreground dark:text-primary cursor-pointer transition-colors`}
    >
      {value}
    </button>
  );
};

export default Button;
