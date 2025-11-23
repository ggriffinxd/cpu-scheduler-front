"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface AnimatedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  delay?: number;
  duration?: number;
  variant?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn";
  hoverEffect?: boolean;
  glowEffect?: boolean;
  className?: string;
  overlayText?: string;
  overlayIcon?: ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 30, scale: 0.8 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
};

export function AnimatedImage({
  delay = 0,
  duration = 0.8,
  variant = "fadeIn",
  hoverEffect = true,
  glowEffect = true,
  className = "",
  overlayText,
  overlayIcon,
  onClick,
  clickable = false,
  ...imageProps
}: AnimatedImageProps) {
  const controls = useAnimationControls();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Iniciar animação do glow apenas se o componente estiver montado
    if (glowEffect) {
      const startGlowAnimation = async () => {
        if (!isMountedRef.current) return;

        await controls.start({
          boxShadow: [
            "0 0 20px rgba(123, 57, 219, 0.3)",
            "0 0 40px rgba(123, 57, 219, 0.5)",
            "0 0 20px rgba(123, 57, 219, 0.3)",
          ],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        });
      };

      startGlowAnimation();
    }

    return () => {
      isMountedRef.current = false;
      controls.stop();
    };
  }, [glowEffect, controls]);

  const handleClick = () => {
    if (onClick && isMountedRef.current) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={animationVariants[variant].initial}
      animate={animationVariants[variant].animate}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={`relative group ${
        clickable ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-everpurple/20 to-everblue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
      )}

      {glowEffect && (
        <motion.div
          animate={controls}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-everblack/50 to-everblack/20 p-1"
        >
          <motion.div
            whileHover={hoverEffect ? { scale: 1.05, rotateY: 5 } : undefined}
            transition={{ duration: 0.3 }}
          >
            <Image
              {...imageProps}
              className={`w-full h-auto rounded-xl object-cover ${
                "className" in imageProps ? imageProps.className || "" : ""
              }`}
            />
          </motion.div>
        </motion.div>
      )}

      {!glowEffect && (
        <motion.div
          whileHover={hoverEffect ? { scale: 1.05 } : undefined}
          transition={{ duration: 0.3 }}
        >
          <Image
            {...imageProps}
            className={`rounded-xl ${
              "className" in imageProps ? imageProps.className || "" : ""
            }`}
          />
        </motion.div>
      )}
      {(overlayText || overlayIcon) && (
        <div className="absolute inset-0 bg-everblack/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-lg">
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {overlayText && (
              <div className="text-everwhite text-xl font-bold mb-2 drop-shadow-lg">
                {overlayText}
              </div>
            )}
            {overlayIcon && <div className="mb-2">{overlayIcon}</div>}
            <div className="w-12 h-1 bg-everpurple rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
