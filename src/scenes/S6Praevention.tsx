/**
 * SZENE 6 – VORBEUGEN (2:24–2:41)
 * Übergang von der Dunkelheit in eine helle, frische Atmosphäre.
 * Peperoni, Kiwi, Broccoli, Orange mit Vitamin-C-Gehalt (SGE / Schweizer Nährwertdatenbank)
 * → «VITAMIN C – REGELMÄSSIG ZUFÜHREN».
 */
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, springAt, wave } from "../motion/anim";
import { Glow } from "../motion/Atmosphere";
import { Kicker, Ref } from "../motion/Graphics";
import { Enter } from "../motion/Enter";
import { Reveal } from "../motion/Reveal";
import { Broccoli, Kiwi, OrangeHalf, Pepper } from "../illustrations/Foods";

const T = TEXT.praevention;
const BAR = "#E8740F"; // etwas dunkleres Orange: besserer Kontrast auf hellem Grund
const MAX_MG = 160;

export const S6Praevention: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const light = ramp(frame, 0, 40, EASE.inOut);
  const foodsAt = 44;
  const barsAt = 120;
  const foodsExit = 292;
  const finalAt = 312;

  const bg = interpolateColors(light, [0, 1], ["#141A2A", COLORS.paper]);
  const foodsOut = ramp(frame, foodsExit, 26, EASE.inOut);

  const FOODS = [Pepper, Kiwi, Broccoli, OrangeHalf];
  const dirs: ("left" | "top" | "bottom" | "right")[] = ["left", "top", "bottom", "right"];
  const colX = [330, 750, 1170, 1590];

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {/* frische Lichtakzente */}
      <Glow x={300} y={150} size={1300} color={COLORS.green} opacity={0.22 * light} />
      <Glow x={1650} y={900} size={1400} color={COLORS.orange} opacity={0.18 * light} />
      <Glow x={960} y={-200} size={2000} color="#FFFFFF" opacity={0.6 * light} />

      {/* Kopfzeile */}
      <div style={{ position: "absolute", left: 140, top: 104, opacity: 1 - foodsOut }}>
        <Kicker text={T.kicker} start={18} color={COLORS.orange} textColor={COLORS.inkSoft} />
        <div style={{ height: 14 }} />
        <Reveal text={T.headline} start={24} stagger={4} mask distance={1} blur={4} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 76, letterSpacing: "-0.03em", color: COLORS.ink }} />
      </div>

      {/* Lebensmittel + Balken */}
      {frame < foodsExit + 30 ? (
        <AbsoluteFill style={{ opacity: 1 - foodsOut, transform: `translateY(${foodsOut * -40}px) scale(${1 - foodsOut * 0.04})` }}>
          {T.foods.map((food, i) => {
            const Illu = FOODS[i];
            const p = springAt(frame, fps, foodsAt + i * 10, SPRING.gentle);
            const d = (1 - p) * 220;
            const tx = dirs[i] === "left" ? -d : dirs[i] === "right" ? d : 0;
            const ty = dirs[i] === "top" ? -d : dirs[i] === "bottom" ? d : 0;
            const rot = (1 - p) * (i % 2 ? 18 : -18);
            const float = wave(frame + i * 20, 90) * 5;
            const bar = ramp(frame, barsAt + i * 8, 46, EASE.out);
            const value = Math.round(food.mg * bar);
            const barW = (food.mg / MAX_MG) * 330;
            return (
              <div key={food.name} style={{ position: "absolute", left: colX[i] - 165, top: 300, width: 330 }}>
                <div
                  style={{
                    height: 300,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    transform: `translate(${tx}px, ${ty + float}px) rotate(${rot}deg)`,
                    opacity: Math.min(1, p * 1.4),
                  }}
                >
                  <Illu size={230} />
                </div>
                <div style={{ height: 44 }} />
                <Enter start={foodsAt + 20 + i * 10} distance={16} blur={6}>
                  <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 46, color: COLORS.ink, letterSpacing: "-0.02em" }}>
                    {food.name}
                    {food.detail ? <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 24, color: COLORS.inkSoft, marginLeft: 12 }}>{food.detail}</span> : null}
                  </div>
                </Enter>
                <div style={{ height: 18 }} />
                {/* Balken: gemeinsame Grundlinie links, Wert direkt beschriftet */}
                <div style={{ opacity: ramp(frame, barsAt - 6, 12) }}>
                  <div style={{ width: 330, height: 14, borderRadius: 4, background: "rgba(11,12,16,0.07)" }}>
                    <div style={{ width: barW * bar, height: 14, borderRadius: 4, background: BAR }} />
                  </div>
                  <div style={{ marginTop: 12, fontFamily: FONTS.display, fontWeight: 700, fontSize: 40, color: COLORS.ink, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
                    {value}
                    <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 26, color: COLORS.inkSoft, marginLeft: 8 }}>mg</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 165, top: 940 }}>
            <Enter start={barsAt + 40} distance={14} blur={6}>
              <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 26, color: COLORS.inkSoft }}>
                {T.unit}
                <Ref ids={T.unitRefs} color={COLORS.inkSoft} size={0.85} style={{ verticalAlign: "baseline" }} />
              </span>
            </Enter>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Schlussaussage */}
      {frame >= finalAt - 2 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", transform: `scale(${mix(1.04, 1, ramp(frame, finalAt, 120, EASE.out))})` }}>
          <Reveal text={T.final1} start={finalAt} mode="chars" stagger={2.5} mask distance={1} blur={3} style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 132, letterSpacing: "-0.035em", color: BAR, lineHeight: 1 }} />
          <div style={{ height: 6 }} />
          <Reveal text={T.final2} start={finalAt + 14} stagger={8} mask distance={1} blur={4} style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 112, letterSpacing: "-0.035em", color: COLORS.ink, lineHeight: 1.05 }} />
          <div style={{ height: 50 }} />
          <Enter start={finalAt + 46} distance={16} blur={6}>
            <span style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 34, color: COLORS.ink }}>
              {T.note1}
              <Ref ids={T.note1Refs} color={COLORS.inkSoft} />
            </span>
          </Enter>
          <div style={{ height: 14 }} />
          <Enter start={finalAt + 64} distance={16} blur={6}>
            <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 30, color: COLORS.inkSoft }}>
              {T.note2}
              <Ref ids={T.note2Refs} color={COLORS.inkSoft} />
            </span>
          </Enter>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
