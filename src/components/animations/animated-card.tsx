"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: number;
  glowOnHover?: boolean;
}

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hoverScale = 1.05,
  glowOnHover = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        scale: hoverScale,
        transition: { duration: 0.2 },
      }}
      className={`relative group ${className}`}
    >
      {/* Glow effect on hover */}
      {glowOnHover && (
        <div className="absolute inset-0 bg-gradient-to-r from-everpurple/20 to-everblue/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
      )}

      {/* Card content */}
      <div className="relative bg-gradient-to-b from-background-primary/70 to-background-primary/50 backdrop-blur-sm border border-everwhite/10 rounded-xl p-4 hover:border-everpurple/30 transition-all duration-300 h-full">
        {children}
      </div>
    </motion.div>
  );
}
