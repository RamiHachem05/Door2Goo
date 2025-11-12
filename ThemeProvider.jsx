import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext();
export const useTheme = () => useContext(ThemeCtx);

export default function ThemeProvider({ children }) {
  const getInitial = () => {
    const saved = localStorage.getItem("d2g_theme");
    if (saved === "light" || saved === "dark") return saved;
    // fall back to system preference
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("d2g_theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, toggle: () => setTheme(t => (t === "light" ? "dark" : "light")) }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
