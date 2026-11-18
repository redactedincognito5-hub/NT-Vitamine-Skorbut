/**
 * Grafische Bausteine: Quellenmarker, Kicker, Linien, Callouts.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SPRING } from "../design/theme";
import { ramp, springAt } from "./anim";

/** Dezenter Quellenmarker, z. B. [1, 2] – verweist auf SOURCES.md. */
export const Ref: React.FC<{ ids: readonly number[]; color?: string; size?: number; style?: React.CSSProperties }> = ({
  ids,
  color = COLORS.grey,
  size = 0.42,
  style,
}) => {
  if (!ids.length) return null;
  return (
    <span
      style={{
        fontFamily: FONTS.text,
        fontWeight: 500,
        fontSize: `${size}em`,
        letterSpacing: "0.02em",
        color,
        opacity: 0.75,
        verticalAlign: "super",
        marginLeft: "0.35em",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      [{ids.join(", ")}]
    </span>
  );
};

/** Kleine Überschrift mit Akzentlinie, z. B. «GESCHICHTE». */
export const Kicker: React.FC<{
  text: string;
  start: number;
  color?: string;
  textColor?: string;
  style?: React.CSSProperties;
}> = ({ text, start, color = COLORS.orange, textColor = COLORS.grey, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, start, SPRING.smooth);
  const t = ramp(frame, start + 6, 24);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, ...style }}>
      <div style={{ width: 56 * p, height: 3, borderRadius: 2, background: color }} />
      <div
        style={{
          fontFamily: FONTS.text,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: "0.32em",
          color: textColor,
          opacity: t,
          transform: `translateX(${(1 - t) * -12}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** SVG-Pfad, der sich selbst zeichnet (progress 0–1). */
export const DrawPath: React.FC<
  { d: string; progress: number; stroke?: string; width?: number; opacity?: number } & React.SVGProps<SVGPathElement>
> = ({ d, progress, stroke = COLORS.white, width = 2, opacity = 1, ...rest }) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeDasharray={1}
    strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
    opacity={progress <= 0 ? 0 : opacity}
    {...rest}
  />
);

/**
 * Callout: Punkt am Ziel, Linie zeichnet sich, Text erscheint.
 * Koordinaten in px (Bildschirm).
 */
export const Callout: React.FC<{
  start: number;
  /** Ankerpunkt (am Objekt) */
  ax: number;
  ay: number;
  /** Ende der Linie (beim Text) */
  lx: number;
  ly: number;
  text: string;
  side: "left" | "right";
  color?: string;
  textColor?: string;
  fontSize?: number;
  exitStart?: number;
}> = ({ start, ax, ay, lx, ly, text, side, color = COLORS.orange, textColor = COLORS.white, fontSize = 30, exitStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dot = springAt(frame, fps, start, SPRING.snappy);
  const line = ramp(frame, start + 4, 22);
  const txt = springAt(frame, fps, start + 16, SPRING.smooth);
  const out = exitStart === undefined ? 0 : ramp(frame, exitStart, 16);
  const vis = 1 - out;
  // Knick: erst diagonal, dann horizontal
  const kx = lx + (side === "left" ? 40 : -40);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: vis }}>
        <circle cx={ax} cy={ay} r={7 * dot} fill={color} />
        <circle cx={ax} cy={ay} r={18 * dot} fill="none" stroke={color} strokeOpacity={0.35 * dot} strokeWidth={1.5} />
        <DrawPath d={`M ${ax} ${ay} L ${kx} ${ly} L ${lx} ${ly}`} progress={line} stroke={color} width={1.6} opacity={0.8} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: ly - fontSize * 0.68,
          ...(side === "left" ? { right: 1920 - lx + 16 } : { left: lx + 16 }),
          fontFamily: FONTS.text,
          fontWeight: 600,
          fontSize,
          color: textColor,
          whiteSpace: "nowrap",
          opacity: Math.min(1, txt * 1.5) * vis,
          transform: `translateX(${(1 - txt) * (side === "left" ? 24 : -24)}px)`,
          filter: txt < 0.98 ? `blur(${(1 - txt) * 8}px)` : undefined,
        }}
      >
        {text}
      </div>
    </>
  );
};

/** Dünne horizontale Linie, die von der Mitte aus wächst. */
export const Hairline: React.FC<{ width: number; progress: number; color?: string; style?: React.CSSProperties }> = ({
  width,
  progress,
  color = COLORS.hairline,
  style,
}) => <div style={{ width: width * progress, height: 1.5, background: color, margin: "0 auto", ...style }} />;
