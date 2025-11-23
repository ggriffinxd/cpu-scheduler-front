"use client";

import { BorderWaved } from "@/components/border-waved";
import {
  AnimatedText,
  AnimatedContainer,
  AnimatedCard,
  StaggeredContainer,
} from "@/components/animations";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  Cpu,
  Play,
  BarChart3,
  Code,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/button";

export function Main() {
  const t = useTranslations("dashboard.main");
  const router = useRouter();

  const features = [
    {
      id: "process-creation",
      icon: <Cpu className="w-6 h-6 text-everpurple" />,
      title: t("features.processCreation"),
      description: t("features.processCreationDescription"),
      delay: 0.3,
    },
    {
      id: "scheduling-viz",
      icon: <Play className="w-6 h-6 text-everblue" />,
      title: t("features.schedulingVisualization"),
      description: t("features.schedulingVisualizationDescription"),
      delay: 0.4,
    },
    {
      id: "performance-metrics",
      icon: <BarChart3 className="w-6 h-6 text-evergreen" />,
      title: t("features.performanceMetrics"),
      description: t("features.performanceMetricsDescription"),
      delay: 0.5,
    },
    {
      id: "multiple-algorithms",
      icon: <Zap className="w-6 h-6 text-everorange" />,
      title: t("features.multipleAlgorithms"),
      description: t("features.multipleAlgorithmsDescription"),
      delay: 0.6,
    },
    {
      id: "educational-timeline",
      icon: <Clock className="w-6 h-6 text-everpink" />,
      title: t("features.educationalTimeline"),
      description: t("features.educationalTimelineDescription"),
      delay: 0.7,
    },
    {
      id: "code-visualization",
      icon: <Code className="w-6 h-6 text-evercyan" />,
      title: t("features.codeVisualization"),
      description: t("features.codeVisualizationDescription"),
      delay: 0.8,
    },
  ];

  return (
    <BorderWaved
      animated={true}
      animationDuration={9}
      animationIntensity={0.8}
      waveHeight="h-10"
      showBorder={true}
      borderColor="var(--background-primary)"
      extendBorder={true}
      className="h-screen backdrop-blur-sm overflow-hidden flex flex-col"
    >
      <div className="flex-1 flex items-start justify-center w-full px-4 py-6">
        <div className="max-w-7xl w-full">
          <AnimatedContainer
            variant="slideUp"
            className="text-center mb-10 space-y-4"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex justify-center mb-4"
            >
              <Sparkles className="w-12 h-12 text-everpurple" />
            </motion.div>

            <AnimatedText
              as="h1"
              variant="fadeIn"
              delay={0.2}
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
            >
              {t("title")}
            </AnimatedText>

            <AnimatedText
              as="p"
              variant="slideUp"
              delay={0.4}
              className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed"
            >
              {t("subtitle")}
            </AnimatedText>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-6"
            >
              <Button
                bgColor="bg-gradient-to-r from-background-primary/90 to-background-primary/60 hover:from-background-primary hover:to-background-primary/90 text-everwhite shadow-lg hover:shadow-xl"
                className="px-8 py-4 text-lg font-semibold group w-fit"
                onClick={() => router.push("/scheduler")}
              >
                <span className="flex items-center gap-2">
                  {t("cta")}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </AnimatedContainer>

          <StaggeredContainer
            staggerDelay={0.1}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto overflow-y-auto max-h-64 sm:max-h-80 md:max-h-96"
            style={{ scrollbarWidth: "none" }}
          >
            {features.map((feature) => (
              <AnimatedCard
                key={feature.id}
                delay={feature.delay}
                hoverScale={1}
                className="h-38 md:h-40"
                glowOnHover={false}
              >
                <div className="flex flex-col justify-between h-full space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    transition={{ duration: 0.1 }}
                    className="relative cursor-pointer"
                  >
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-full w-fit">
                      {feature.icon}
                      <h3 className="text-sm md font-semibold text-foreground group-hover:text-everpurple transition-colors">
                        {feature.title}
                      </h3>
                    </div>
                  </motion.div>

                  <p className="text-sm text-everwhite leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </StaggeredContainer>
        </div>
      </div>
    </BorderWaved>
  );
}
