/**
 * SZENE 5 – DIE GESCHICHTE (1:53–2:24)
 * Segelschiff auf nächtlichem Meer → Proviant an Bord (kaum frisches Obst/Gemüse)
 * → Skorbut kostete viele Seeleute das Leben → Zeitachse 1747 (James Lind) / 1795
 * (Zitronensaft in der britischen Marine) → Morgendämmerung.
 * Jahreszahlen & Aussagen: siehe SOURCES.md [7], [8].
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, springAt } from "../motion/anim";
import { Vignette } from "../motion/Atmosphere";
import { DrawPath, Kicker, Ref } from "../motion/Graphics";
import { Enter } from "../motion/Enter";
import { Reveal } from "../motion/Reveal";
import { OCEAN_LAYERS, Ocean, Ship, Sky, waveY } from "../illustrations/Maritime";
import { IconBarrel, IconBiscuit, IconCheese, IconNoFruit, Lemon } from "../illustrations/Foods";

const T = TEXT.geschichte;
const HORIZON = 640;

export const S5Geschichte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const provAt = 120;
  const provExit = 330;
  const fatalAt = 360;
  const fatalExit = 462;
  const tlAt = 476;
  const dawnAt = 800;

  const dawn = ramp(frame, dawnAt, 130, EASE.inOut);
  const cam = mix(1.1, 1.0, ramp(frame, 0, 300, EASE.out));
  const layers = OCEAN_LAYERS(HORIZON);
  const shipX = 300 + frame * 0.42;
  const shipW = 470;
  const shipMid = shipX + shipW * 0.48;
  const shipBase = waveY(layers[2], shipMid, frame);
  const slope = waveY(layers[2], shipMid + 120, frame) - waveY(layers[2], shipMid - 120, frame);
  const shipRot = ((Math.atan2(slope, 240) * 180) / Math.PI) * 0.8;
  const lanterns = 1 - ramp(frame, fatalAt, 40) * 0.7 + ramp(frame, tlAt + 60, 60) * 0.7;
  const shade = ramp(frame, provAt - 10, 30) * 0.35 * (1 - ramp(frame, fatalExit, 30)) + ramp(frame, tlAt, 40) * 0.22 * (1 - dawn * 0.5);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Sky horizon={HORIZON} dawn={dawn} moonX={1640} moonY={150} moonOpacity={(1 - dawn * 0.8) * (1 - ramp(frame, tlAt - 10, 50, EASE.inOut))} />
        <Ocean
          horizon={HORIZON}
          dawn={dawn}
          moonX={1640}
          shimmer={(1 - dawn) * (1 - ramp(frame, tlAt - 10, 50, EASE.inOut) * 0.85)}
          insertAfterLayer={2}
          insert={
            <g transform={`translate(${shipX} ${shipBase - (shipW * 425) / 660}) rotate(${shipRot} ${shipW * 0.48} ${(shipW * 425) / 660})`}>
              <Ship width={shipW} lanterns={lanterns} dawn={dawn} />
            </g>
          }
        />
      </AbsoluteFill>
      {/* leichte Abdunklung, wenn Text im Vordergrund steht */}
      <AbsoluteFill style={{ background: `rgba(4,5,9,${shade})` }} />
      <Vignette strength={0.65} />

      {/* --- Titel ---------------------------------------------------- */}
      <div style={{ position: "absolute", left: 140, top: 110, opacity: 1 - ramp(frame, provExit, 24) }}>
        <Kicker text={T.kicker} start={16} />
        <div style={{ height: 16 }} />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Reveal text={T.title} start={24} stagger={5} mask distance={1} blur={4} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 96, letterSpacing: "-0.03em", color: COLORS.white }} />
          <span style={{ fontSize: 96, opacity: ramp(frame, 50, 16) }}>
            <Ref ids={T.titleRefs} size={0.24} />
          </span>
        </div>
      </div>

      {/* --- Proviant -------------------------------------------------- */}
      {frame >= provAt - 2 && frame < provExit + 26 ? (
        <div style={{ position: "absolute", right: 140, top: 330, opacity: 1 - ramp(frame, provExit, 24) }}>
          <div style={{ display: "flex", gap: 28 }}>
            {[IconBiscuit, IconBarrel, IconCheese].map((Icon, i) => (
              <Enter key={i} start={provAt + i * 14} distance={30} blur={10} config={SPRING.gentle}>
                <div style={{ width: 190, padding: "26px 0 20px", borderRadius: 22, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(10,12,18,0.55)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Icon size={92} />
                  <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 24, color: COLORS.white, marginTop: 14 }}>{T.provisions[i]}</div>
                </div>
              </Enter>
            ))}
          </div>
          <div style={{ height: 30 }} />
          <Enter start={provAt + 110} distance={26} blur={10}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", borderRadius: 22, border: `1px solid ${COLORS.orange}55`, background: "rgba(255,138,36,0.08)" }}>
              <IconNoFruit size={76} strike={ramp(frame, provAt + 130, 22, EASE.inOut)} />
              <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 40, color: COLORS.white, letterSpacing: "-0.01em" }}>
                {T.noFresh}
                <Ref ids={T.provisionsRefs} />
              </span>
            </div>
          </Enter>
        </div>
      ) : null}

      {/* --- Tödliche Krankheit ------------------------------------- */}
      {frame >= fatalAt - 2 && frame < fatalExit + 26 ? (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Reveal text={T.fatal} start={fatalAt + 8} stagger={4} from="none" blur={16} exitStart={fatalExit} style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 70, letterSpacing: "-0.025em", color: COLORS.white }} />
            <span style={{ fontSize: 70, opacity: ramp(frame, fatalAt + 30, 16) * (1 - ramp(frame, fatalExit, 16)) }}>
              <Ref ids={T.fatalRefs} size={0.3} />
            </span>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* --- Zeitachse 1747 / 1795 ------------------------------------- */}
      {frame >= tlAt - 2 ? (
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <DrawPath d="M 200 170 L 1720 170" progress={ramp(frame, tlAt, 50, EASE.inOut)} stroke="rgba(255,255,255,0.35)" width={2} />
            {[0, 1].map((k) => {
              const x = k === 0 ? 520 : 1300;
              const p = springAt(frame, fps, tlAt + 14 + k * 290, SPRING.gentle);
              return (
                <g key={k}>
                  <circle cx={x} cy={170} r={12 * p} fill={COLORS.orange} />
                  <circle cx={x} cy={170} r={28 * p} fill="none" stroke={COLORS.orange} strokeOpacity={0.4 * p} strokeWidth={2} />
                </g>
              );
            })}
          </svg>
          {T.events.map((ev, k) => {
            const start = tlAt + 18 + k * 290;
            const x = k === 0 ? 520 : 1300;
            return (
              <div key={ev.year} style={{ position: "absolute", left: x - 40, top: 196, width: 600 }}>
                <Reveal text={ev.year} start={start} mode="chars" stagger={3} mask distance={1} blur={3} style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.03em", color: COLORS.orange, lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.6)" }} />
                <div style={{ height: 12 }} />
                <Enter start={start + 14} distance={18} blur={8}>
                  <div style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 38, color: COLORS.white, letterSpacing: "-0.01em", textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}>{ev.title}</div>
                </Enter>
                <div style={{ height: 8 }} />
                <Enter start={start + 26} distance={14} blur={6}>
                  <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 28, color: "#C4C4CC", lineHeight: 1.35, width: 520, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>
                    {ev.text}
                    <Ref ids={T.eventsRefs} />
                  </div>
                </Enter>
              </div>
            );
          })}
          {/* Zitrusfrüchte erscheinen */}
          {[0, 1, 2].map((k) => {
            const p = springAt(frame, fps, tlAt + 70 + k * 8, SPRING.gentle);
            return (
              <div key={k} style={{ position: "absolute", left: 250 + k * 70, top: 40 + (k % 2) * 46, transform: `scale(${p}) rotate(${(1 - p) * 40 + k * 12}deg)`, opacity: Math.min(1, p * 1.5) * (1 - ramp(frame, tlAt + 280, 30) * 0.6) }}>
                <Lemon size={k === 1 ? 120 : 90} />
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
