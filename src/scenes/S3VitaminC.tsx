/**
 * SZENE 3 – VITAMIN C (0:54–1:19)
 * Rotierende Orange → zerfällt in geometrische Schichten → «VITAMIN C / ASCORBINSÄURE»
 * → Mensch kann Vitamin C nicht selbst herstellen → Kollagen (Dreifach-Helix → Gerüst).
 */
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, springAt } from "../motion/anim";
import { Backdrop, Glow, Particles, Vignette } from "../motion/Atmosphere";
import { Kicker, Ref } from "../motion/Graphics";
import { Enter } from "../motion/Enter";
import { Reveal } from "../motion/Reveal";
import { OrangeSection, OrangeSphere } from "../illustrations/Orange";
import { CollagenMesh, TripleHelix } from "../illustrations/Biology";

const T = TEXT.vitaminc;

export const S3VitaminC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* --- Zeitmarken --- */
  const openAt = 120;
  const titleAt = 150;
  const liftAt = 262;
  const introExit = 332;
  const collagenAt = 352;
  const meshAt = 452;
  const questionAt = 650;

  /* --- Orange --- */
  const sphereIn = springAt(frame, fps, 0, SPRING.smooth);
  const sphereToSection = ramp(frame, openAt, 18, EASE.inOut);
  const explode = springAt(frame, fps, openAt + 8, { damping: 26, stiffness: 40, mass: 1.2 });
  const drift = ramp(frame, 200, 160, EASE.soft) * 0.14;
  const segRotation = frame * 0.004 + explode * 0.6;
  const lift = ramp(frame, liftAt, 40, EASE.inOut);
  const introOut = ramp(frame, introExit, 22, EASE.in);
  const camPush = mix(1, 1.05, ramp(frame, 0, 140, EASE.soft));

  /* --- Kollagen --- */
  const helixDraw = ramp(frame, collagenAt + 10, 70, EASE.inOut);
  const helixFade = 1 - ramp(frame, meshAt, 40, EASE.inOut) * 0.85;
  const meshBuild = ramp(frame, meshAt + 6, 110, EASE.inOut);
  const question = ramp(frame, questionAt, 30, EASE.inOut);
  const integrity = 1 - question * 0.35;
  const warm = 1 - question;

  return (
    <AbsoluteFill>
      <Backdrop light={interpolateColors(warm, [0, 1], ["#11131A", "#1C130B"])} size={64} />
      <Glow x={960} y={540} size={1500} opacity={0.35 * sphereIn * (1 - introOut) * warm} />
      <Particles count={36} seed="vc-dust" color={COLORS.orangeLight} minSize={1} maxSize={3} speed={0.18} opacity={0.4} fade={warm} />

      {/* --- Teil 1: Orange & Titel --------------------------------- */}
      {introOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - introOut, transform: `scale(${camPush})` }}>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: `translateY(${-250 * lift}px) scale(${1 - 0.25 * lift})`,
            }}
          >
            {/* rotierende Kugel */}
            <div style={{ position: "absolute", opacity: 1 - sphereToSection, transform: `scale(${(0.82 + 0.18 * sphereIn) * (1 + sphereToSection * 0.06)})` }}>
              <OrangeSphere size={560} rotation={frame * 0.012} />
            </div>
            {/* Querschnitt, der sich öffnet */}
            <div style={{ position: "absolute", opacity: sphereToSection * (1 - lift * 0.55) }}>
              <OrangeSection size={496} explode={explode + drift} rotation={segRotation} rings={1 - explode * 0.7} segmentOpacity={1 - explode * 0.45} />
            </div>
            {/* Titel */}
            <div style={{ position: "absolute", textAlign: "center" }}>
              <Reveal
                text={`${T.title1} ${T.title2}`}
                start={titleAt}
                mode="chars"
                stagger={3}
                from="none"
                blur={26}
                scaleFrom={1.22}
                colors={{ C: COLORS.orange }}
                style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 196, letterSpacing: "-0.035em", color: COLORS.white, lineHeight: 1, textShadow: "0 10px 60px rgba(0,0,0,0.55)" }}
              />
              <div style={{ height: 22 }} />
              <Reveal
                text={T.subtitle}
                start={titleAt + 34}
                mode="chars"
                stagger={1.6}
                mask
                distance={1}
                blur={3}
                style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 40, letterSpacing: "0.42em", color: COLORS.orangeLight, marginRight: "-0.42em" }}
              />
            </div>
          </AbsoluteFill>

          {/* Fakten */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "flex-start" }}>
              <Reveal text={T.fact1} start={liftAt + 24} stagger={3} distance={0.5} blur={10} style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 54, letterSpacing: "-0.02em", color: COLORS.white }} />
              <span style={{ fontSize: 54, opacity: ramp(frame, liftAt + 50, 16) }}>
                <Ref ids={T.fact1Refs} />
              </span>
            </div>
            <div style={{ height: 22 }} />
            <Reveal text={T.fact2} start={liftAt + 44} stagger={2.5} distance={0.5} blur={8} style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 38, color: COLORS.grey }} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- Teil 2: Kollagen ------------------------------------------ */}
      {frame >= collagenAt - 2 ? (
        <AbsoluteFill style={{ opacity: 1 - question * 0.7 }}>
          <div style={{ position: "absolute", left: 140, top: 112 }}>
            <Kicker text={T.collagenKicker} start={collagenAt} />
            <div style={{ height: 14 }} />
            <Reveal text={T.collagenTitle} start={collagenAt + 4} mode="chars" stagger={2} mask distance={1} blur={3} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 112, letterSpacing: "-0.03em", color: COLORS.white, lineHeight: 1 }} />
            <div style={{ height: 16 }} />
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <Reveal text={T.collagenSub} start={collagenAt + 22} stagger={2} distance={0.5} blur={8} style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 34, color: COLORS.grey }} />
              <span style={{ fontSize: 34, opacity: ramp(frame, collagenAt + 40, 16) }}>
                <Ref ids={T.collagenSubRefs} />
              </span>
            </div>
          </div>

          {/* Dreifach-Helix */}
          <div style={{ position: "absolute", left: 140, top: 470, opacity: helixFade, transform: `translateY(${ramp(frame, meshAt, 60, EASE.inOut) * -40}px)` }}>
            <TripleHelix width={1640} height={200} progress={helixDraw} phase={frame * 0.05} amplitude={56} turns={5} />
            <div style={{ fontFamily: FONTS.text, fontSize: 20, color: COLORS.greyDim, letterSpacing: "0.2em", marginTop: 12, opacity: ramp(frame, collagenAt + 60, 20) * (1 - ramp(frame, meshAt, 20)) }}>
              KOLLAGEN · SCHEMATISCH (DREIFACHE HELIX)
            </div>
          </div>

          {/* Gerüst im Gewebe */}
          <div style={{ position: "absolute", left: 140, top: 400 }}>
            <CollagenMesh width={1060} height={480} build={meshBuild} integrity={integrity} />
          </div>

          {/* Labels: wo Kollagen vorkommt */}
          <div style={{ position: "absolute", left: 1330, top: 420, width: 460 }}>
            <Enter start={meshAt + 30} distance={20} blur={6}>
              <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 22, letterSpacing: "0.28em", color: COLORS.grey }}>
                BAUSTEIN VON
                <Ref ids={T.collagenLabelRefs} size={0.9} style={{ verticalAlign: "baseline" }} />
              </div>
            </Enter>
            <div style={{ height: 22 }} />
            {T.collagenLabels.map((label, i) => (
              <Enter key={label} start={meshAt + 44 + i * 12} from="right" distance={60} blur={10} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 7, background: COLORS.orange, boxShadow: `0 0 18px ${COLORS.orange}` }} />
                  <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 52, color: COLORS.white, letterSpacing: "-0.02em" }}>{label}</div>
                </div>
              </Enter>
            ))}
          </div>

          {/* Hinweis unten */}
          <div style={{ position: "absolute", left: 140, top: 940 }}>
            <Enter start={meshAt + 110} distance={16} blur={8}>
              <span style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 32, color: COLORS.white }}>
                {T.collagenNote}
                <Ref ids={T.collagenNoteRefs} />
              </span>
            </Enter>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- Frage --------------------------------------------------- */}
      {frame >= questionAt ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ padding: "26px 54px", borderRadius: 24, background: `rgba(8,9,13,${0.72 * question})` }}>
            <Reveal text={T.question} start={questionAt + 14} stagger={4} from="none" blur={18} scaleFrom={0.94} style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 92, letterSpacing: "-0.03em", color: COLORS.white }} />
          </div>
        </AbsoluteFill>
      ) : null}

      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};
