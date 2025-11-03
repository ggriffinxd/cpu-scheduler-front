import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const t = await getTranslations("dashboard.header");

  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
