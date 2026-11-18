/**
 * Lebensmittel & Proviant – geometrische Illustrationen (eigene Gestaltung).
 * Alle Formen sind per Code gezeichnet, keine fremden Bilder.
 */
import React from "react";
import { COLORS } from "../design/theme";
import { OrangeSection } from "./Orange";

/** Weicher Schatten unter einem Objekt (für helle Szene). */
const Shadow: React.FC<{ y: number; w: number }> = ({ y, w }) => (
  <ellipse cx={0} cy={y} rx={w} ry={w * 0.12} fill="#000" opacity={0.12} />
);

export const Pepper: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="-150 -170 300 340" width={size} height={(size * 340) / 300} style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="pepGrad" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#FF8C6E" />
        <stop offset="40%" stopColor="#E8432E" />
        <stop offset="100%" stopColor="#9E1F14" />
      </radialGradient>
    </defs>
    <Shadow y={150} w={95} />
    <path
      d="M -10 -96 Q -92 -112 -112 -40 Q -128 30 -96 92 Q -76 136 -40 128 Q -18 150 0 132 Q 22 152 44 128 Q 84 136 102 88 Q 128 24 110 -42 Q 90 -110 10 -96 Q 0 -92 -10 -96 Z"
      fill="url(#pepGrad)"
    />
    <path d="M -28 -86 Q -52 0 -36 110" fill="none" stroke="#7E160D" strokeOpacity={0.35} strokeWidth={4} />
    <path d="M 34 -84 Q 52 0 40 112" fill="none" stroke="#7E160D" strokeOpacity={0.3} strokeWidth={4} />
    <ellipse cx={-62} cy={-38} rx={16} ry={40} fill="#FFFFFF" opacity={0.35} transform="rotate(12 -62 -38)" />
    <path d="M -24 -98 Q 0 -122 26 -98 Q 4 -90 -24 -98 Z" fill={COLORS.greenDeep} />
    <path d="M 0 -104 Q -4 -140 18 -158" fill="none" stroke="#3E7A2A" strokeWidth={12} strokeLinecap="round" />
  </svg>
);

