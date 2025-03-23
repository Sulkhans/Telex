import { Outlet } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import Telex from "../components/Telex";
import Sun from "../assets/sun.svg?react";
import Moon from "../assets/moon.svg?react";

const AuthLayout = () => {
  const { isDark, setIsDark } = useTheme();
  return (
    <div className="h-dvh content-center">
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute bottom-4 left-4 opacity-30 hover:opacity-100 transition-opacity duration-500"
      >
        {isDark ? (
          <Sun className="stroke-foreground" />
        ) : (
          <Moon className="stroke-primary" />
        )}
      </button>
      <div className=" space-y-6 mx-6 py-6 sm:my-0">
        <div className="w-fit mx-auto">
          <Telex />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
