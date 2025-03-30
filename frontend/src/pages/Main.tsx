import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

const Main = () => {
  const { user, isInitialLoading } = useAuth();

  if (isInitialLoading) {
    return (
      <div className="h-dvh content-center">
        <Loader />
      </div>
    );
  }
  if (!user) return <Navigate to="/" />;

  return (
    <div className="h-dvh p-4 flex gap-4 overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Main;
