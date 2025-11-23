"use client";

import { motion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "scaleIn"
    | "stagger";
  as?: ElementType;
}

const getAnimationVariants = (variant: string) => {
  switch (variant) {
    case "fadeIn":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
    case "slideUp":
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };
    case "slideLeft":
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
      };
    case "slideRight":
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
      };
    case "scaleIn":
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
      };
    case "stagger":
      return {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
  }
};

export function AnimatedText({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  variant = "fadeIn",
  as: Component = "div",
}: AnimatedTextProps) {
  const MotionComponent =
    motion(Component as keyof typeof motion) || motion.div;
  const variants = getAnimationVariants(variant);

  return (
    <MotionComponent
      initial={variants.initial}
      animate={variants.animate}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
