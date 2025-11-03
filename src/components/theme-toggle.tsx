"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="relative inline-flex h-11 w-20 items-center rounded-full bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        <span className="sr-only">Carregando tema...</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-11 w-20 items-center rounded-full bg-gradient-to-r from-primary/20 to-accent/20 transition-all duration-300 hover:from-primary/30 hover:to-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-lg transition-all duration-300 ${
          isDark ? "translate-x-10" : "translate-x-1"
        }`}
      >
        {isDark ? (
          <Moon className="h-5 w-5 text-primary" />
        ) : (
          <Sun className="h-5 w-5 text-primary" />
        )}
      </span>
    </button>
  );
}
