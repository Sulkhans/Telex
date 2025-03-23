import { Fragment, useState } from "react";
import { ErrorType, SignupData } from "../types/types";
import { signup } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import Button from "./Button";
import Input from "./Input";
import Eye from "../assets/eye.svg?react";

type Props = {
  toggle: () => void;
};

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  gender: true,
};

const Signup = ({ toggle }: Props) => {
  const [data, setData] = useState<SignupData>(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => {
      setMessage(null);
      return signup(data);
    },
    onSuccess: () => {
      setMessage(
        "Account created! Check your email to confirm your registration"
      );
      setData(initialData);
    },
    onError: (err: ErrorType) => setMessage(err.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signupMutation.mutateAsync(data);
  };

  const isLoading = signupMutation.isPending;
  const isError = signupMutation.isError;

  return (
    <>
      <div className="mx-auto max-w-3xl p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-all">
        <h1 className="text-xl text-center font-semibold mb-6">
          Create an account
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
            <div className="space-y-4 sm:pr-6 sm:border-r-2 border-light-background dark:border-dark-border transition-colors">
              <Input
                name="email"
                label="Email"
                value={data.email}
                onChange={handleChange}
              />
              <div className="flex gap-6">
                <Input
                  name="firstName"
                  label="First Name"
                  value={data.firstName}
                  onChange={handleChange}
                  className="w-full"
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  value={data.lastName}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-medium text-sm mb-1.5 select-none">
                  Gender
                </label>
                <div className="h-9.5 content-center">
                  {["Male", "Female"].map((gender, i) => (
                    <Fragment key={i}>
                      <input
                        id={gender}
                        type="radio"
                        name="gender"
                        checked={i === 0 ? data.gender : !data.gender}
                        onChange={() =>
                          setData((prev) => ({ ...prev, gender: i === 0 }))
                        }
                        className="peer"
                      />
                      <label
                        htmlFor={gender}
                        className="mr-6 dark:before:border-dark-border peer-checked:dark:after:bg-foreground"
                      >
                        {gender}
                      </label>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:pl-6 transition-colors">
              <Input
                name="username"
                label="Username"
                value={data.username}
                onChange={handleChange}
              />
              <Input
                type="password"
                name="password"
                label="Password"
                value={data.password}
                onChange={handleChange}
              />
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  label="Confirm Password"
                  value={data.confirmPassword}
                  onChange={handleChange}
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
            </div>
          </div>
          <Button
            value="Sign up"
            disabled={isLoading}
            className={`${
              isLoading && "pointer-events-none opacity-85"
            } w-full mt-8 mb-6`}
          />
        </form>
        <p className="text-center text-sm select-none font-medium">
          Already have an account?{" "}
          <button onClick={toggle} className="underline">
            Log in
          </button>
        </p>
      </div>
      {message && (
        <p
          className={`text-sm font-medium text-center mb-3 ${
            isError ? "text-rose-700" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </>
  );
};

export default Signup;
