"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scaleIn";
  staggerChildren?: boolean;
  staggerDelay?: number;
  style?: React.CSSProperties;
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
};

export function AnimatedContainer({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  variant = "fadeIn",
  staggerChildren = false,
  staggerDelay = 0.1,
  style = {},
}: AnimatedContainerProps) {
  const containerVariants = staggerChildren
    ? {
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }
    : animationVariants[variant];

  const childVariants = staggerChildren
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      }
    : {};

  return (
    <motion.div
      initial={containerVariants.initial}
      animate={containerVariants.animate}
      transition={{
        duration: staggerChildren ? undefined : duration,
        delay: staggerChildren ? undefined : delay,
        ease: "easeOut",
      }}
      className={className}
      style={style}
    >
      {staggerChildren
        ? children // Children will be animated individually
        : children}
    </motion.div>
  );
}

// Convenience wrapper for staggered animations
export function StaggeredContainer({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  style = {},
}: Omit<AnimatedContainerProps, "variant" | "duration" | "staggerChildren">) {
  return (
    <AnimatedContainer
      className={className}
      delay={delay}
      staggerChildren={true}
      staggerDelay={staggerDelay}
      style={style}
    >
      {children}
    </AnimatedContainer>
  );
}