export const Kiwi: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="-150 -150 300 320" width={size} height={(size * 320) / 300} style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="kiwiFlesh" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#E9F7C9" />
        <stop offset="30%" stopColor={COLORS.green} />
        <stop offset="85%" stopColor="#5FAE3A" />
        <stop offset="100%" stopColor="#4C8F2C" />
      </radialGradient>
    </defs>
    <Shadow y={150} w={100} />
    <circle r={128} fill="#7A5A33" />
    <circle r={118} fill="url(#kiwiFlesh)" />
    {new Array(28).fill(0).map((_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return <line key={`l${i}`} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 104} y2={Math.sin(a) * 104} stroke="#F2FBE0" strokeOpacity={0.35} strokeWidth={2} />;
    })}
    <ellipse rx={38} ry={30} fill="#F4FBE6" />
    {new Array(22).fill(0).map((_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const r = 50 + (i % 2) * 8;
      return <ellipse key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} rx={4.5} ry={2.4} fill="#1D1A12" transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * r} ${Math.sin(a) * r})`} />;
    })}
  </svg>
);

export const Broccoli: React.FC<{ size: number }> = ({ size }) => {
  const florets: [number, number, number, string][] = [
    [-70, -30, 52, "#4E8F35"],
    [70, -30, 52, "#4E8F35"],
    [0, -70, 62, "#5DA03E"],
    [-34, -10, 50, "#6DAA49"],
    [38, -6, 50, "#62A443"],
    [-92, 12, 36, "#4E8F35"],
    [92, 14, 36, "#4E8F35"],
    [0, -14, 44, "#78B652"],
  ];
  return (
    <svg viewBox="-150 -150 300 320" width={size} height={(size * 320) / 300} style={{ overflow: "visible" }}>
      <Shadow y={150} w={80} />
      <path d="M -30 20 Q -40 100 -46 140 L 46 140 Q 40 100 30 20 Z" fill="#B9DC8F" />
      <path d="M -10 40 Q -60 60 -80 30" fill="none" stroke="#A5CE79" strokeWidth={16} strokeLinecap="round" />
      <path d="M 10 50 Q 60 66 82 34" fill="none" stroke="#A5CE79" strokeWidth={16} strokeLinecap="round" />
      {florets.map(([x, y, r, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={c} />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={x + Math.cos(k * 1.3 + i) * r * 0.45} cy={y + Math.sin(k * 1.3 + i) * r * 0.45} r={r * 0.32} fill="#FFFFFF" opacity={0.07} />
          ))}
          <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.28} fill={COLORS.green} opacity={0.55} />
        </g>
      ))}
    </svg>
  );
};

export const OrangeHalf: React.FC<{ size: number; rotation?: number }> = ({ size, rotation = 0 }) => (
  <div style={{ position: "relative", width: size, height: size * 1.07 }}>
    <svg viewBox="-150 -150 300 320" width={size} height={size * 1.07} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <Shadow y={150} w={100} />
    </svg>
    <div style={{ position: "absolute", left: -0.075 * size, top: -0.105 * size }}>
      <OrangeSection size={size * 1.15} explode={0} rotation={rotation} light />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Proviant-Icons (Linien)                                              */
/* ------------------------------------------------------------------ */

const iconStroke = { fill: "none", stroke: COLORS.white, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconBiscuit: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="-60 -60 120 120" width={size} height={size}>
    <rect x={-44} y={-44} width={88} height={88} rx={14} {...iconStroke} />
    {[-22, 0, 22].map((x) => [-22, 0, 22].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={3.2} fill={COLORS.white} />))}
  </svg>
);

export const IconBarrel: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="-60 -60 120 120" width={size} height={size}>
    <path d="M -30 -48 Q -46 0 -30 48 L 30 48 Q 46 0 30 -48 Z" {...iconStroke} />
    <path d="M -38 -22 L 38 -22 M -40 22 L 40 22" {...iconStroke} />
    <path d="M -6 -48 Q -12 0 -6 48 M 12 -48 Q 18 0 12 48" {...iconStroke} strokeOpacity={0.4} />
  </svg>
);

export const IconCheese: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="-60 -60 120 120" width={size} height={size}>
    <path d="M -48 30 L -48 -2 L 44 -34 L 48 30 Z" {...iconStroke} />
    <path d="M -48 -2 L 48 -2" {...iconStroke} strokeOpacity={0.5} />
    <circle cx={-14} cy={14} r={6} {...iconStroke} />
    <circle cx={20} cy={16} r={4} {...iconStroke} />
  </svg>
);

/** Frucht mit Durchstreichung (progress 0–1). */
export const IconNoFruit: React.FC<{ size: number; strike: number }> = ({ size, strike }) => (
  <svg viewBox="-60 -60 120 120" width={size} height={size}>
    <circle cx={0} cy={6} r={36} fill="none" stroke={COLORS.orange} strokeWidth={3} />
    <path d="M 0 -30 Q 4 -44 16 -50" fill="none" stroke={COLORS.green} strokeWidth={3} strokeLinecap="round" />
    <path d="M 4 -36 Q 22 -44 30 -32 Q 16 -26 4 -36 Z" fill={COLORS.green} />
    <line x1={-46} y1={-46} x2={-46 + 92 * strike} y2={-46 + 92 * strike} stroke={COLORS.white} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Zitrone (für die Zeitleiste). */
export const Lemon: React.FC<{ size: number; glow?: number }> = ({ size, glow = 1 }) => (
  <svg viewBox="-80 -60 160 120" width={size} height={(size * 120) / 160} style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="lemGrad" cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#FFF1B8" />
        <stop offset="45%" stopColor="#FFD24A" />
        <stop offset="100%" stopColor="#D99A12" />
      </radialGradient>
      <radialGradient id="lemGlow">
        <stop offset="0%" stopColor="#FFD24A" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#FFD24A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse rx={90} ry={70} fill="url(#lemGlow)" opacity={glow} />
    <path d="M -64 0 Q -60 -40 0 -42 Q 60 -40 64 0 Q 60 40 0 42 Q -60 40 -64 0 Z" fill="url(#lemGrad)" />
    <path d="M -64 0 L -74 -2 L -64 -6 Z M 64 0 L 74 2 L 64 6 Z" fill="#D99A12" />
    <ellipse cx={-22} cy={-20} rx={18} ry={8} fill="#FFFFFF" opacity={0.4} transform="rotate(-12 -22 -20)" />
  </svg>
);
