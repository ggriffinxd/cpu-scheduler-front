"use client";

import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface BorderWavedProps {
  children: React.ReactNode;
  waveHeight?: string;
  animated?: boolean;
  animationDuration?: number;
  animationIntensity?: number;
  waveFill?: string;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
  className?: string;
  svgClassName?: string;
  extendBorder?: boolean;
}

export function BorderWaved({
  children,
  waveHeight = "h-14",
  animated = false,
  animationDuration = 4,
  animationIntensity = 0.3,
  waveFill,
  showBorder = false,
  borderColor = "var(--border)",
  borderWidth = 2,
  className = "",
  svgClassName = "",
  extendBorder = false,
}: BorderWavedProps) {
  const finalWaveFill =
    waveFill || (extendBorder ? borderColor : "var(--background)");
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const handleVisibilityChange = () => {
      if (isMountedRef.current) {
        setIsVisible(!document.hidden);
      }
    };

    const handleFocus = () => {
      if (isMountedRef.current) {
        setIsVisible(true);
      }
    };
    const handleBlur = () => {
      if (isMountedRef.current) {
        setIsVisible(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      isMountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const generateWavePath = useCallback(
    (phase: number = 0, intensity: number = animationIntensity) => {
      const baseY = 32;
      const amplitude = 20 * intensity;

      const points = [];
      const numWaves = 3;
      const numPoints = 12;

      for (let i = 0; i <= numPoints; i++) {
        const x = (1440 / numPoints) * i;
        const waveY =
          Math.sin((i / numPoints) * Math.PI * 2 * numWaves + phase) *
          amplitude;
        const secondaryWave =
          Math.sin((i / numPoints) * Math.PI * 8 + phase * 2) *
          (amplitude * 0.3);
        const y = baseY + waveY + secondaryWave;

        points.push(`${x},${y}`);
      }

      let path = `M${points[0]}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i].split(",").map(Number);
        const next = points[i + 1].split(",").map(Number);

        const cpX = current[0] + (next[0] - current[0]) * 0.5;
        const cpY = current[1] + (next[1] - current[1]) * 0.5;

        path += ` Q${cpX},${cpY} ${next[0]},${next[1]}`;
      }

      path += " V64 H0 Z";
      return path;
    },
    [animationIntensity]
  );

  const generateBorderPath = useCallback(
    (phase: number = 0, intensity: number = animationIntensity) => {
      const baseY = 32 - borderWidth;
      const amplitude = 23 * intensity;

      const points = [];
      const numWaves = 3;
      const numPoints = 12;

      for (let i = 0; i <= numPoints; i++) {
        const x = (1440 / numPoints) * i;
        const waveY =
          Math.sin((i / numPoints) * Math.PI * 2 * numWaves + phase) *
          amplitude;
        const secondaryWave =
          Math.sin((i / numPoints) * Math.PI * 8 + phase * 2) *
          (amplitude * 0.3);
        const y = baseY + waveY + secondaryWave;

        points.push(`${x},${y}`);
      }

      let path = `M${points[0]}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i].split(",").map(Number);
        const next = points[i + 1].split(",").map(Number);

        const cpX = current[0] + (next[0] - current[0]) * 0.5;
        const cpY = current[1] + (next[1] - current[1]) * 0.5;

        path += ` Q${cpX},${cpY} ${next[0]},${next[1]}`;
      }

      path += ` V${32 - borderWidth} H0 Z`;
      return path;
    },
    [animationIntensity, borderWidth]
  );

  useEffect(() => {
    if (!animated || !isVisible) {
      controls.set({ d: generateWavePath(0, 0) });
      return;
    }

    const animateWave = async () => {
      const baseDuration = animationDuration;

      while (animated && isVisible && isMountedRef.current) {
        if (!isMountedRef.current) break;

        await controls.start({
          d: generateWavePath(0, animationIntensity * 0.3),
          transition: { duration: baseDuration * 0.2, ease: "easeInOut" },
        });

        if (!isMountedRef.current) break;
        await controls.start({
          d: generateWavePath(Math.PI * 0.25, animationIntensity * 0.6),
          transition: { duration: baseDuration * 0.15, ease: "easeInOut" },
        });

        if (!isMountedRef.current) break;
        await controls.start({
          d: generateWavePath(Math.PI * 0.5, animationIntensity),
          transition: { duration: baseDuration * 0.2, ease: "easeInOut" },
        });

        if (!isMountedRef.current) break;
        await controls.start({
          d: generateWavePath(Math.PI * 0.75, animationIntensity * 0.8),
          transition: { duration: baseDuration * 0.15, ease: "easeInOut" },
        });

        if (!isMountedRef.current) break;
        await controls.start({
          d: generateWavePath(Math.PI, animationIntensity * 0.4),
          transition: { duration: baseDuration * 0.2, ease: "easeInOut" },
        });

        if (!isMountedRef.current) break;
        await controls.start({
          d: generateWavePath(Math.PI * 1.25, animationIntensity * 0.1),
          transition: { duration: baseDuration * 0.1, ease: "easeInOut" },
        });

        if (!isMountedRef.current) break;
        await controls.start({
          d: generateWavePath(Math.PI * 1.5, animationIntensity * 0.2),
          transition: { duration: baseDuration * 0.1, ease: "easeInOut" },
        });
      }
    };

    animateWave();
  }, [
    animated,
    animationDuration,
    animationIntensity,
    isVisible,
    controls,
    generateWavePath,
  ]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative z-10">{children}</div>

      <motion.svg
        aria-hidden="true"
        focusable="false"
        className={`pointer-events-none absolute left-0 bottom-0 w-full ${waveHeight} ${svgClassName}`}
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          display: "block",
        }}
        animate={controls}
      >
        {showBorder && (
          <motion.path
            d={generateBorderPath(0, 0)}
            fill={borderColor}
            animate={controls}
          />
        )}

        <motion.path
          d={generateWavePath(0, 0)}
          fill={finalWaveFill}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
}
