type Props = {
  type?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Input = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  className = "",
}: Props) => {
  return (
    <div className="flex flex-col">
      <label className="font-medium text-sm mb-1.5 select-none">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${className} py-1.5 px-2.5 rounded-md font-medium border border-light-border dark:border-dark-border shadow-input focus:ring-2 ring-primary dark:ring-foreground transition-colors`}
      />
    </div>
  );
};

export default Input;
