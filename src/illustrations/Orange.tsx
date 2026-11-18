/**
 * Stilisierte Orange (eigene Zeichnung):
 *  - <OrangeSphere>: rotierende Kugel mit Poren (echte 3D-Projektion)
 *  - <OrangeSection>: Querschnitt, der in geometrische Schichten zerfällt
 */
import React from "react";
import { random } from "remotion";
import { COLORS } from "../design/theme";

const PORES = new Array(420).fill(0).map((_, i) => {
  // gleichmässig auf der Kugel verteilt (Fibonacci-Kugel) + etwas Zufall
  const n = 420;
  const y = 1 - (i / (n - 1)) * 2;
  const lat = Math.asin(y) + (random(`pore-lat-${i}`) - 0.5) * 0.06;
  const lon = i * 2.39996323 + (random(`pore-lon-${i}`) - 0.5) * 0.1;
  return { lat, lon, size: 0.6 + random(`pore-s-${i}`) * 1.3 };
});

export const OrangeSphere: React.FC<{
  size: number;
  /** Drehung in Radiant */
  rotation: number;
  tilt?: number;
  glow?: number;
}> = ({ size, rotation, tilt = 0.32, glow = 1 }) => {
  const R = 200;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  return (
    <svg viewBox="-260 -260 520 520" width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="orBody" cx="36%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#FFC98A" />
          <stop offset="28%" stopColor="#FFA040" />
          <stop offset="62%" stopColor={COLORS.orange} />
          <stop offset="88%" stopColor={COLORS.orangeDeep} />
          <stop offset="100%" stopColor="#7A3204" />
        </radialGradient>
        <radialGradient id="orHalo">
          <stop offset="55%" stopColor={COLORS.orange} stopOpacity={0.32} />
          <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="orSpec" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
        <clipPath id="orClip">
          <circle r={R} />
        </clipPath>
      </defs>
      <circle r={R * 1.3} fill="url(#orHalo)" opacity={glow} />
      <circle r={R} fill="url(#orBody)" />
      <g clipPath="url(#orClip)">
        {PORES.map((p, i) => {
          const lon = p.lon + rotation;
          // Kugel → 3D
          const x = Math.cos(p.lat) * Math.sin(lon);
          const y0 = Math.sin(p.lat);
          const z0 = Math.cos(p.lat) * Math.cos(lon);
          // Neigung um x-Achse
          const y = y0 * ct - z0 * st;
          const z = y0 * st + z0 * ct;
          if (z <= 0.02) return null;
          const shade = 0.25 + 0.55 * z;
          return (
            <ellipse
              key={i}
              cx={x * R}
              cy={-y * R}
              rx={p.size * (0.4 + 0.6 * Math.abs(Math.cos(Math.asin(Math.min(1, Math.abs(x))))))}
              ry={p.size * (0.4 + 0.6 * z)}
              fill="#8A3A06"
              opacity={shade * 0.55}
            />
          );
        })}
        {/* Schattenseite */}
        <circle r={R} fill="url(#orShade)" />
      </g>
      <defs>
        <radialGradient id="orShade" cx="30%" cy="28%" r="85%">
          <stop offset="60%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
        </radialGradient>
      </defs>
      {/* Glanzlicht */}
      <ellipse cx={-70} cy={-84} rx={62} ry={40} fill="url(#orSpec)" transform="rotate(-28 -70 -84)" />
      {/* Randlicht rechts */}
      <path d={`M ${R * 0.62} ${-R * 0.78} A ${R} ${R} 0 0 1 ${R * 0.7} ${R * 0.71}`} fill="none" stroke="#FFD4A3" strokeOpacity={0.35} strokeWidth={3} />
      {/* Stielansatz */}
      <g transform={`translate(${Math.sin(rotation) * 8}, ${-R * Math.cos(tilt) + 6})`}>
        <ellipse rx={13} ry={6} fill="#5E7A2E" />
        <circle r={4} fill="#3F5520" />
      </g>
    </svg>
  );
};

/** Pfad für ein Orangen-Segment (Keil mit abgerundeter Aussenkante). */
const segmentPath = (a0: number, a1: number, r0: number, r1: number) => {
  const p = (a: number, r: number) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
  const mid = (a0 + a1) / 2;
  return `M ${p(a0, r0)} L ${p(a0 + 0.015, r1 * 0.96)} Q ${p(mid, r1 * 1.07)} ${p(a1 - 0.015, r1 * 0.96)} L ${p(a1, r0)} Q ${p(mid, r0 * 0.9)} ${p(a0, r0)} Z`;
};

export const OrangeSection: React.FC<{
  size: number;
  /** 0 = geschlossen, 1 = Segmente weit auseinander */
  explode: number;
  /** Drehung der Segmente in Radiant */
  rotation?: number;
  /** Sichtbarkeit der äusseren Ringe */
  rings?: number;
  segmentOpacity?: number;
  segments?: number;
  /** Für helle Hintergründe */
  light?: boolean;
}> = ({ size, explode, rotation = 0, rings = 1, segmentOpacity = 1, segments = 10, light = false }) => {
  const gap = (Math.PI * 2) / segments;
  return (
    <svg viewBox="-260 -260 520 520" width={size} height={size} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`segGrad${light ? "L" : ""}`} cx="0" cy="0" r="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE0B8" />
          <stop offset="35%" stopColor={COLORS.orangeLight} />
          <stop offset="100%" stopColor={COLORS.orange} />
        </radialGradient>
      </defs>
      {/* Schale */}
      <g opacity={rings} transform={`rotate(${(rotation * 180) / Math.PI * -0.5}) scale(${1 + explode * 0.55})`}>
        <circle r={214} fill="none" stroke={COLORS.orange} strokeWidth={24} opacity={1 - explode * 0.6} />
        <circle r={198} fill="none" stroke="#FFE7CC" strokeWidth={8} opacity={(1 - explode) * 0.85} />
      </g>
      {/* Segmente */}
      <g transform={`rotate(${(rotation * 180) / Math.PI})`} opacity={segmentOpacity}>
        {new Array(segments).fill(0).map((_, i) => {
          const a0 = i * gap + 0.03;
          const a1 = (i + 1) * gap - 0.03;
          const mid = (a0 + a1) / 2;
          const d = explode * (150 + random(`seg-d-${i}`) * 60);
          const spin = explode * (random(`seg-r-${i}`) - 0.5) * 50;
          const tx = Math.cos(mid) * d;
          const ty = Math.sin(mid) * d;
          const cx = Math.cos(mid) * 110;
          const cy = Math.sin(mid) * 110;
          return (
            <g key={i} transform={`translate(${tx} ${ty}) rotate(${spin} ${cx} ${cy})`}>
              <path d={segmentPath(a0, a1, 26, 186)} fill={`url(#segGrad${light ? "L" : ""})`} />
              {/* feine Fruchtbläschen */}
              {[0.35, 0.55, 0.75].map((f, k) => (
                <path
                  key={k}
                  d={`M ${Math.cos(mid - 0.12) * 186 * f} ${Math.sin(mid - 0.12) * 186 * f} Q ${Math.cos(mid) * 186 * (f + 0.06)} ${Math.sin(mid) * 186 * (f + 0.06)} ${Math.cos(mid + 0.12) * 186 * f} ${Math.sin(mid + 0.12) * 186 * f}`}
                  fill="none"
                  stroke="#FFF3E2"
                  strokeOpacity={0.35}
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}
      </g>
      <circle r={22 * (1 - explode)} fill="#FFF1DF" opacity={rings} />
    </svg>
  );
};
