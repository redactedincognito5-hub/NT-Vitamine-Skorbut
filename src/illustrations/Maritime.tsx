/**
 * Maritime Illustrationen (eigene Gestaltung, per Code gezeichnet):
 * Himmel, Mond, Sterne, Wolken, Meer mit Wellenschichten, Segelschiff.
 */
import React from "react";
import { AbsoluteFill, interpolateColors, random, useCurrentFrame } from "remotion";
import { COLORS } from "../design/theme";

/* ------------------------------------------------------------------ */
/* Wellen                                                               */
/* ------------------------------------------------------------------ */

export type WaveLayer = {
  /** Grundhöhe (px vom oberen Rand) */
  base: number;
  amp: number;
  /** Wellenlänge in px */
  length: number;
  speed: number;
  color: string;
  seed: number;
};

/** Höhe einer Welle an Position x (für Schiff, das auf den Wellen schaukelt). */
export const waveY = (layer: WaveLayer, x: number, frame: number) => {
  const k = (Math.PI * 2) / layer.length;
  const t = frame * layer.speed;
  return (
    layer.base +
    layer.amp * Math.sin(x * k + t + layer.seed) +
    layer.amp * 0.45 * Math.sin(x * k * 2.3 - t * 1.4 + layer.seed * 2) +
    layer.amp * 0.2 * Math.sin(x * k * 5.1 + t * 2.1 + layer.seed * 3)
  );
};

const wavePath = (layer: WaveLayer, frame: number, width: number, height: number) => {
  const step = 24;
  let d = `M 0 ${height} L 0 ${waveY(layer, 0, frame).toFixed(1)}`;
  for (let x = step; x <= width + step; x += step) {
    d += ` L ${x} ${waveY(layer, x, frame).toFixed(1)}`;
  }
  d += ` L ${width + step} ${height} Z`;
  return d;
};

const crestPath = (layer: WaveLayer, frame: number, width: number) => {
  const step = 24;
  let d = `M -10 ${waveY(layer, -10, frame).toFixed(1)}`;
  for (let x = step; x <= width + step; x += step) {
    d += ` L ${x} ${waveY(layer, x, frame).toFixed(1)}`;
  }
  return d;
};

export const OCEAN_LAYERS = (horizon: number): WaveLayer[] => [
  { base: horizon + 6, amp: 3, length: 380, speed: 0.012, color: "#141B27", seed: 0.3 },
  { base: horizon + 40, amp: 6, length: 520, speed: 0.016, color: "#101724", seed: 1.7 },
  { base: horizon + 110, amp: 10, length: 700, speed: 0.02, color: "#0C121D", seed: 2.9 },
  { base: horizon + 210, amp: 16, length: 900, speed: 0.024, color: "#090E17", seed: 4.1 },
  { base: horizon + 330, amp: 22, length: 1100, speed: 0.028, color: "#070B12", seed: 5.3 },
];

