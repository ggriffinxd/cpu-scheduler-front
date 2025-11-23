"use client";

import {
  AnimatedContainer,
  AnimatedText,
  AnimatedImage,
} from "@/components/animations";
import { Button } from "@/components/button";
import { BorderWaved } from "@/components/border-waved";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export function Header() {
  const t = useTranslations("dashboard.header");
  const router = useRouter();
  return (
    <BorderWaved
      animated={true}
      animationDuration={9}
      animationIntensity={0.8}
      waveHeight="h-10"
      showBorder={true}
      borderColor="var(--everblack)"
      className="h-screen bg-background-primary backdrop-blur-sm overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 gap-2 w-full">
        <span className="text-2xl font-bold text-everwhite">{t("title")}</span>
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

      <div className="mx-auto h-px bg-gradient-to-r from-transparent via-everwhite/50 to-transparent origin-center animate-pulse" />

      <AnimatedContainer
        variant="slideUp"
        className="flex-1 flex items-center justify-center w-full px-4"
      >
        <div className="max-w-7xl w-full">
          <div className="hidden lg:flex items-center justify-center min-h-[70vh] gap-12">
            <AnimatedContainer
              variant="slideLeft"
              delay={0.1}
              className="flex-1 max-w-md"
            >
              <div className="space-y-6">
                <AnimatedText
                  as="h1"
                  variant="slideUp"
                  delay={0.2}
                  className="text-5xl lg:text-6xl font-bold leading-tight text-everwhite max-w-[94%]"
                >
                  {t("subtitle")}
                </AnimatedText>
                <AnimatedText
                  as="p"
                  variant="slideUp"
                  delay={0.4}
                  className="text-lg text-everwhite/80 leading-relaxed"
                >
                  {t("description")}
                </AnimatedText>
                <Button
                  bgColor="bg-secondary text-everwhite hover:bg-secondary/40 hover:[box-shadow:inset_0_0px_6px_0_rgba(0,0,0,0.28)]"
                  className="w-full"
                  onClick={() => {
                    router.push("/scheduler");
                  }}
                >
                  {t("button.start")}
                </Button>
                <AnimatedContainer
                  variant="scaleIn"
                  delay={0.6}
                  className="flex gap-4 pt-4"
                >
                  <div className="w-12 h-1 bg-gradient-to-r from-everpurple to-everblue rounded-full" />
                  <div className="w-8 h-1 bg-everpurple/50 rounded-full animate-pulse" />
                  <div className="w-6 h-1 bg-everblue/30 rounded-full" />
                </AnimatedContainer>
              </div>
            </AnimatedContainer>

            <div className="w-px h-80 bg-gradient-to-b from-transparent via-everwhite/50 to-transparent origin-center animate-pulse" />

            <div className="flex-1 max-w-lg">
              <AnimatedImage
                src="/cpu-scheduler-playground.gif"
                alt="CPU-scheduler-playground-preview"
                width={400}
                height={300}
                variant="slideRight"
                delay={0.1}
                className="w-full"
                priority
                overlayText={t("button.start")}
                clickable={true}
                onClick={() => router.push("/scheduler")}
              />
            </div>
          </div>

          <div className="lg:hidden flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4">
            <AnimatedContainer
              variant="slideUp"
              delay={0.2}
              className="text-center space-y-4"
            >
              <AnimatedText
                as="h1"
                variant="scaleIn"
                delay={0.4}
                className="text-4xl sm:text-5xl font-bold leading-tight text-everwhite max-w-md"
              >
                {t("subtitle")}
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="slideUp"
                delay={0.6}
                className="text-base text-everwhite/80 leading-relaxed w-full"
              >
                {t("description")}
              </AnimatedText>
            </AnimatedContainer>

            <AnimatedImage
              src="/cpu-scheduler-playground.gif"
              alt="CPU-scheduler-playground-preview"
              width={350}
              height={250}
              variant="scaleIn"
              delay={0.4}
              className="w-full max-w-sm"
              priority
              overlayText={t("button.start")}
              clickable={true}
              onClick={() => router.push("/scheduler")}
            />

            <AnimatedContainer
              variant="fadeIn"
              delay={0.8}
              className="flex gap-3 pt-2"
            >
              <div className="w-10 h-1 bg-gradient-to-r from-everpurple to-everblue rounded-full" />
              <div className="w-6 h-1 bg-everpurple/50 rounded-full animate-pulse" />
              <div className="w-4 h-1 bg-everblue/30 rounded-full" />
            </AnimatedContainer>
          </div>
        </div>
      </AnimatedContainer>
    </BorderWaved>
  );
}
