import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { BorderWaved } from "@/components/border-waved";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileMenu } from "@/components/mobile-menu";
import { Separator } from "@/components/ui/separator";

export async function Header() {
  const t = await getTranslations("dashboard.header");

  return (
    <BorderWaved
      animated={true}
      animationDuration={9}
      animationIntensity={0.8}
      waveHeight="h-10"
      showBorder={true}
      borderColor="var(--everblack)"
      className="h-screen bg-background-primary backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 gap-2 w-full">
        <span className="text-2xl font-bold text-everwhite">CPU Scheduler</span>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="sm:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
      <Separator className="w-[80%] mx-auto" />
    </BorderWaved>
  );
}
