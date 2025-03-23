import { useEffect, useState } from "react";

const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.theme === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
    if (isDark) {
      localStorage.theme = "dark";
    } else {
      localStorage.theme = "light";
    }
  }, [isDark]);

  return { isDark, setIsDark };
};

export default useTheme;
