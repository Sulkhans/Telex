import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Signup from "../components/Signup";
import Login from "../components/Login";

const Auth = () => {
  const [isRegistered, setIsRegistered] = useState(true);

  const { user, isInitialLoading } = useAuth();
  if (isInitialLoading) return <Loader />;
  if (user) return <Navigate to="/chat" replace />;

  return isRegistered ? (
    <Login toggle={() => setIsRegistered(false)} />
  ) : (
    <Signup toggle={() => setIsRegistered(true)} />
  );
};

export default Auth;
