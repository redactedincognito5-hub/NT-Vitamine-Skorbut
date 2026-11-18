/**
 * <Reveal> – animierte Typografie.
 * Blendet Wörter oder Buchstaben gestaffelt ein (Feder + Unschärfe + Richtung)
 * und optional wieder aus.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, type SpringConfig } from "remotion";
import { EASE, SPRING } from "../design/theme";
import { ramp, springAt } from "./anim";

export type Direction = "bottom" | "top" | "left" | "right" | "none";

export type RevealProps = {
  text: string;
  /** Start-Frame (relativ zur Szene). */
  start: number;
  mode?: "words" | "chars";
  /** Verzögerung zwischen zwei Wörtern/Buchstaben in Frames. */
  stagger?: number;
  from?: Direction;
  /** Weg der Einblendung in em (relativ zur Schriftgrösse). */
  distance?: number;
  /** Anfangsunschärfe in px. */
  blur?: number;
  /** Text erscheint aus einer unsichtbaren «Maske» (wie hinter einer Kante). */
  mask?: boolean;
  /** Start-Skalierung jedes Elements (1 = keine). */
  scaleFrom?: number;
  config?: Partial<SpringConfig>;
  exitStart?: number;
  exitDuration?: number;
  exitStagger?: number;
  exitTo?: "up" | "down" | "fade";
  /** Farbe einzelner Wörter, z. B. { "C": "#FF8A24" }. */
  colors?: Record<string, string>;
  style?: React.CSSProperties;
  className?: string;
};

export const Reveal: React.FC<RevealProps> = ({
  text,
  start,
  mode = "words",
  stagger = 4,
  from = "bottom",
  distance = 0.5,
  blur = 12,
  mask = false,
  scaleFrom = 1,
  config = SPRING.smooth,
  exitStart,
  exitDuration = 18,
  exitStagger = 1.5,
  exitTo = "up",
  colors,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const units = mode === "words" ? text.split(" ") : Array.from(text);

  return (
    <div style={{ display: "inline-block", whiteSpace: "nowrap", ...style }}>
      {units.map((unit, i) => {
        const p = springAt(frame, fps, start + i * stagger, config);
        const e = exitStart === undefined ? 0 : ramp(frame, exitStart + i * exitStagger, exitDuration, EASE.in);

        const d = (1 - p) * distance;
        let tx = 0;
        let ty = 0;
        if (from === "bottom") ty = d;
        if (from === "top") ty = -d;
        if (from === "left") tx = -d;
        if (from === "right") tx = d;
        if (exitTo === "up") ty -= e * distance * 0.8;
        if (exitTo === "down") ty += e * distance * 0.8;

        const opacity = Math.min(1, p * 1.6) * (1 - e);
        const b = (1 - p) * blur + e * blur * 0.8;
        const scale = scaleFrom + (1 - scaleFrom) * p;
        const isSpace = unit === " ";
        const color = colors?.[unit.replace(/[.,!?]/g, "")];

        const inner = (
          <span
            style={{
              display: "inline-block",
              transform: `translate(${tx}em, ${ty}em) scale(${scale})`,
              opacity,
              filter: b > 0.05 ? `blur(${b}px)` : undefined,
              color,
              whiteSpace: "pre",
              willChange: "transform, opacity, filter",
            }}
          >
            {isSpace ? " " : unit}
          </span>
        );

        const gap = mode === "words" && i < units.length - 1 ? <span style={{ display: "inline-block", width: "0.26em" }} /> : null;

        if (!mask) {
          return (
            <React.Fragment key={i}>
              {inner}
              {gap}
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "top",
                padding: "0.12em 0.04em",
                margin: "-0.12em -0.04em",
              }}
            >
              {inner}
            </span>
            {gap}
          </React.Fragment>
        );
      })}
    </div>
  );
};
