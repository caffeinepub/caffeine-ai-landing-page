import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-accent/20 text-foreground hover:text-teal ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300" />
      )}
    </button>
  );
}
