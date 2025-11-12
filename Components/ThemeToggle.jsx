import { useTheme } from "../ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      style={{
        border: "1px solid rgba(255,255,255,.25)",
        background: "transparent",
        color: "inherit",
        padding: "8px 12px",
        borderRadius: 10,
        cursor: "pointer"
      }}
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
