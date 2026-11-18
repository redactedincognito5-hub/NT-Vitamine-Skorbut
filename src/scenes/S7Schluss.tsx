/**
 * SZENE 7 – SCHLUSS (2:41–2:48)
 * «KLEINES VITAMIN.» – Pause – «GROSSE BEDEUTUNG.» – ruhiges Ausblenden.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, springAt, wave } from "../motion/anim";
import { Backdrop, Glow, Particles, Vignette } from "../motion/Atmosphere";
import { Reveal } from "../motion/Reveal";

const T = TEXT.schluss;

export const S7Schluss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line2At = 88;
  const fade = ramp(frame, 160, 50, EASE.inOut);
  const particle = springAt(frame, fps, 4, SPRING.gentle) * (1 - ramp(frame, 176, 34, EASE.in));
  const push = mix(1.06, 1, ramp(frame, 0, 210, EASE.out));
  const dim1 = ramp(frame, line2At, 30);
  const headline: React.CSSProperties = { fontFamily: FONTS.display, fontWeight: 800, fontSize: 132, letterSpacing: "-0.035em", lineHeight: 1.05 };
  return (
    <AbsoluteFill>
      <Backdrop size={60} intensity={0.9} />
      <Particles count={30} seed="end-dust" color={COLORS.orangeLight} minSize={1} maxSize={2.4} speed={0.12} opacity={0.3} fade={1 - fade} />
      <Glow x={960} y={300} size={220 * particle * (1 + 0.06 * wave(frame, 40))} core />
      <Glow x={960} y={300} size={900 * particle} opacity={0.2} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", transform: `scale(${push})`, opacity: 1 - fade, paddingTop: 80 }}>
        <div style={{ color: `rgba(255,255,255,${1 - dim1 * 0.55})` }}>
          <Reveal text={T.line1} start={14} stagger={8} from="bottom" distance={0.3} blur={18} scaleFrom={0.95} style={headline} />
        </div>
        <div style={{ height: 18 }} />
        <Reveal text={T.line2} start={line2At} stagger={8} from="bottom" distance={0.3} blur={18} scaleFrom={0.95} style={{ ...headline, color: COLORS.white }} />
      </AbsoluteFill>
      <Vignette strength={0.7} />
    </AbsoluteFill>
  );
};
