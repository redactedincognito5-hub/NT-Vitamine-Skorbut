/**
 * SZENE 4 – SKORBUT (1:19–1:53)
 * Titel → Zeitachse (weniger als ca. 10 mg/Tag, erste Anzeichen nach etwa 1 Monat)
 * → schematisches Blutgefäss: Kollagenwand wird schwächer → typische Anzeichen an
 * einer abstrakten Figur → «Unbehandelt lebensgefährlich».
 * Bewusst schematisch und nicht drastisch.
 */
import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, wave } from "../motion/anim";
import { Backdrop, Particles, Vignette } from "../motion/Atmosphere";
import { Callout, DrawPath, Kicker, Ref } from "../motion/Graphics";
import { Enter } from "../motion/Enter";
import { Reveal } from "../motion/Reveal";
import { FIGURE_ANCHORS, Figure, Vessel } from "../illustrations/Biology";

const T = TEXT.skorbut;

/* Figur-Platzierung auf dem Bildschirm */
const FIG_H = 860;
const FIG_SCALE = FIG_H / 900;
const FIG_X = 900 - 200 * FIG_SCALE;
const FIG_Y = 150;
const fig = (p: { x: number; y: number }) => ({ x: FIG_X + p.x * FIG_SCALE, y: FIG_Y + p.y * FIG_SCALE });

