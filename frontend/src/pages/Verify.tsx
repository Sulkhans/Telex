import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verify } from "../api/auth";
import Loader from "../components/ui/Loader";

const Verify = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [message, setMessage] = useState<any>(null);

  const verifyMutation = useMutation({
    mutationFn: (token: string) => {
      return verify(token);
    },
    onSuccess: () =>
      setMessage({
        primary: "Your account has been verified",
        secondary: "You can now log in and start messaging",
      }),
    onError: () =>
      setMessage({
        primary: "This verification link is invalid",
        secondary: "Please recheck your email for the correct link",
      }),
  });

  const verifyToken = async (token: string) => {
    await verifyMutation.mutateAsync(token);
  };

  useEffect(() => {
    const token = params.get("token");
    if (token) verifyToken(token);
    else navigate("/");
  }, []);

  return message ? (
    <div className="mx-auto relative max-w-sm text-center font-medium p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-all">
      <h1 className="text-xl mb-1">{message.primary}</h1>
      <p className="text-sm text-secondary">{message.secondary}</p>
      <button className="text-sm mt-4 underline" onClick={() => navigate("/")}>
        Go back to the main page
      </button>
    </div>
  ) : (
    <Loader />
  );
};

export default Verify;
