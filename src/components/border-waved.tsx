"use client";

import { motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

/**
 * Componente BorderWaved - Cria um efeito de borda ondulada animada realista
 *
 * @example
 * // Uso básico sem animação
 * <BorderWaved>
 *   <div>Seu conteúdo aqui</div>
 * </BorderWaved>
 *
 * @example
 * // Com animação de onda realista
 * <BorderWaved animated={true}>
 *   <header>Seu header aqui</header>
 * </BorderWaved>
 *
 * @example
 * // Com borda preta
 * <BorderWaved
 *   animated={true}
 *   showBorder={true}
 *   borderColor="#000000"
 * >
 *   <div>Conteúdo com borda</div>
 * </BorderWaved>
 *
 * @example
 * // Borda mais escura da cor principal
 * <BorderWaved
 *   animated={true}
 *   showBorder={true}
 *   borderColor="#2f2044"
 *   waveFill="#7539db"
 * >
 *   <div>Conteúdo personalizado</div>
 * </BorderWaved>
 */

interface BorderWavedProps {
  children: React.ReactNode;
  /** Altura da onda em classes Tailwind (ex: "h-14", "h-20") */
  waveHeight?: string;
  /** Se deve animar a onda */
  animated?: boolean;
  /** Duração da animação em segundos */
  animationDuration?: number;
  /** Intensidade da animação (0-1) - controla amplitude da onda */
  animationIntensity?: number;
  /** Cor de preenchimento da onda */
  waveFill?: string;
  /** Se deve mostrar borda na onda */
  showBorder?: boolean;
  /** Cor da borda da onda */
  borderColor?: string;
  /** Largura da borda em pixels */
  borderWidth?: number;
  /** Classes CSS adicionais para o container */
  className?: string;
  /** Classes CSS adicionais para o SVG */
  svgClassName?: string;
}

export function BorderWaved({
  children,
  waveHeight = "h-14",
  animated = false,
  animationDuration = 4,
  animationIntensity = 0.3,
  waveFill = "var(--background)",
  showBorder = false,
  borderColor = "var(--border)",
  borderWidth = 2,
  className = "",
  svgClassName = "",
}: BorderWavedProps) {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const generateWavePath = useCallback(
    (phase: number = 0, intensity: number = animationIntensity) => {
      const baseY = 32;
      const amplitude = 20 * intensity; // Amplitude maior para efeito mais visível

      // Cria pontos de onda usando função seno para movimento natural
      const points = [];
      const numWaves = 3; // Número de ondas completas
      const numPoints = 12; // Mais pontos para suavidade

      for (let i = 0; i <= numPoints; i++) {
        const x = (1440 / numPoints) * i;
        // Onda senoidal com fase para movimento natural
        const waveY =
          Math.sin((i / numPoints) * Math.PI * 2 * numWaves + phase) *
          amplitude;
        // Adiciona variação secundária para realismo
        const secondaryWave =
          Math.sin((i / numPoints) * Math.PI * 8 + phase * 2) *
          (amplitude * 0.3);
        const y = baseY + waveY + secondaryWave;

        points.push(`${x},${y}`);
      }

      // Cria path suave usando curvas quadráticas
      let path = `M${points[0]}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i].split(",").map(Number);
        const next = points[i + 1].split(",").map(Number);

        // Ponto de controle para curva suave
        const cpX = current[0] + (next[0] - current[0]) * 0.5;
        const cpY = current[1] + (next[1] - current[1]) * 0.5;

        path += ` Q${cpX},${cpY} ${next[0]},${next[1]}`;
      }

      path += " V64 H0 Z";
      return path;
    },
    [animationIntensity]
  );

  // Gera a borda da onda (ligeiramente acima da onda principal)
  const generateBorderPath = useCallback(
    (phase: number = 0, intensity: number = animationIntensity) => {
      const baseY = 32 - borderWidth; // Borda fica acima da onda principal
      const amplitude = 23 * intensity; // Mesmo amplitude da onda principal

      // Cria pontos de onda usando função seno para movimento natural
      const points = [];
      const numWaves = 3; // Número de ondas completas
      const numPoints = 12; // Mais pontos para suavidade

      for (let i = 0; i <= numPoints; i++) {
        const x = (1440 / numPoints) * i;
        // Onda senoidal com fase para movimento natural
        const waveY =
          Math.sin((i / numPoints) * Math.PI * 2 * numWaves + phase) *
          amplitude;
        // Adiciona variação secundária para realismo
        const secondaryWave =
          Math.sin((i / numPoints) * Math.PI * 8 + phase * 2) *
          (amplitude * 0.3);
        const y = baseY + waveY + secondaryWave;

        points.push(`${x},${y}`);
      }

      // Cria path suave usando curvas quadráticas
      let path = `M${points[0]}`;

      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i].split(",").map(Number);
        const next = points[i + 1].split(",").map(Number);

        // Ponto de controle para curva suave
        const cpX = current[0] + (next[0] - current[0]) * 0.5;
        const cpY = current[1] + (next[1] - current[1]) * 0.5;

        path += ` Q${cpX},${cpY} ${next[0]},${next[1]}`;
      }

      path += ` V${32 - borderWidth} H0 Z`; // Fecha no topo da borda
      return path;
    },
    [animationIntensity, borderWidth]
  );

  // Animação realista da onda que simula movimento da água
  useEffect(() => {
    if (!animated || !isVisible) {
      // Quando não está animando ou página não está em foco, volta ao estado neutro
      controls.set({ d: generateWavePath(0, 0) });
      return;
    }

    const animateWave = async () => {
      const baseDuration = animationDuration;

      while (animated && isVisible) {
        // Ciclo completo de uma onda: subida → pico → descida → vale

        // Fase 1: Onda começando a subir (intensidade crescente)
        await controls.start({
          d: generateWavePath(0, animationIntensity * 0.3),
          transition: { duration: baseDuration * 0.2, ease: "easeInOut" },
        });

        // Fase 2: Onda no meio da subida (intensidade média)
        await controls.start({
          d: generateWavePath(Math.PI * 0.25, animationIntensity * 0.6),
          transition: { duration: baseDuration * 0.15, ease: "easeInOut" },
        });

        // Fase 3: Onda no pico (intensidade máxima)
        await controls.start({
          d: generateWavePath(Math.PI * 0.5, animationIntensity),
          transition: { duration: baseDuration * 0.2, ease: "easeInOut" },
        });

        // Fase 4: Onda começando a descer
        await controls.start({
          d: generateWavePath(Math.PI * 0.75, animationIntensity * 0.8),
          transition: { duration: baseDuration * 0.15, ease: "easeInOut" },
        });

        // Fase 5: Onda na descida (intensidade diminuindo)
        await controls.start({
          d: generateWavePath(Math.PI, animationIntensity * 0.4),
          transition: { duration: baseDuration * 0.2, ease: "easeInOut" },
        });

        // Fase 6: Onda no vale (intensidade mínima)
        await controls.start({
          d: generateWavePath(Math.PI * 1.25, animationIntensity * 0.1),
          transition: { duration: baseDuration * 0.1, ease: "easeInOut" },
        });

        // Fase 7: Onda voltando ao início do ciclo
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
      {/* Conteúdo principal */}
      <div className="relative z-10">{children}</div>

      {/* SVG da onda com animação realista */}
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
        {/* Borda da onda (renderiza primeiro para ficar atrás) */}
        {showBorder && (
          <motion.path
            d={generateBorderPath(0, 0)}
            fill={borderColor}
            animate={controls}
          />
        )}

        {/* Onda principal */}
        <motion.path
          d={generateWavePath(0, 0)}
          fill={waveFill}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
}
