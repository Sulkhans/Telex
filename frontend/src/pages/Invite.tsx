import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { joinChannel } from "../api/channels";
import Loader from "../components/ui/Loader";

const Invite = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [message, setMessage] = useState<any>(null);

  const { user, isInitialLoading } = useAuth();

  const { mutate: join, isPending } = useMutation({
    mutationFn: (token: string) => joinChannel(token),
    onSuccess: ({ channelId }) => navigate(`/channel/${channelId}`),
    onError: (err: any) =>
      setMessage(err.response.data.message || "Please try again later"),
  });

  useEffect(() => {
    if (token && user) join(token);
  }, [token, user, join]);

  if (isInitialLoading) return <Loader />;
  if (!user) return <Navigate to="/" />;

  return isPending ? (
    <Loader />
  ) : (
    <div className="mx-auto relative max-w-sm text-center font-medium p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shadow transition-all">
      <h1 className="text-xl mb-1">Failed to join channel</h1>
      <p className="text-sm text-secondary">{message}</p>
      <button className="text-sm mt-4 underline" onClick={() => navigate("/")}>
        Go back to the main page
      </button>
    </div>
  );
};

export default Invite;
