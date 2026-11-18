/**
 * <Enter> – blendet beliebige Inhalte elegant ein (und optional aus).
 * Bewegung aus einer Richtung, Unschärfe → scharf, leichte Skalierung.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, type SpringConfig } from "remotion";
import { EASE, SPRING } from "../design/theme";
import { ramp, springAt } from "./anim";
import type { Direction } from "./Reveal";

export type EnterProps = {
  start: number;
  from?: Direction;
  /** Weg in px. */
  distance?: number;
  blur?: number;
  scaleFrom?: number;
  config?: Partial<SpringConfig>;
  exitStart?: number;
  exitDuration?: number;
  /** Wohin beim Ausblenden (px, y-Richtung). */
  exitY?: number;
  exitScale?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const Enter: React.FC<EnterProps> = ({
  start,
  from = "bottom",
  distance = 40,
  blur = 10,
  scaleFrom = 1,
  config = SPRING.smooth,
  exitStart,
  exitDuration = 18,
  exitY = -20,
  exitScale = 1,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, start, config);
  const e = exitStart === undefined ? 0 : ramp(frame, exitStart, exitDuration, EASE.in);

  const d = (1 - p) * distance;
  let tx = 0;
  let ty = 0;
  if (from === "bottom") ty = d;
  if (from === "top") ty = -d;
  if (from === "left") tx = -d;
  if (from === "right") tx = d;
  ty += e * exitY;

  const scale = (scaleFrom + (1 - scaleFrom) * p) * (1 + (exitScale - 1) * e);
  const b = (1 - p) * blur + e * blur * 0.6;
  const opacity = Math.min(1, p * 1.5) * (1 - e);

  return (
    <div
      style={{
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        opacity,
        filter: b > 0.05 ? `blur(${b}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
