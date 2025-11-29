"use client";

import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";

export function MobileMenu() {
  const t = useTranslations("mobileMenu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-10 items-center justify-center rounded-md border border-everwhite cursor-pointer bg-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Menu className="h-4 w-4 text-everwhite" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="p-3 cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-popover-foreground">{t("theme")}</span>
            <ThemeToggle />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="p-3 cursor-default"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-popover-foreground">{t("language")}</span>
            <LanguageToggle />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
