/**
 * Schematische Biologie-Illustrationen (eigene Gestaltung, bewusst nicht drastisch):
 *  - <TripleHelix>: Kollagen als dreifache Helix
 *  - <CollagenMesh>: Kollagenfasern als stützendes Gerüst im Gewebe
 *  - <Vessel>: feines Blutgefäss mit Wand aus Kollagenfasern
 *  - <Figure>: abstrakte menschliche Figur (für Symptome)
 */
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { COLORS } from "../design/theme";

/* ------------------------------------------------------------------ */
/* Dreifach-Helix                                                       */
/* ------------------------------------------------------------------ */

export const TripleHelix: React.FC<{
  width: number;
  height?: number;
  /** wie viel der Helix gezeichnet ist (0–1) */
  progress?: number;
  amplitude?: number;
  turns?: number;
  /** Phase (Drehung) */
  phase: number;
  colors?: string[];
  /** 1 = stabil, 0 = aufgelöst */
  integrity?: number;
}> = ({ width, height = 220, progress = 1, amplitude = 60, turns = 4, phase, colors = [COLORS.orange, COLORS.white, COLORS.grey], integrity = 1 }) => {
  const segs = 90;
  const items: { x1: number; y1: number; x2: number; y2: number; z: number; c: string }[] = [];
  const cy = height / 2;
  for (let s = 0; s < 3; s++) {
    for (let j = 0; j < segs; j++) {
      const t0 = j / segs;
      const t1 = (j + 1) / segs;
      if (t1 > progress) break;
      const off = (s * Math.PI * 2) / 3;
      const a0 = t0 * turns * Math.PI * 2 + phase + off;
      const a1 = t1 * turns * Math.PI * 2 + phase + off;
      // Bei geringer Stabilität driften die Stränge auseinander
      const loose = (1 - integrity) * (18 + s * 10);
      const drift0 = (1 - integrity) * Math.sin(t0 * 9 + s * 2) * 30;
      const drift1 = (1 - integrity) * Math.sin(t1 * 9 + s * 2) * 30;
      items.push({
        x1: t0 * width,
        y1: cy + Math.sin(a0) * (amplitude + loose) + drift0 + (s - 1) * loose,
        x2: t1 * width,
        y2: cy + Math.sin(a1) * (amplitude + loose) + drift1 + (s - 1) * loose,
        z: Math.cos((a0 + a1) / 2),
        c: colors[s],
      });
    }
  }
  items.sort((a, b) => a.z - b.z);
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {items.map((it, i) => (
        <line
          key={i}
          x1={it.x1}
          y1={it.y1}
          x2={it.x2}
          y2={it.y2}
          stroke={it.c}
          strokeWidth={5 + 4 * it.z}
          strokeLinecap="round"
          opacity={(0.35 + 0.65 * ((it.z + 1) / 2)) * (0.4 + 0.6 * integrity)}
        />
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Kollagen-Gerüst                                                      */
/* ------------------------------------------------------------------ */

export const CollagenMesh: React.FC<{
  width: number;
  height: number;
  /** wie weit das Gerüst aufgebaut ist (0–1) */
  build: number;
  /** 1 = stabil, 0 = geschwächt */
  integrity?: number;
  color?: string;
  cellColor?: string;
  showCells?: boolean;
}> = ({ width, height, build, integrity = 1, color = COLORS.orange, cellColor = COLORS.white, showCells = true }) => {
  const frame = useCurrentFrame();
  const fibres = 22;
  const weak = 1 - integrity;
  const paths: { d: string; o: number; w: number; dash?: string }[] = [];
  for (let i = 0; i < fibres; i++) {
    const r = random(`fib-${i}`);
    const horizontal = i % 2 === 0;
    const pos = ((i + 0.5) / fibres) * (horizontal ? height : width);
    const p = Math.max(0, Math.min(1, build * 1.6 - (i / fibres) * 0.6));
    if (p <= 0) continue;
    let d = "";
    const n = 24;
    for (let k = 0; k <= n; k++) {
      const t = (k / n) * p;
      const sag = weak * Math.sin(t * Math.PI) * (40 + r * 50);
      const wobble = Math.sin(t * 7 + r * 6 + frame / 50) * (6 + weak * 10);
      const x = horizontal ? t * width : pos + wobble;
      const y = horizontal ? pos + wobble + sag : t * height + sag * 0.3;
      d += `${k === 0 ? "M" : " L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    // bei Mangel «reissen» einzelne Fasern (Lücken)
    const broken = weak > 0.05 && r < 0.2 + weak * 0.5;
    paths.push({
      d,
      o: (0.35 + r * 0.4) * (1 - weak * 0.55),
      w: 2 + r * 2.5,
      dash: broken ? `${(1 - weak) * 60 + 20} ${weak * 70 + 6}` : undefined,
    });
  }
  const cells = showCells
    ? new Array(16).fill(0).map((_, i) => {
        const cx = (0.1 + random(`cell-x-${i}`) * 0.8) * width;
        const cy = (0.12 + random(`cell-y-${i}`) * 0.76) * height;
        const cr = 16 + random(`cell-r-${i}`) * 16;
        const drop = weak * (20 + random(`cell-d-${i}`) * 30);
        const vis = Math.max(0, Math.min(1, build * 2 - 0.6 - random(`cell-t-${i}`) * 0.4));
        return { cx, cy: cy + drop, cr, vis };
      })
    : [];
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={color} strokeWidth={p.w} strokeOpacity={p.o} strokeLinecap="round" strokeDasharray={p.dash} />
      ))}
      {cells.map((c, i) => (
        <g key={i} opacity={c.vis}>
          <circle cx={c.cx} cy={c.cy} r={c.cr} fill={cellColor} fillOpacity={0.06} stroke={cellColor} strokeOpacity={0.35} strokeWidth={1.5} />
          <circle cx={c.cx + c.cr * 0.15} cy={c.cy - c.cr * 0.1} r={c.cr * 0.32} fill={cellColor} fillOpacity={0.25} />
        </g>
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Blutgefäss (schematisch)                                             */
/* ------------------------------------------------------------------ */

export const Vessel: React.FC<{
  width: number;
  /** 1 = gesunde Wand, 0 = stark geschwächt */
  integrity: number;
  /** Sichtbarkeit (0–1) */
  reveal: number;
}> = ({ width, integrity, reveal }) => {
  const frame = useCurrentFrame();
  const h = 300;
  const top = 90;
  const bottom = 210;
  const weak = 1 - integrity;
  const wallFibres: React.ReactNode[] = [];
  const count = 46;
  for (let side = 0; side < 2; side++) {
    for (let i = 0; i < count; i++) {
      const r = random(`wall-${side}-${i}`);
      const x = (i / count) * width + 8;
      const y = side === 0 ? top : bottom;
      const gap = weak > 0.1 && r < weak * 0.55; // Lücke in der Wand
      const vis = Math.max(0, Math.min(1, reveal * 1.8 - (i / count) * 0.8));
      if (gap) continue;
      wallFibres.push(
        <line
          key={`${side}-${i}`}
          x1={x}
          y1={y - 9 + weak * Math.sin(i + frame / 30) * 3}
          x2={x + 18}
          y2={y + 9 + weak * Math.cos(i + frame / 30) * 3}
          stroke={COLORS.orange}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={vis * (0.55 + 0.45 * integrity)}
        />,
      );
    }
  }
  // Blutkörperchen fliessen von links nach rechts
  const cells = new Array(26).fill(0).map((_, i) => {
    const r = random(`rbc-${i}`);
    const speed = 2.2 + r * 1.4;
    const x = ((r * width + frame * speed) % (width + 80)) - 40;
    const y = 120 + random(`rbc-y-${i}`) * 60;
    return { x, y, r };
  });
  // Austretende Punkte (schematisch für kleine Einblutungen)
  const leaks = new Array(14).fill(0).map((_, i) => {
    const r = random(`leak-${i}`);
    const lx = (0.08 + r * 0.84) * width;
    const up = random(`leak-up-${i}`) > 0.5;
    const t = Math.max(0, Math.min(1, (weak - 0.25 - random(`leak-t-${i}`) * 0.4) * 2.2));
    const dist = 20 + t * (30 + random(`leak-d-${i}`) * 50);
    return { x: lx + Math.sin(i) * 10 * t, y: up ? top - dist : bottom + dist, t };
  });
  return (
    <svg width={width} height={h} style={{ overflow: "visible", opacity: reveal }}>
      <defs>
        <linearGradient id="lumen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.blood} stopOpacity={0.05} />
          <stop offset="50%" stopColor={COLORS.blood} stopOpacity={0.14} />
          <stop offset="100%" stopColor={COLORS.blood} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <rect x={0} y={top} width={width} height={bottom - top} fill="url(#lumen)" />
      {cells.map((c, i) => (
        <ellipse key={i} cx={c.x} cy={c.y} rx={11} ry={7} fill={COLORS.blood} opacity={0.55 + c.r * 0.3} />
      ))}
      {wallFibres}
      {leaks.map((l, i) => (
        <circle key={i} cx={l.x} cy={l.y} r={5 * l.t} fill={COLORS.blood} opacity={0.65 * l.t} />
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Abstrakte Figur                                                      */
/* ------------------------------------------------------------------ */

/** Ankerpunkte im Koordinatensystem der Figur (viewBox 0 0 400 900). */
export const FIGURE_ANCHORS = {
  head: { x: 200, y: 66 },
  mouth: { x: 200, y: 116 },
  joint: { x: 158, y: 640 },
  wound: { x: 72, y: 430 },
  skin: { x: 240, y: 770 },
  bruise: { x: 316, y: 300 },
};

export const Figure: React.FC<{ height: number; reveal: number; dim?: number }> = ({ height, reveal, dim = 1 }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 45) * 0.006;
  const stroke = `rgba(255,255,255,${0.55 * dim})`;
  const limb = (d: string, w: number, key: string) => (
    <g key={key}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={w + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#0E1016" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 900" height={height} width={(height * 400) / 900} style={{ overflow: "visible", opacity: reveal }}>
      <defs>
        <radialGradient id="figGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.16 * dim} />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={200} cy={420} rx={260} ry={480} fill="url(#figGlow)" />
      <g transform={`translate(200 450) scale(${breathe}) translate(-200 -450)`}>
        {/* Beine */}
        {limb("M 168 470 L 160 650 L 166 850", 46, "legL")}
        {limb("M 232 470 L 240 650 L 234 850", 46, "legR")}
        {/* Arme */}
        {limb("M 112 214 L 86 340 L 72 500", 34, "armL")}
        {limb("M 288 214 L 314 340 L 328 500", 34, "armR")}
        {/* Rumpf */}
        <path
          d="M 120 190 Q 200 172 280 190 Q 300 198 296 236 L 276 470 Q 200 492 124 470 L 104 236 Q 100 198 120 190 Z"
          fill="#0E1016"
          stroke={stroke}
          strokeWidth={1.5}
        />
        {/* Hals & Kopf */}
        <rect x={184} y={140} width={32} height={46} rx={14} fill="#0E1016" stroke={stroke} strokeWidth={1.5} />
        <circle cx={200} cy={88} r={58} fill="#0E1016" stroke={stroke} strokeWidth={1.5} />
      </g>
    </svg>
  );
};