export const Ocean: React.FC<{
  horizon?: number;
  /** 0 = Nacht, 1 = Morgendämmerung */
  dawn?: number;
  /** Mondlicht-Reflexion */
  moonX?: number;
  shimmer?: number;
  /** Zusätzliche Elemente zwischen Wellenschichten (z. B. Schiff), Index = nach Schicht */
  insertAfterLayer?: number;
  insert?: React.ReactNode;
}> = ({ horizon = 640, dawn = 0, moonX = 1380, shimmer = 1, insertAfterLayer = 2, insert }) => {
  const frame = useCurrentFrame();
  const layers = OCEAN_LAYERS(horizon);
  const dawnTint = ["#2A3550", "#24304A", "#1D2840", "#172036", "#121A2C"];
  return (
    <AbsoluteFill>
      {/* Lichtreflexion des Mondes */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {layers.map((layer, i) => (
          <React.Fragment key={i}>
            <path d={wavePath(layer, frame, 1920, 1080)} fill={interpolateColors(dawn, [0, 1], [layer.color, dawnTint[i]])} />
            {/* feine Lichtkante auf jeder Welle */}
            <path
              d={crestPath(layer, frame, 1920)}
              fill="none"
              stroke={interpolateColors(dawn, [0, 1], ["#8FA6C8", "#FFC48A"])}
              strokeOpacity={0.05 + i * 0.012}
              strokeWidth={1.2}
            />
            {i === 1 && shimmer > 0 ? <MoonShimmer x={moonX} horizon={horizon} opacity={shimmer} /> : null}
            {i === insertAfterLayer ? insert : null}
          </React.Fragment>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Glitzernde Mondspur auf dem Wasser. */
const MoonShimmer: React.FC<{ x: number; horizon: number; opacity: number }> = ({ x, horizon, opacity }) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {new Array(46).fill(0).map((_, i) => {
        const r = random(`shimmer-${i}`);
        const y = horizon + 20 + i * 9 + (r - 0.5) * 6;
        const spread = 20 + i * 5.5;
        const cx = x + Math.sin(frame / 22 + i * 1.7) * spread * 0.55 + (r - 0.5) * spread;
        const w = 14 + r * 40 * (1 - i / 60);
        const a = (0.25 + 0.35 * Math.sin(frame / 9 + i * 2.3) ** 2) * (1 - i / 52);
        return <rect key={i} x={cx - w / 2} y={y} width={w} height={1.6} rx={0.8} fill="#DCE6F5" opacity={Math.max(0, a)} />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Himmel                                                               */
/* ------------------------------------------------------------------ */

export const Sky: React.FC<{ horizon?: number; dawn?: number; moonX?: number; moonY?: number; moonOpacity?: number }> = ({
  horizon = 640,
  dawn = 0,
  moonX = 1380,
  moonY = 250,
  moonOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const top = interpolateColors(dawn, [0, 1], ["#04050A", "#1B2236"]);
  const mid = interpolateColors(dawn, [0, 1], ["#0A0E18", "#3B3F52"]);
  const hor = interpolateColors(dawn, [0, 1], ["#18202F", "#E8955A"]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} ${(horizon / 1080) * 70}%, ${hor} ${(horizon / 1080) * 100}%, ${hor} 100%)` }} />
      {/* Sterne */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - dawn * 0.9 }}>
        {new Array(140).fill(0).map((_, i) => {
          const x = random(`star-x-${i}`) * 1920;
          const y = random(`star-y-${i}`) * (horizon - 60);
          const s = random(`star-s-${i}`);
          const tw = 0.5 + 0.5 * Math.sin(frame / (14 + s * 30) + i);
          return <circle key={i} cx={x} cy={y} r={0.5 + s * 1.4} fill="#E8EEF8" opacity={(0.15 + 0.6 * s) * tw * (1 - y / horizon) + 0.05} />;
        })}
      </svg>
      {/* Mond */}
      <div style={{ position: "absolute", left: moonX - 260, top: moonY - 260, width: 520, height: 520, borderRadius: "50%", opacity: 0.5 * moonOpacity, background: "radial-gradient(circle, rgba(220,230,245,0.35) 0%, rgba(220,230,245,0.08) 35%, rgba(220,230,245,0) 70%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: moonOpacity }}>
        <defs>
          <radialGradient id="moonGrad" cx="40%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#DCE3EE" />
            <stop offset="100%" stopColor="#AEB8C8" />
          </radialGradient>
        </defs>
        <circle cx={moonX} cy={moonY} r={46} fill="url(#moonGrad)" />
        <circle cx={moonX - 12} cy={moonY - 8} r={9} fill="#C3CBD8" opacity={0.45} />
        <circle cx={moonX + 14} cy={moonY + 12} r={6} fill="#C3CBD8" opacity={0.4} />
        <circle cx={moonX + 6} cy={moonY - 20} r={4} fill="#C3CBD8" opacity={0.35} />
      </svg>
      {/* Wolken */}
      {[0, 1, 2, 3].map((i) => {
        const w = 700 + random(`cloud-w-${i}`) * 500;
        const y = 120 + random(`cloud-y-${i}`) * (horizon - 300);
        const x = ((random(`cloud-x-${i}`) * 2600 + frame * (0.25 + i * 0.08)) % 2600) - 600;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * 0.16,
              borderRadius: "50%",
              background: `radial-gradient(ellipse at center, ${interpolateColors(dawn, [0, 1], ["rgba(120,135,160,0.10)", "rgba(255,190,140,0.22)"])} 0%, rgba(0,0,0,0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Segelschiff                                                          */
/* ------------------------------------------------------------------ */

const sail = (cx: number, top: number, bottom: number, wTop: number, wBottom: number, billow: number) =>
  `M ${cx - wTop / 2} ${top} Q ${cx} ${top - 5} ${cx + wTop / 2} ${top} ` +
  `Q ${cx + wBottom / 2 + billow * 0.6} ${(top + bottom) / 2} ${cx + wBottom / 2} ${bottom} ` +
  `Q ${cx} ${bottom + billow} ${cx - wBottom / 2} ${bottom} ` +
  `Q ${cx - wBottom / 2 - billow * 0.6} ${(top + bottom) / 2} ${cx - wTop / 2} ${top} Z`;

/**
 * Stilisiertes Dreimast-Segelschiff (eigene Zeichnung, keine Vorlage).
 * viewBox 0 0 680 470 – Wasserlinie bei y ≈ 440.
 */
export const Ship: React.FC<{ width?: number; lanterns?: number; style?: React.CSSProperties; dawn?: number }> = ({
  width = 680,
  lanterns = 1,
  style,
  dawn = 0,
}) => {
  const frame = useCurrentFrame();
  const billow = 10 + Math.sin(frame / 40) * 2.5;
  const sailTop = interpolateColors(dawn, [0, 1], ["#E9EEF5", "#FFF1E2"]);
  const sailBottom = interpolateColors(dawn, [0, 1], ["#8E99AB", "#D9A982"]);
  const hullLight = interpolateColors(dawn, [0, 1], ["#9FB2CE", "#FFC48A"]);
  const flagWave = (i: number) => Math.sin(frame / 6 + i) * 4;
  const masts = [
    { x: 175, top: 140, sails: [[300, 352, 120, 150], [215, 290, 100, 122], [158, 207, 76, 96]] },
    { x: 330, top: 62, sails: [[268, 352, 172, 206], [170, 258, 140, 166], [96, 162, 104, 132]] },
    { x: 478, top: 112, sails: [[282, 352, 140, 170], [195, 272, 114, 136], [134, 187, 84, 104]] },
  ];
  return (
    <svg viewBox="0 0 680 470" width={width} height={(width * 470) / 680} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C212C" />
          <stop offset="100%" stopColor="#07090D" />
        </linearGradient>
        <linearGradient id="sailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sailTop} stopOpacity={0.92} />
          <stop offset="100%" stopColor={sailBottom} stopOpacity={0.75} />
        </linearGradient>
        <radialGradient id="lanternGlow">
          <stop offset="0%" stopColor="#FFD9A8" stopOpacity={1} />
          <stop offset="30%" stopColor={COLORS.orange} stopOpacity={0.6} />
          <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Takelage (dünne Seile) */}
      <g stroke="#C9D3E2" strokeOpacity={0.28} strokeWidth={1.1} fill="none">
        <path d="M 330 62 L 62 330" />
        <path d="M 330 62 L 478 112" />
        <path d="M 478 112 L 652 300" />
        <path d="M 175 140 L 62 330" />
        <path d="M 175 140 L 330 62" />
        {masts.map((m, i) => (
          <React.Fragment key={i}>
            <path d={`M ${m.x} ${m.top + 30} L ${m.x - 46} 360`} />
            <path d={`M ${m.x} ${m.top + 30} L ${m.x + 46} 360`} />
          </React.Fragment>
        ))}
      </g>

      {/* Masten */}
      {masts.map((m, i) => (
        <rect key={i} x={m.x - 3.5} y={m.top} width={7} height={365 - m.top} rx={2} fill="#2A303C" />
      ))}
      <path d="M 566 338 L 660 296" stroke="#2A303C" strokeWidth={6} strokeLinecap="round" />

      {/* Vorsegel (Klüver) */}
      <path d={`M 482 128 Q ${560 + billow} 230 652 300 L 486 330 Q ${500 + billow * 0.5} 230 482 128 Z`} fill="url(#sailGrad)" opacity={0.9} />

      {/* Rahsegel */}
      {masts.map((m, i) =>
        m.sails.map(([top, bottom, wTop, wBottom], j) => (
          <g key={`${i}-${j}`}>
            <rect x={m.x - wTop / 2 - 6} y={top - 4} width={wTop + 12} height={4} rx={2} fill="#2A303C" />
            <path d={sail(m.x, top, bottom, wTop, wBottom, billow * (0.7 + j * 0.15))} fill="url(#sailGrad)" />
          </g>
        )),
      )}

      {/* Flaggen */}
      {masts.map((m, i) => (
        <path
          key={i}
          d={`M ${m.x} ${m.top} L ${m.x + 26} ${m.top + 6 + flagWave(i)} L ${m.x + 44} ${m.top + 4 + flagWave(i + 1)} L ${m.x} ${m.top + 16} Z`}
          fill={i === 1 ? COLORS.orange : "#C9D3E2"}
          opacity={i === 1 ? 0.95 : 0.5}
        />
      ))}

      {/* Rumpf */}
      <path
        d="M 58 326 L 150 326 L 158 360 L 480 360 Q 530 358 566 336 L 576 344 Q 556 404 500 436 Q 470 448 420 448 L 170 448 Q 110 446 84 420 Q 64 392 58 326 Z"
        fill="url(#hullGrad)"
      />
      {/* Lichtkante (Mondlicht) */}
      <path d="M 158 360 L 480 360 Q 530 358 566 336" fill="none" stroke={hullLight} strokeOpacity={0.55} strokeWidth={1.6} />
      <path d="M 58 326 L 150 326" fill="none" stroke={hullLight} strokeOpacity={0.5} strokeWidth={1.4} />
      <path d="M 86 398 Q 300 404 548 384" fill="none" stroke={hullLight} strokeOpacity={0.18} strokeWidth={4} />

      {/* Fenster mit warmem Licht */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={78 + i * 17} y={346} width={9} height={11} rx={2} fill="#FFB872" opacity={(0.35 + 0.25 * Math.sin(frame / 17 + i)) * lanterns} />
      ))}
      {/* Laterne am Heck */}
      <circle cx={64} cy={312} r={36} fill="url(#lanternGlow)" opacity={0.85 * lanterns} />
      <circle cx={64} cy={312} r={4} fill="#FFE7C4" opacity={lanterns} />
    </svg>
  );
};
