"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-11 w-20 items-center justify-center rounded-full bg-muted transition-colors">
        <span className="sr-only">Carregando tema...</span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center space-x-2 text-everwhite">
      <Sun className="h-4 w-4" />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className={cn(
          "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary/30 data-[state=checked]:to-accent/30",
          "data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-primary/20 data-[state=unchecked]:to-accent/20",
          "hover:data-[state=checked]:from-primary/40 hover:data-[state=checked]:to-accent/40",
          "hover:data-[state=unchecked]:from-primary/30 hover:data-[state=unchecked]:to-accent/30",
          "transition-all duration-300"
        )}
        aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      />
      <Moon className="h-4 w-4" />
    </div>
  );
}
