/**
 * SZENE 2 – WAS SIND VITAMINE? (0:15–0:54)
 * Titel mit Molekülfeld → «KLEINE MENGEN. GROSSE WIRKUNG.» → Ring der 13 Vitamine
 * → die Vitamine fliegen in zwei Gruppen: fettlöslich (Speicher) und wasserlöslich (Wasser).
 */
import React from "react";
import { AbsoluteFill, interpolateColors, random, useCurrentFrame, useVideoConfig } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, springAt, wave } from "../motion/anim";
import { Backdrop, Glow, Particles, Vignette } from "../motion/Atmosphere";
import { DrawPath, Ref } from "../motion/Graphics";
import { Enter } from "../motion/Enter";
import { Reveal } from "../motion/Reveal";

const T = TEXT.vitamine;

/* ------------------------------------------------------------------ */
/* Molekülfeld (dekorativ, stilisiert)                                  */
/* ------------------------------------------------------------------ */

const MoleculeField: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.001) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity }}>
      {new Array(14).fill(0).map((_, i) => {
        const depth = 0.4 + random(`mol-z-${i}`) * 0.6;
        const x = random(`mol-x-${i}`) * 1920 + Math.sin(frame / 160 + i) * 30 * depth - frame * 0.25 * depth;
        const y = random(`mol-y-${i}`) * 1080 + Math.cos(frame / 140 + i * 2) * 20 * depth;
        const wrapX = ((x % 2100) + 2100) % 2100 - 90;
        const s = 26 * depth + 10;
        const rot = random(`mol-r-${i}`) * 360 + frame * 0.15 * (i % 2 ? 1 : -1);
        const pts = new Array(6).fill(0).map((__, k) => [Math.cos((k * Math.PI) / 3) * s, Math.sin((k * Math.PI) / 3) * s]);
        const branch = random(`mol-b-${i}`) > 0.4;
        const orange = i % 5 === 0;
        const col = orange ? COLORS.orange : COLORS.grey;
        return (
          <g key={i} transform={`translate(${wrapX} ${y}) rotate(${rot})`} opacity={0.18 + depth * 0.32}>
            <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={col} strokeWidth={1.6} />
            {branch ? <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[0][0] + s} y2={pts[0][1] - s * 0.4} stroke={col} strokeWidth={1.6} /> : null}
            {branch ? <circle cx={pts[0][0] + s} cy={pts[0][1] - s * 0.4} r={3.5 * depth + 1} fill={col} /> : null}
            {pts.map((p, k) => (k % 2 === 0 ? <circle key={k} cx={p[0]} cy={p[1]} r={3 * depth + 1} fill={col} /> : null))}
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Vitamin-Knoten                                                       */
/* ------------------------------------------------------------------ */

type Group = "water" | "fat";
const GROUP: Record<string, Group> = { A: "fat", D: "fat", E: "fat", K: "fat" };

const Node: React.FC<{ x: number; y: number; label: string; size: number; color: string; fill: number; opacity: number; glow: number }> = ({
  x,
  y,
  label,
  size,
  color,
  fill,
  opacity,
  glow,
}) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity }}>
    {glow > 0.01 ? <Glow x={size / 2} y={size / 2} size={size * 4} color={color} opacity={glow} /> : null}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        background: `${color}${Math.round(fill * 255)
          .toString(16)
          .padStart(2, "0")}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONTS.display,
        fontWeight: 700,
        fontSize: label.length > 2 ? size * 0.3 : label.length > 1 ? size * 0.36 : size * 0.44,
        color: COLORS.white,
        letterSpacing: "-0.02em",
      }}
    >
      {label}
    </div>
  </div>
);

/* Zielpositionen in den Behältern */
const WATER_SLOTS: Record<string, [number, number]> = {
  B1: [390, 560],
  B2: [480, 560],
  B3: [570, 560],
  B5: [390, 650],
  B9: [480, 650],
  B6: [570, 650],
  B7: [390, 740],
  C: [480, 740],
  B12: [570, 740],
};
const FAT_SLOTS: Record<string, [number, number]> = {
  A: [1390, 590],
  D: [1490, 590],
  E: [1390, 690],
  K: [1490, 690],
};

export const S2Vitamine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* --- Zeitmarken (Frames) --- */
  const titleExit = 192;
  const smallStart = 214;
  const rippleStart = 292;
  const amountsExit = 404;
  const ringStart = 436;
  const colorCode = 560;
  const splitStart = 622;
  const fatFocus = 640;
  const waterFocus = 880;
  const drainStart = 936;
  const zoomStart = 1084;

  /* --- Kamera --- */
  const camTitle = mix(1, 1.05, ramp(frame, 0, 210, EASE.soft));
  const zoom = ramp(frame, zoomStart, 86, EASE.inOut);

  /* --- Sichtbarkeit der Abschnitte --- */
  const field = 1 - ramp(frame, titleExit, 30);
  const split = ramp(frame, splitStart, 30);
  const leftDim = 1 - 0.65 * (ramp(frame, fatFocus, 24) - ramp(frame, waterFocus, 24));
  const rightDim = 1 - 0.65 * ramp(frame, waterFocus, 24);
  const outsideZoom = 1 - zoom;

  /* --- Wasserstand --- */
  const level = mix(0.78, 0.42, ramp(frame, drainStart + 10, 110, EASE.inOut));
  const beakerTop = 400;
  const beakerBottom = 820;
  const waterTop = beakerBottom - (beakerBottom - beakerTop) * level;

  /* --- Ring-Zähler --- */
  const visibleCount = T.ringItems.filter((_, i) => frame >= ringStart + 8 + i * 5).length;

  return (
    <AbsoluteFill>
      <Backdrop light={interpolateColors(split, [0, 1], [COLORS.bgLift, "#10141C"])} size={72} />

      {/* Kamera-Container (für den Zoom auf Vitamin C am Ende) */}
      <AbsoluteFill style={{ transform: `translate(${480 * zoom}px, ${-200 * zoom}px) scale(${mix(1, 3.4, zoom)})`, transformOrigin: "480px 740px" }}>
        {/* --- A: Titel ------------------------------------------------ */}
        <AbsoluteFill style={{ transform: `scale(${camTitle})` }}>
          <MoleculeField opacity={field} />
          {frame < titleExit + 30 ? (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Reveal
                text={T.title}
                start={8}
                mode="chars"
                stagger={3}
                mask
                distance={1.05}
                blur={4}
                exitStart={titleExit}
                exitStagger={1}
                style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 210, letterSpacing: "-0.03em", color: COLORS.white, lineHeight: 1 }}
              />
              <div style={{ height: 36 }} />
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Reveal
                  text={T.subtitle}
                  start={44}
                  stagger={2}
                  distance={0.6}
                  blur={8}
                  exitStart={titleExit - 4}
                  exitStagger={0.5}
                  style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 38, color: COLORS.grey }}
                />
                <span style={{ fontSize: 38, opacity: ramp(frame, 80, 20) * (1 - ramp(frame, titleExit - 4, 14)) }}>
                  <Ref ids={T.subtitleRefs} />
                </span>
              </div>
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>

        {/* --- B: Kleine Mengen, grosse Wirkung ------------------------ */}
        {frame >= smallStart - 4 && frame < amountsExit + 30 ? (
          <AbsoluteFill style={{ opacity: 1 - ramp(frame, amountsExit, 22) }}>
            {/* Wellenringe */}
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
              {[0, 1, 2, 3, 4].map((k) => {
                const t = frame - (rippleStart + k * 9);
                if (t < 0) return null;
                const r = 8 + t * 17 * (1 - k * 0.06);
                const o = Math.max(0, 0.55 - t / 70) * (k === 0 ? 1.2 : 1);
                return <circle key={k} cx={960} cy={330} r={r} fill="none" stroke={k % 2 ? COLORS.white : COLORS.orange} strokeOpacity={o} strokeWidth={2.5 - k * 0.3} />;
              })}
            </svg>
            <Glow x={960} y={330} size={40 + 160 * ramp(frame, rippleStart - 6, 20)} core opacity={springAt(frame, fps, smallStart, SPRING.snappy)} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center" }}>
              <Reveal
                text={T.small}
                start={smallStart + 10}
                mode="chars"
                stagger={1.6}
                mask
                distance={1}
                blur={3}
                style={{
                  fontFamily: FONTS.text,
                  fontWeight: 600,
                  fontSize: 58,
                  letterSpacing: "0.18em",
                  color: interpolateColors(ramp(frame, rippleStart, 30), [0, 1], [COLORS.white, COLORS.grey]),
                }}
              />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center" }}>
              <Reveal
                text={T.big}
                start={rippleStart + 8}
                mode="words"
                stagger={7}
                from="none"
                blur={22}
                scaleFrom={0.86}
                style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 150, letterSpacing: "-0.035em", color: COLORS.white, lineHeight: 1.05 }}
              />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center" }}>
              <Enter start={rippleStart + 40} distance={16} blur={6}>
                <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 28, color: COLORS.grey, letterSpacing: "0.01em" }}>
                  {T.unitNote}
                  <Ref ids={T.unitRefs} size={0.8} style={{ verticalAlign: "baseline" }} />
                </span>
              </Enter>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* --- C: Ring der 13 Vitamine ---------------------------------- */}
        {frame >= ringStart - 2 ? (
          <AbsoluteFill>
            {/* Ringlinie */}
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 1 - split }}>
              <DrawPath d="M 960 200 A 340 340 0 1 1 959.9 200" progress={ramp(frame, ringStart, 50, EASE.inOut)} stroke={COLORS.hairline} width={1.5} />
            </svg>
            {/* Zähler in der Mitte */}
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", opacity: 1 - split }}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 210, color: COLORS.white, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums", opacity: ramp(frame, ringStart + 4, 12) }}>
                {visibleCount}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", marginTop: 10 }}>
                <Reveal text={T.ringLabel} start={ringStart + 30} stagger={3} style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 34, color: COLORS.grey }} />
                <span style={{ fontSize: 34, opacity: ramp(frame, ringStart + 50, 20) }}>
                  <Ref ids={T.ringRefs} />
                </span>
              </div>
            </AbsoluteFill>

            {/* Behälter */}
            <AbsoluteFill style={{ opacity: split }}>
              {/* Trennlinie */}
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <DrawPath d="M 960 150 L 960 950" progress={ramp(frame, splitStart + 6, 40, EASE.inOut)} stroke={COLORS.hairline} width={1.5} />
              </svg>

              {/* Links: wasserlöslich */}
              <div style={{ position: "absolute", inset: 0, opacity: leftDim }}>
                <Beaker top={beakerTop} bottom={beakerBottom} waterTop={waterTop} start={splitStart + 16} drain={ramp(frame, drainStart, 20) * outsideZoom} />
              </div>
              <div style={{ position: "absolute", inset: 0, opacity: leftDim * outsideZoom }}>
                <SideHeader x={480} title={T.waterTitle} sub={T.waterSub} color={COLORS.blue} start={splitStart + 10} />
                <SideNote x={480} y={880} start={waterFocus + 18} text={T.waterNote} refs={T.waterRefs} width={700} />
                <ResultTag x={480} y={960} start={waterFocus + 110} text={T.waterResult} color={COLORS.blue} />
                <div style={{ position: "absolute", left: 130, width: 700, top: 1012, textAlign: "center", opacity: ramp(frame, waterFocus + 140, 20) * outsideZoom }}>
                  <span style={{ fontFamily: FONTS.text, fontSize: 20, color: COLORS.greyDim, fontWeight: 500 }}>
                    {T.waterFootnote}
                    <Ref ids={T.waterRefs} size={0.9} style={{ verticalAlign: "baseline" }} />
                  </span>
                </div>
              </div>

              {/* Rechts: fettlöslich */}
              <div style={{ position: "absolute", inset: 0, opacity: rightDim * outsideZoom }}>
                <SideHeader x={1440} title={T.fatTitle} sub={T.fatSub} color={COLORS.green} start={splitStart + 14} />
                <Storage cx={1440} top={480} start={splitStart + 20} fill={ramp(frame, fatFocus + 40, 120, EASE.inOut)} />
                <SideNote x={1440} y={880} start={fatFocus + 70} text={T.fatNote} refs={T.fatRefs} width={700} />
                <ResultTag x={1440} y={960} start={fatFocus + 130} text={T.fatResult} color={COLORS.green} />
              </div>
            </AbsoluteFill>

            {/* Die Knoten selbst */}
            {T.ringItems.map((label, i) => {
              const appear = springAt(frame, fps, ringStart + 8 + i * 5, SPRING.gentle);
              if (appear <= 0.001) return null;
              const a = -Math.PI / 2 + (i * Math.PI * 2) / T.ringItems.length + (frame - ringStart) * 0.0012;
              const rx = 960 + Math.cos(a) * 340;
              const ry = 540 + Math.sin(a) * 340;
              const group: Group = GROUP[label] ?? "water";
              const slot = group === "fat" ? FAT_SLOTS[label] : WATER_SLOTS[label];
              const move = springAt(frame, fps, splitStart + i * 3, SPRING.smooth);
              const bob = group === "water" ? wave(frame + i * 13, 70) * 6 : wave(frame + i * 9, 90) * 3;
              let x = mix(rx, slot[0], move);
              let y = mix(ry, slot[1], move) - Math.sin(move * Math.PI) * 90 + bob * move;
              // Abfluss: B-Vitamine (ausser B12) verlassen den Becher
              const leaves = group === "water" && label !== "C" && label !== "B12";
              const leaveIdx = ["B1", "B2", "B3", "B5", "B6", "B7", "B9"].indexOf(label);
              const leave = leaves ? ramp(frame, drainStart + 20 + leaveIdx * 9, 46, EASE.in) : 0;
              if (leave > 0) {
                x = mix(x, 480, Math.min(1, leave * 1.6));
                y = mix(y, 1080, leave);
              }
              // Farbcodierung
              const coded = ramp(frame, colorCode + i * 2, 24);
              const groupColor = label === "C" ? COLORS.orange : group === "fat" ? COLORS.green : COLORS.blue;
              const color = interpolateColors(coded, [0, 1], ["#C8C8D0", groupColor]);
              const isC = label === "C";
              const size = mix(84, 70, move);
              const dimByFocus = group === "fat" ? rightDim : leftDim;
              const zoomDim = isC ? 1 : outsideZoom;
              const glow = isC ? coded * 0.5 + zoom * 0.8 : coded * 0.12 * (1 - move);
              return (
                <Node
                  key={label}
                  x={x}
                  y={y}
                  label={label}
                  size={size * (isC ? 1 + zoom * 0.15 : 1)}
                  color={color}
                  fill={isC ? 0.22 + zoom * 0.5 : 0.08}
                  opacity={Math.min(1, appear * 1.4) * (1 - leave) * (move > 0.5 ? dimByFocus : 1) * zoomDim}
                  glow={glow}
                />
              );
            })}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      {/* Orange Aura beim Zoom auf Vitamin C */}
      <Glow x={960} y={540} size={1400 * zoom} opacity={zoom * 0.5} />
      <Particles count={22} seed="vit-dust" color={COLORS.white} minSize={1} maxSize={2.4} speed={0.15} opacity={0.25} />
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Bausteine der Gegenüberstellung                                      */
/* ------------------------------------------------------------------ */

const SideHeader: React.FC<{ x: number; title: string; sub: string; color: string; start: number }> = ({ x, title, sub, color, start }) => (
  <div style={{ position: "absolute", left: x - 400, width: 800, top: 196, textAlign: "center" }}>
    <Reveal text={title} start={start} mode="chars" stagger={1.5} mask distance={1} blur={2} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 64, letterSpacing: "0.04em", color }} />
    <div style={{ height: 8 }} />
    <Reveal text={sub} start={start + 14} stagger={3} style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 30, color: COLORS.grey }} />
  </div>
);

const SideNote: React.FC<{ x: number; y: number; start: number; text: string; refs: readonly number[]; width: number }> = ({ x, y, start, text, refs, width }) => (
  <div style={{ position: "absolute", left: x - width / 2, width, top: y - 20, textAlign: "center" }}>
    <Enter start={start} distance={18} blur={8}>
      <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 28, color: COLORS.white, lineHeight: 1.3 }}>
        {text}
        <Ref ids={refs} />
      </span>
    </Enter>
  </div>
);

const ResultTag: React.FC<{ x: number; y: number; start: number; text: string; color: string }> = ({ x, y, start, text, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, start, SPRING.gentle);
  return (
    <div style={{ position: "absolute", left: x - 300, width: 600, top: y - 26, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) }}>
      <div
        style={{
          transform: `scale(${0.85 + 0.15 * p})`,
          padding: "10px 26px",
          borderRadius: 999,
          border: `1.5px solid ${color}`,
          background: `${color}1F`,
          fontFamily: FONTS.text,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "0.02em",
          color,
        }}
      >
        → {text}
      </div>
    </div>
  );
};

/** Glasbecher mit Wasser; Abfluss unten. */
const Beaker: React.FC<{ top: number; bottom: number; waterTop: number; start: number; drain: number }> = ({ top, bottom, waterTop, start, drain }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, start, SPRING.smooth);
  const left = 300;
  const right = 660;
  const surf = (x: number) => waterTop + Math.sin(x / 40 + frame / 12) * 5 + Math.sin(x / 23 - frame / 9) * 2.5;
  let d = `M ${left + 4} ${surf(left)}`;
  for (let x = left + 4; x <= right - 4; x += 12) d += ` L ${x} ${surf(x)}`;
  d += ` L ${right - 4} ${bottom - 30} Q ${right - 4} ${bottom - 4} ${right - 30} ${bottom - 4} L ${left + 30} ${bottom - 4} Q ${left + 4} ${bottom - 4} ${left + 4} ${bottom - 30} Z`;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: p }}>
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.4} />
          <stop offset="100%" stopColor={COLORS.blueDeep} stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <path d={d} fill="url(#water)" />
      <path d={`M ${left} ${top} L ${left} ${bottom - 30} Q ${left} ${bottom} ${left + 30} ${bottom} L ${right - 30} ${bottom} Q ${right} ${bottom} ${right} ${bottom - 30} L ${right} ${top}`} fill="none" stroke={COLORS.white} strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={left - 14} y1={top} x2={left + 14} y2={top} stroke={COLORS.white} strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={right - 14} y1={top} x2={right + 14} y2={top} stroke={COLORS.white} strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
      {/* Abfluss */}
      <rect x={462} y={bottom} width={36} height={60 * drain} rx={6} fill={COLORS.blue} fillOpacity={0.3} stroke={COLORS.blue} strokeOpacity={0.6 * drain} strokeWidth={2} />
      {new Array(6).fill(0).map((_, i) => {
        const t = ((frame + i * 11) % 60) / 60;
        return <circle key={i} cx={480} cy={bottom + 60 + t * 110} r={5 * (1 - t)} fill={COLORS.blue} opacity={drain * (1 - t) * 0.8} />;
      })}
    </svg>
  );
};

/** Speicher (stilisiert: Leber/Fettgewebe) mit Füllstand. */
const Storage: React.FC<{ cx: number; top: number; start: number; fill: number }> = ({ cx, top, start, fill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, start, SPRING.smooth);
  const w = 340;
  const h = 330;
  const x0 = cx - w / 2;
  const fillTop = top + h - h * 0.8 * fill;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: p }}>
      <defs>
        <clipPath id="storeClip">
          <rect x={x0} y={top} width={w} height={h} rx={80} />
        </clipPath>
        <linearGradient id="fatFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.35} />
          <stop offset="100%" stopColor={COLORS.greenDeep} stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <g clipPath="url(#storeClip)">
        <rect x={x0} y={fillTop} width={w} height={h} fill="url(#fatFill)" />
        {/* Fett-Tröpfchen */}
        {new Array(18).fill(0).map((_, i) => {
          const rx = x0 + 20 + random(`fat-x-${i}`) * (w - 40);
          const ry = top + 20 + random(`fat-y-${i}`) * (h - 40) + Math.sin(frame / 40 + i) * 3;
          const vis = ry > fillTop ? 1 : 0.25;
          return <circle key={i} cx={rx} cy={ry} r={8 + random(`fat-r-${i}`) * 18} fill="none" stroke={COLORS.green} strokeOpacity={0.25 * vis} strokeWidth={1.5} />;
        })}
      </g>
      <rect x={x0} y={top} width={w} height={h} rx={80} fill="none" stroke={COLORS.green} strokeOpacity={0.7} strokeWidth={2.5} />
      <text x={cx} y={top - 18} textAnchor="middle" fontFamily="Inter" fontWeight={600} fontSize={20} letterSpacing="0.28em" fill={COLORS.green} opacity={0.85}>
        SPEICHER
      </text>
    </svg>
  );
};
