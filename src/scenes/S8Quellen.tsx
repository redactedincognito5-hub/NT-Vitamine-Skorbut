/**
 * SZENE 8 – QUELLEN & MITWIRKENDE (2:48–2:58)
 * Gut lesbarer Abspann. Vollständige Quellenliste mit Aussagen: SOURCES.md
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TEXT } from "../data/texts";
import { ACCESSED, SOURCES } from "../data/sources";
import { COLORS, EASE, FONTS } from "../design/theme";
import { ramp } from "../motion/anim";
import { Backdrop } from "../motion/Atmosphere";
import { Enter } from "../motion/Enter";
import { Reveal } from "../motion/Reveal";

const T = TEXT.quellen;

export const S8Quellen: React.FC = () => {
  const frame = useCurrentFrame();
  const end = ramp(frame, 276, 24, EASE.inOut);
  return (
    <AbsoluteFill>
      <Backdrop size={80} intensity={0.6} />
      <AbsoluteFill style={{ opacity: 1 - end }}>
        {/* Titel */}
        <div style={{ position: "absolute", left: 140, top: 92 }}>
          <Reveal text={T.title} start={4} mode="chars" stagger={1} mask distance={1} blur={2} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 56, letterSpacing: "0.01em", color: COLORS.white }} />
        </div>
        <div style={{ position: "absolute", left: 140, top: 176, width: 1640, height: 1.5, background: COLORS.hairline, transform: `scaleX(${ramp(frame, 8, 30, EASE.inOut)})`, transformOrigin: "left" }} />

        {/* Mitwirkende */}
        <div style={{ position: "absolute", left: 140, top: 230, width: 560 }}>
          <Enter start={12} distance={16} blur={6}>
            <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 20, letterSpacing: "0.28em", color: COLORS.grey }}>{T.creditsLabel.toUpperCase()}</div>
            <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 66, color: COLORS.white, letterSpacing: "-0.03em", marginTop: 6 }}>{T.names}</div>
            <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 25, color: COLORS.orangeLight, marginTop: 6 }}>{T.course}</div>
          </Enter>
          <div style={{ height: 40 }} />
          {T.roles.map((r, i) => (
            <Enter key={r.label} start={22 + i * 5} distance={12} blur={4} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 17, letterSpacing: "0.22em", color: COLORS.greyDim }}>{r.label.toUpperCase()}</div>
              <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 23, color: COLORS.white, marginTop: 4, lineHeight: 1.3 }}>{r.value}</div>
            </Enter>
          ))}
        </div>

        {/* Quellen */}
        <div style={{ position: "absolute", left: 780, top: 226, width: 1000 }}>
          {SOURCES.map((s, i) => (
            <Enter key={s.id} start={16 + i * 3} from="right" distance={24} blur={4} style={{ display: "flex", gap: 18, marginBottom: 17 }}>
              <div style={{ fontFamily: FONTS.text, fontWeight: 700, fontSize: 21, color: COLORS.orange, width: 34, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>[{s.id}]</div>
              <div>
                <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 21, color: COLORS.white, lineHeight: 1.3 }}>
                  {s.org} – {s.title}
                </div>
                <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 18, color: COLORS.grey, marginTop: 2 }}>
                  {s.url} · {s.detail}
                </div>
              </div>
            </Enter>
          ))}
          <Enter start={46} distance={10} blur={4}>
            <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 17, color: COLORS.greyDim, marginTop: 8 }}>{ACCESSED}</div>
          </Enter>
        </div>

        <div style={{ position: "absolute", right: 140, bottom: 56, fontFamily: FONTS.text, fontWeight: 600, fontSize: 18, letterSpacing: "0.3em", color: COLORS.greyDim, opacity: ramp(frame, 40, 20) }}>
          VITAMINE & SKORBUT · {T.year}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
