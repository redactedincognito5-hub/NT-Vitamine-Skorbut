/**
 * SZENE 1 – DER EINSTIEG (0:00–0:15)
 * Schwarzer Bildschirm → leuchtendes oranges Teilchen → «EIN EINZIGES VITAMIN.»
 * → Wörter trennen sich → «SEIN FEHLEN KANN TÖDLICH SEIN.» → «WARUM?»
 * → Kamera fliegt durch den Text → Segelschiff in der Nacht.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TEXT } from "../data/texts";
import { COLORS, EASE, FONTS, SPRING } from "../design/theme";
import { mix, ramp, springAt, velocityBlur, wave } from "../motion/anim";
import { Backdrop, Glow, Particles, Vignette } from "../motion/Atmosphere";
import { Hairline, Ref } from "../motion/Graphics";
import { Reveal } from "../motion/Reveal";
import { OCEAN_LAYERS, Ocean, Ship, Sky, waveY } from "../illustrations/Maritime";

const T = TEXT.hook;

const headline: React.CSSProperties = {
  fontFamily: FONTS.display,
  fontWeight: 800,
  color: COLORS.white,
  letterSpacing: "-0.035em",
  lineHeight: 1,
};

export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* --- Teilchen --------------------------------------------------- */
  const pIn = springAt(frame, fps, 6, SPRING.gentle);
  const pRise = ramp(frame, 34, 50, EASE.inOut);
  const pDie = ramp(frame, 168, 34, EASE.in); // «sein Fehlen» – das Licht erlischt
  const flicker = frame > 168 && frame < 205 ? 0.75 + 0.25 * Math.sin(frame * 1.7) : 1;
  const particleY = mix(540, 372, pRise);
  const particleScale = pIn * (1 + 0.08 * wave(frame, 40)) * (1 - pDie);

  /* --- Zeile 1: EIN EINZIGES VITAMIN. ----------------------------- */
  const zoom1 = mix(1.14, 1, ramp(frame, 30, 120, EASE.out));
  const sep = ramp(frame, 118, 52, EASE.inOut);
  const sepOut = ramp(frame, 138, 30, EASE.in);
  const sepX = (f: number) => ramp(f, 118, 52, EASE.inOut) * 300;
  const sepBlur = velocityBlur(sepX, frame, 0.5, 10);

  /* --- Zeile 2: SEIN FEHLEN / KANN TÖDLICH SEIN. ------------------ */
  const darken = ramp(frame, 160, 24);
  const zoom2 = mix(1.07, 1, ramp(frame, 178, 110, EASE.out));
  const line2Exit = 270;

  /* --- Zeile 3: WARUM? + Flug durch den Text --------------------- */
  const push = mix(1, 1.07, ramp(frame, 296, 52, EASE.soft));
  const fly = ramp(frame, 344, 46, EASE.in);
  const flyScale = push * mix(1, 16, fly);
  const flyOpacity = 1 - ramp(frame, 366, 22, EASE.in);
  const flyBlur = fly * 26;

  /* --- Meer & Schiff ------------------------------------------------ */
  const seaIn = ramp(frame, 352, 44, EASE.inOut);
  const seaCam = mix(1.4, 1.0, ramp(frame, 350, 100, EASE.out));
  const horizon = 650;
  const layers = OCEAN_LAYERS(horizon);
  const shipX = 760 + frame * 0.35 - 350 * 0.35;
  const shipBase = waveY(layers[2], shipX + 330, frame);
  const slope = waveY(layers[2], shipX + 430, frame) - waveY(layers[2], shipX + 230, frame);
  const shipRot = (Math.atan2(slope, 200) * 180) / Math.PI * 0.7;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Nachthimmel & Meer (Ende der Szene) */}
      {seaIn > 0 ? (
        <AbsoluteFill style={{ opacity: seaIn, transform: `scale(${seaCam})` }}>
          <Sky horizon={horizon} moonX={1420} moonY={230} />
          <Ocean
            horizon={horizon}
            moonX={1420}
            insertAfterLayer={2}
            insert={
              <g transform={`translate(${shipX} ${shipBase - 425}) rotate(${shipRot} 330 425)`}>
                <Ship width={660} />
              </g>
            }
          />
          <Vignette strength={0.7} />
        </AbsoluteFill>
      ) : null}

      {/* Dunkler Raum mit weichem Licht */}
      <AbsoluteFill style={{ opacity: 1 - seaIn }}>
        <Backdrop intensity={0.8 * (1 - darken * 0.7)} size={60} />
        <Particles count={40} seed="hook-dust" color={COLORS.orangeLight} minSize={1} maxSize={2.6} speed={0.12} opacity={0.35} fade={pIn * (1 - darken * 0.8)} />
      </AbsoluteFill>

      {/* Das Teilchen (das Vitamin) */}
      <Glow x={960} y={particleY} size={260 * particleScale} core opacity={flicker * 0.95} />
      <Glow x={960} y={particleY} size={900 * particleScale} opacity={0.22 * flicker} />

      {/* Zeile 1 */}
      {frame < 175 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${zoom1})` }}>
          <div style={{ ...headline, fontSize: 148, display: "flex", gap: "0.26em", filter: sepBlur > 0.1 ? `blur(${sepBlur}px)` : undefined }}>
            {T.line1.map((word, i) => {
              const dir = i === 0 ? -1 : i === 2 ? 1 : 0;
              return (
                <div
                  key={word}
                  style={{
                    transform: `translateX(${dir * sep * 300}px)`,
                    letterSpacing: i === 1 ? `${-0.035 + sep * 0.12}em` : undefined,
                    opacity: 1 - sepOut,
                  }}
                >
                  <Reveal text={word} start={34 + i * 8} from="bottom" distance={0.35} blur={18} scaleFrom={0.92} config={SPRING.smooth} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Zeile 2 */}
      {frame >= 170 && frame < 300 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${zoom2})` }}>
          <div style={{ textAlign: "center" }}>
            <Reveal
              text={T.line2a}
              start={178}
              mask
              stagger={5}
              distance={1}
              blur={6}
              exitStart={line2Exit}
              style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 64, letterSpacing: "0.14em", color: COLORS.grey }}
            />
            <div style={{ height: 26 }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
              <Reveal text={T.line2b} start={196} mask stagger={7} distance={1} blur={8} exitStart={line2Exit + 2} style={{ ...headline, fontSize: 150 }} />
              <span style={{ fontSize: 150, opacity: ramp(frame, 230, 20) * (1 - ramp(frame, line2Exit, 16)) }}>
                <Ref ids={T.line2Refs} size={0.16} />
              </span>
            </div>
            <div style={{ height: 40 }} />
            <Hairline width={760} progress={ramp(frame, 214, 50, EASE.inOut) * (1 - ramp(frame, line2Exit, 18))} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Zeile 3 */}
      {frame >= 290 && flyOpacity > 0 ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${flyScale})`,
            opacity: flyOpacity,
            filter: flyBlur > 0.1 ? `blur(${flyBlur}px)` : undefined,
          }}
        >
          <Reveal
            text={T.line3}
            start={298}
            mode="chars"
            stagger={3}
            from="none"
            blur={30}
            scaleFrom={1.25}
            config={SPRING.smooth}
            style={{ ...headline, fontWeight: 900, fontSize: 300, letterSpacing: "-0.045em" }}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