export const S4Skorbut: React.FC = () => {
  const frame = useCurrentFrame();

  const titleExit = 140;
  const tlAt = 162;
  const tlExit = 372;
  const vesselAt = 392;
  const vesselExit = 600;
  const symAt = 628;
  const symExit = 916;
  const dangerAt = 934;

  /* --- Titel --- */
  const titlePush = mix(1.08, 1, ramp(frame, 0, 140, EASE.out));

  /* --- Zeitachse --- */
  const tlX0 = 360;
  const tlX1 = 1560;
  const tlY = 640;
  const tlProgress = ramp(frame, tlAt + 30, 150, EASE.inOut);
  const headX = mix(tlX0, tlX1, tlProgress);
  const store = 1 - tlProgress * 0.9;
  const storeColor = interpolateColors(store, [0.1, 1], [COLORS.greyDim, COLORS.orange]);

  /* --- Gefäss --- */
  const vesselReveal = ramp(frame, vesselAt, 36, EASE.inOut) * (1 - ramp(frame, vesselExit, 22, EASE.in));
  const integrity = 1 - ramp(frame, vesselAt + 50, 150, EASE.inOut) * 0.85;

  /* --- Symptome --- */
  const symVis = ramp(frame, symAt, 30, EASE.inOut) * (1 - ramp(frame, symExit, 22, EASE.in));
  const symptomStarts = [652, 696, 744, 790, 836, 872];
  const anchors = [FIGURE_ANCHORS.head, FIGURE_ANCHORS.mouth, FIGURE_ANCHORS.joint, FIGURE_ANCHORS.wound, FIGURE_ANCHORS.skin, FIGURE_ANCHORS.bruise].map(fig);
  const sides: ("left" | "right")[] = ["left", "right", "left", "left", "right", "right"];
  const labelPos = [
    { x: 560, y: 210 },
    { x: 1140, y: 290 },
    { x: 560, y: 760 },
    { x: 560, y: 520 },
    { x: 1140, y: 840 },
    { x: 1140, y: 560 },
  ];
  const fatigue = ramp(frame, symptomStarts[0], 40);

  return (
    <AbsoluteFill>
      <Backdrop light="#0F1118" size={58} intensity={0.9} />
      <Particles count={26} seed="sk-dust" color={COLORS.grey} minSize={1} maxSize={2.2} speed={0.1} opacity={0.22} />

      {/* --- Titel ---------------------------------------------------- */}
      {frame < titleExit + 24 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", transform: `scale(${titlePush})` }}>
          <Reveal
            text={T.title}
            start={10}
            mode="chars"
            stagger={4}
            from="top"
            distance={0.4}
            blur={22}
            scaleFrom={1.3}
            config={SPRING.smooth}
            exitStart={titleExit}
            exitStagger={1}
            style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 250, letterSpacing: "-0.04em", color: COLORS.white, lineHeight: 1 }}
          />
          <div style={{ height: 30 }} />
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Reveal text={T.subtitle} start={46} stagger={3} distance={0.5} blur={8} exitStart={titleExit - 4} style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 44, color: COLORS.grey }} />
            <span style={{ fontSize: 44, opacity: ramp(frame, 70, 16) * (1 - ramp(frame, titleExit - 4, 14)) }}>
              <Ref ids={T.subtitleRefs} />
            </span>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- Zeitachse -------------------------------------------------- */}
      {frame >= tlAt - 2 && frame < tlExit + 24 ? (
        <AbsoluteFill style={{ opacity: 1 - ramp(frame, tlExit, 22, EASE.in) }}>
          <div style={{ position: "absolute", left: tlX0, top: 300 }}>
            <Enter start={tlAt} distance={20} blur={8}>
              <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 60, color: COLORS.white, letterSpacing: "-0.02em" }}>{T.timelineLabel}</div>
            </Enter>
          </div>

          {/* Vorrat-Balken */}
          <div style={{ position: "absolute", left: tlX0, top: 450, opacity: ramp(frame, tlAt + 14, 20) }}>
            <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 22, letterSpacing: "0.26em", color: COLORS.grey, marginBottom: 14 }}>{T.levelLabel.toUpperCase()}</div>
            <div style={{ width: tlX1 - tlX0, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${store * 100}%`, height: "100%", borderRadius: 8, background: storeColor, boxShadow: `0 0 24px ${storeColor}` }} />
            </div>
          </div>

          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <DrawPath d={`M ${tlX0} ${tlY} L ${tlX1} ${tlY}`} progress={ramp(frame, tlAt + 6, 30, EASE.inOut)} stroke="rgba(255,255,255,0.3)" width={2} />
            <DrawPath d={`M ${tlX0} ${tlY} L ${headX} ${tlY}`} progress={tlProgress > 0 ? 1 : 0} stroke={COLORS.white} width={3} />
            {[0, 1, 2, 3, 4].map((k) => {
              const x = mix(tlX0, tlX1, k / 4);
              const vis = ramp(frame, tlAt + 10 + k * 4, 16);
              return <line key={k} x1={x} y1={tlY - 12} x2={x} y2={tlY + 12} stroke={COLORS.white} strokeOpacity={0.5 * vis} strokeWidth={2} />;
            })}
            <circle cx={headX} cy={tlY} r={10 * ramp(frame, tlAt + 28, 10)} fill={COLORS.white} />
            <circle cx={headX} cy={tlY} r={24 + wave(frame, 30) * 4} fill="none" stroke={COLORS.white} strokeOpacity={0.25 * ramp(frame, tlAt + 28, 10)} />
          </svg>
          {T.timelineWeeks.map((w, k) => (
            <div
              key={w}
              style={{
                position: "absolute",
                left: mix(tlX0, tlX1, (k + 0.5) / 4) - 100,
                width: 200,
                top: tlY + 26,
                textAlign: "center",
                fontFamily: FONTS.text,
                fontWeight: 500,
                fontSize: 26,
                color: tlProgress >= (k + 0.5) / 4 ? COLORS.white : COLORS.greyDim,
                opacity: ramp(frame, tlAt + 16 + k * 5, 16),
              }}
            >
              {w}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center" }}>
            <Enter start={tlAt + 176} distance={24} blur={10} scaleFrom={0.96}>
              <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 64, color: COLORS.orange, letterSpacing: "-0.02em" }}>
                {T.timelineResult}
                <Ref ids={T.timelineRefs} />
              </span>
            </Enter>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- Blutgefäss --------------------------------------------- */}
      {frame >= vesselAt - 2 && frame < vesselExit + 24 ? (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 210, top: 470 }}>
            <Vessel width={1500} integrity={integrity} reveal={vesselReveal} />
          </div>
          <div style={{ position: "absolute", left: 210, top: 840, fontFamily: FONTS.text, fontSize: 20, letterSpacing: "0.2em", color: COLORS.greyDim, opacity: vesselReveal }}>
            FEINES BLUTGEFÄSS · SCHEMATISCH
          </div>
          {/* Kette: weniger Kollagen → ... */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: 1 - ramp(frame, vesselExit, 22, EASE.in) }}>
            {T.mechanism.map((m, i) => (
              <React.Fragment key={m}>
                {i > 0 ? (
                  <Enter start={vesselAt + 20 + i * 44} from="left" distance={20} blur={4}>
                    <span style={{ fontFamily: FONTS.text, fontSize: 40, color: COLORS.grey }}>→</span>
                  </Enter>
                ) : null}
                <Enter start={vesselAt + 24 + i * 44} distance={26} blur={10}>
                  <div
                    style={{
                      padding: "14px 28px",
                      borderRadius: 16,
                      border: `1.5px solid ${i === 2 ? COLORS.blood : "rgba(255,255,255,0.25)"}`,
                      background: i === 2 ? "rgba(217,67,75,0.10)" : "rgba(255,255,255,0.04)",
                      fontFamily: FONTS.display,
                      fontWeight: 700,
                      fontSize: 40,
                      color: COLORS.white,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m}
                    {i === 2 ? <Ref ids={T.mechanismRefs} /> : null}
                  </div>
                </Enter>
              </React.Fragment>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- Symptome ----------------------------------------------- */}
      {frame >= symAt - 2 && frame < symExit + 24 ? (
        <AbsoluteFill style={{ opacity: symVis }}>
          <div style={{ position: "absolute", left: 140, top: 96 }}>
            <Kicker text={T.symptomsTitle} start={symAt + 4} />
          </div>
          <div style={{ position: "absolute", left: 140, top: 132, fontSize: 22, opacity: ramp(frame, symAt + 20, 16) }}>
            <Ref ids={T.symptomsRefs} size={1} style={{ verticalAlign: "baseline", marginLeft: 0 }} />
          </div>
          <div style={{ position: "absolute", left: FIG_X, top: FIG_Y, transform: `translateY(${(1 - ramp(frame, symAt, 40)) * 30}px)` }}>
            <Figure height={FIG_H} reveal={1} dim={1 - fatigue * 0.35} />
          </div>
          {/* dezente Markierungen am Körper */}
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            {/* Zahnfleisch */}
            <path d={`M ${anchors[1].x - 16} ${anchors[1].y} Q ${anchors[1].x} ${anchors[1].y + 10} ${anchors[1].x + 16} ${anchors[1].y}`} fill="none" stroke={COLORS.blood} strokeWidth={3} strokeLinecap="round" opacity={ramp(frame, symptomStarts[1] + 10, 20) * 0.9} />
            {/* Gelenk */}
            <circle cx={anchors[2].x} cy={anchors[2].y} r={26 + wave(frame, 24) * 3} fill="none" stroke={COLORS.orange} strokeOpacity={0.5 * ramp(frame, symptomStarts[2] + 10, 20)} strokeWidth={2} />
            {/* Wunde */}
            <line x1={anchors[3].x - 10} y1={anchors[3].y - 8} x2={anchors[3].x + 10} y2={anchors[3].y + 8} stroke={COLORS.blood} strokeWidth={3} strokeLinecap="round" opacity={ramp(frame, symptomStarts[3] + 10, 20) * 0.8} />
            {/* Flecken auf der Haut (Unterschenkel) */}
            {[[-10, -14], [8, -2], [-4, 12], [12, 22], [-12, 30]].map(([dx, dy], k) => (
              <circle key={k} cx={anchors[4].x + dx} cy={anchors[4].y + dy} r={3.2} fill={k % 2 ? "#7A6CC8" : COLORS.blood} opacity={ramp(frame, symptomStarts[4] + 8 + k * 3, 14) * 0.85} />
            ))}
            {/* Bluterguss */}
            <ellipse cx={anchors[5].x} cy={anchors[5].y} rx={16} ry={11} fill="#6F5FB8" opacity={ramp(frame, symptomStarts[5] + 8, 20) * 0.55} />
          </svg>
          {T.symptoms.map((s, i) => (
            <Callout
              key={s}
              start={symptomStarts[i]}
              ax={anchors[i].x}
              ay={anchors[i].y}
              lx={labelPos[i].x}
              ly={labelPos[i].y}
              side={sides[i]}
              text={s}
              color={i === 1 || i === 3 || i === 4 ? COLORS.blood : COLORS.orange}
              fontSize={31}
            />
          ))}
        </AbsoluteFill>
      ) : null}

      {/* --- Gefahr --------------------------------------------------- */}
      {frame >= dangerAt - 2 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Reveal text={T.danger} start={dangerAt} stagger={6} mask distance={1} blur={6} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 104, letterSpacing: "-0.03em", color: COLORS.white }} />
            <span style={{ fontSize: 104, opacity: ramp(frame, dangerAt + 16, 14) }}>
              <Ref ids={T.dangerRefs} size={0.22} />
            </span>
          </div>
          <div style={{ height: 30 }} />
          <Enter start={dangerAt + 30} distance={18} blur={8}>
            <span style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 42, color: COLORS.green }}>
              {T.dangerSub}
              <Ref ids={T.dangerSubRefs} />
            </span>
          </Enter>
        </AbsoluteFill>
      ) : null}

      <Vignette strength={0.75} />
    </AbsoluteFill>
  );
};
