/**
 * Atmosphäre: Hintergrund-Licht, Leuchtpunkte, Partikel, Filmkorn, Vignette.
 */
import React from "react";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../design/theme";

/** Dunkler Hintergrund mit weichem Lichtkegel. */
export const Backdrop: React.FC<{
  color?: string;
  light?: string;
  /** Position des Lichts in % */
  x?: number;
  y?: number;
  /** Grösse des Lichtkegels in % */
  size?: number;
  intensity?: number;
}> = ({ color = COLORS.bg, light = COLORS.bgLift, x = 50, y = 45, size = 70, intensity = 1 }) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <AbsoluteFill
      style={{
        opacity: intensity,
        background: `radial-gradient(ellipse ${size}% ${size * 0.9}% at ${x}% ${y}%, ${light} 0%, ${color} 100%)`,
      }}
    />
  </AbsoluteFill>
);

/** Weicher Leuchtpunkt (ohne teure Filter – nur Verlauf). */
export const Glow: React.FC<{
  x: number;
  y: number;
  size: number;
  color?: string;
  opacity?: number;
  core?: boolean;
}> = ({ x, y, size, color = COLORS.orange, opacity = 1, core = false }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      opacity,
      background: core
        ? `radial-gradient(circle, #FFF6EA 0%, #FFE2BE 5%, ${color} 11%, ${color}99 20%, ${color}4D 32%, ${color}1F 46%, ${color}0A 58%, ${color}00 70%)`
        : `radial-gradient(circle, ${color}80 0%, ${color}4D 16%, ${color}26 32%, ${color}0D 50%, ${color}00 70%)`,
      pointerEvents: "none",
    }}
  />
);

/** Schwebende Partikel (z. B. Staub im Licht, Moleküle, Sterne). */
export const Particles: React.FC<{
  count: number;
  seed: string;
  color?: string;
  minSize?: number;
  maxSize?: number;
  /** px pro Frame nach oben (negativ = nach unten). */
  speed?: number;
  opacity?: number;
  area?: { x: number; y: number; w: number; h: number };
  twinkle?: boolean;
  /** Globale Sichtbarkeit 0–1 */
  fade?: number;
}> = ({
  count,
  seed,
  color = COLORS.white,
  minSize = 2,
  maxSize = 5,
  speed = 0.3,
  opacity = 0.5,
  area = { x: 0, y: 0, w: 1920, h: 1080 },
  twinkle = true,
  fade = 1,
}) => {
  const frame = useCurrentFrame();
  if (fade <= 0.001) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fade }}>
      {new Array(count).fill(0).map((_, i) => {
        const r1 = random(`${seed}-x-${i}`);
        const r2 = random(`${seed}-y-${i}`);
        const r3 = random(`${seed}-s-${i}`);
        const r4 = random(`${seed}-p-${i}`);
        const depth = 0.35 + r3 * 0.65;
        const size = minSize + (maxSize - minSize) * r3;
        const travel = frame * speed * depth;
        const y = area.y + ((((r2 * area.h - travel) % area.h) + area.h) % area.h);
        const x = area.x + r1 * area.w + Math.sin(frame / (90 + r4 * 80) + r4 * 6.28) * 14 * depth;
        const tw = twinkle ? 0.55 + 0.45 * Math.sin(frame / (20 + r4 * 30) + r1 * 6.28) : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: opacity * tw * depth,
              boxShadow: size > 3 ? `0 0 ${size * 3}px ${color}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Feines, bewegtes Filmkorn (kleine Textur, sehr günstig zu rendern). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const ox = Math.floor(random(`grain-x-${step}`) * 256);
  const oy = Math.floor(random(`grain-y-${step}`) * 256);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity,
        backgroundImage: `url(${staticFile("textures/grain.png")})`,
        backgroundSize: "256px 256px",
        backgroundPosition: `${ox}px ${oy}px`,
        mixBlendMode: "overlay",
      }}
    />
  );
};

/** Dunkle Ränder für einen filmischen Look. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.65, color = "0,0,0" }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
    }}
  />
);
