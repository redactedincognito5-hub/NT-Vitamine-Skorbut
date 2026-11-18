/**
 * <SceneShell> – Rahmen für jede Szene.
 * Sorgt für weiche Überblendungen: Die neue Szene blendet mit einer leichten
 * «Kamerabewegung» ein, während die alte Szene ausblendet.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE } from "../design/theme";
import { TRANSITION } from "../design/timeline";
import { ramp } from "./anim";

export const SceneShell: React.FC<{
  /** Länge der Szene ohne Überblendungs-Nachlauf (Frames). */
  duration: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: React.ReactNode;
}> = ({ duration, fadeIn = true, fadeOut = true, children }) => {
  const frame = useCurrentFrame();
  const inP = fadeIn ? ramp(frame, 0, TRANSITION, EASE.inOut) : 1;
  const outP = fadeOut ? ramp(frame, duration, TRANSITION, EASE.inOut) : 0;
  const scale = (1.035 - 0.035 * inP) * (1 + 0.02 * outP);
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};
