import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Eye from "../assets/eye.svg?react";

type Props = {
  toggle: () => void;
};

const Login = ({ toggle }: Props) => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    login({ username: username.toLocaleLowerCase(), password });
  };

  return (
    <>
      <div className="mx-auto max-w-sm p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-all">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-secondary font-medium">
            Login with your existing account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 my-6">
          <Input label="Username" value={username} onChange={handleUsername} />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={handlePassword}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="size-9.5 absolute right-0 bottom-0 cursor-pointer"
            >
              <Eye className="size-6 ml-0.5 fill-primary dark:fill-foreground transition-colors" />
            </button>
          </div>
          <Button
            value="Log in"
            disabled={isLoading}
            className={`${
              isLoading && "pointer-events-none opacity-85"
            } w-full mt-2`}
          />
        </form>
        <p className="text-center text-sm select-none font-medium">
          Don't have an account?{" "}
          <button onClick={toggle} className="underline">
            Sign up
          </button>
        </p>
      </div>
      {error && (
        <p className="text-sm font-medium text-center text-rose-700 mb-3">
          {error.message}
        </p>
      )}
    </>
  );
};

export default Login;
