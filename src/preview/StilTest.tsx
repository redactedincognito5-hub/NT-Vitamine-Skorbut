/**
 * STILTEST v2 – «Premium Science Motion Design» (Vorschau, ca. 21 s)
 * --------------------------------------------------------------------
 * Nur eine Stilprobe – die Version 1 des Films bleibt unverändert.
 *
 * Ablauf:
 *  0–6,7 s   Orange wird von einem weichen Führungslicht enthüllt (kein Text)
 *  6,7–13 s  Schnitt: obere Hälfte gleitet weg, leuchtende Schnittfläche,
 *            ruhiger Titel «Vitamin C / Ascorbinsäure»
 *  13–14,5 s Kamera taucht ins Licht der Schnittfläche (Lichtblende)
 *  14,5–21 s Kollagen als schematische Dreifach-Helix mit Tiefe, eine Textzeile
 *
 * Typografie: wenige Wörter, keine hüpfenden Buchstaben, Text wird nur über
 * Deckkraft und eine weiche Maske eingeblendet (kein Bewegen/Skalieren → kein Flimmern).
 */
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Html5Audio, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { COLORS, EASE, FONTS } from "../design/theme";
import { mix, ramp } from "../motion/anim";
import { Grain, Vignette } from "../motion/Atmosphere";
import { Ref } from "../motion/Graphics";
import { OrangeScene, orangeCamera, orangeGroup } from "./OrangeScene";
import { HelixScene } from "./HelixScene";
import { T } from "./timing";

/* ------------------------------------------------------------------ */
/* Bildschirmposition eines 3D-Punkts (für Lichthof & Lichtblende)      */
/* ------------------------------------------------------------------ */
const projCam = new THREE.PerspectiveCamera(26, 16 / 9, 0.05, 60);
const projectOrange = (f: number) => {
  const c = orangeCamera(f);
  const g = orangeGroup(f);
  projCam.fov = c.fov;
  projCam.position.copy(c.position);
  projCam.updateProjectionMatrix();
  projCam.lookAt(c.target);
  projCam.updateMatrixWorld();
  const v = new THREE.Vector3(g.x, g.y, 0).project(projCam);
  return { x: ((v.x + 1) / 2) * 1920, y: ((1 - v.y) / 2) * 1080 };
};

/* ------------------------------------------------------------------ */
/* Text, der nur weich «aufgedeckt» wird                                */
/* ------------------------------------------------------------------ */
const Wipe: React.FC<{ start: number; duration?: number; end?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  start,
  duration = 42,
  end,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, start, duration, EASE.inOut);
  const out = end === undefined ? 0 : ramp(frame, end, 24, EASE.inOut);
  const edge = mix(-20, 110, p);
  const mask = `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 18}%)`;
  return (
    <div style={{ ...style, opacity: Math.min(1, p * 1.4) * (1 - out), WebkitMaskImage: mask, maskImage: mask }}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Weiche Unschärfekreise (Bokeh) für Tiefe – Hinter- und Vordergrund   */
/* ------------------------------------------------------------------ */
const Bokeh: React.FC<{ seed: string; count: number; minR: number; maxR: number; opacity: number; color: string; drift: number }> = ({
  seed,
  count,
  minR,
  maxR,
  opacity,
  color,
  drift,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = minR + random(`${seed}-r-${i}`) * (maxR - minR);
        const x = random(`${seed}-x-${i}`) * 2100 - 90 - frame * drift * (0.5 + random(`${seed}-v-${i}`));
        const y = random(`${seed}-y-${i}`) * 1080 + Math.sin(frame / 200 + i) * 10;
        const o = opacity * (0.4 + 0.6 * random(`${seed}-o-${i}`));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              opacity: o,
              background: `radial-gradient(circle, ${color} 0%, ${color}99 45%, ${color}00 72%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const StilTest: React.FC = () => {
  const frame = useCurrentFrame();

  const orangeVisible = frame < T.bloomPeak;
  const helixVisible = frame >= T.bloomPeak;

  /* Lichthof hinter der Orange */
  const op = projectOrange(Math.min(frame, T.bloomPeak));
  const haloIn = ramp(frame, 20, 120, EASE.inOut);
  const pushP = ramp(frame, T.pushStart, T.pushEnd - T.pushStart, EASE.in);

  /* Lichtblende */
  const bloomUp = ramp(frame, T.pushStart + 8, T.bloomPeak - T.pushStart - 8, EASE.in);
  const bloomDown = ramp(frame, T.bloomPeak, 48, EASE.out);
  const bloom = bloomUp * (1 - bloomDown);

  /* Schluss */
  const fadeOut = ramp(frame, T.fadeOut, T.total - T.fadeOut - 4, EASE.inOut);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Hintergrund: sehr dezenter Raum */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 60% 45%, #141720 0%, #08090D 70%)" }} />
      <Bokeh seed="bg" count={10} minR={30} maxR={90} opacity={0.06} color={helixVisible ? "#9DB7E0" : "#FFB06A"} drift={0.05} />

      {/* Lichthof hinter der Orange */}
      {orangeVisible ? (
        <div
          style={{
            position: "absolute",
            left: op.x - 700,
            top: op.y - 700,
            width: 1400,
            height: 1400,
            borderRadius: "50%",
            opacity: haloIn * (0.3 + pushP * 0.5),
            background: "radial-gradient(circle, rgba(255,140,40,0.35) 0%, rgba(255,120,30,0.12) 30%, rgba(255,120,30,0) 62%)",
          }}
        />
      ) : null}

      {/* 3D: Orange */}
      <Sequence durationInFrames={T.bloomPeak + 2} name="3D Orange" layout="none">
        <AbsoluteFill style={{ opacity: orangeVisible ? 1 : 0 }}>
          <ThreeCanvas width={1920} height={1080} gl={{ antialias: true, alpha: true }} camera={{ fov: 26, position: [0, 0.25, 7] }}>
            <OrangeScene />
          </ThreeCanvas>
        </AbsoluteFill>
      </Sequence>

      {/* 3D: Kollagen */}
      <Sequence from={T.helixStart} name="3D Kollagen" layout="none">
        <AbsoluteFill style={{ opacity: helixVisible ? 1 : 0 }}>
          <ThreeCanvas width={1920} height={1080} gl={{ antialias: true, alpha: true }} camera={{ fov: 30, position: [-3.6, 0.85, 3.7] }}>
            <HelixScene />
          </ThreeCanvas>
        </AbsoluteFill>
      </Sequence>

      {/* Vordergrund-Bokeh (unscharf, sehr dezent) */}
      <Bokeh seed="fg" count={5} minR={120} maxR={220} opacity={0.035} color="#FFFFFF" drift={0.12} />

      {/* Lichtblende als Übergang */}
      {bloom > 0.001 ? (
        <AbsoluteFill
          style={{
            opacity: bloom,
            background: `radial-gradient(circle at ${op.x}px ${op.y}px, rgba(255,246,232,1) 0%, rgba(255,200,140,0.95) 22%, rgba(255,150,70,0.85) 48%, rgba(40,22,10,0.9) 100%)`,
          }}
        />
      ) : null}

      <Vignette strength={0.55} />

      {/* --- Typografie (zurückhaltend) --------------------------------- */}
      <div style={{ position: "absolute", left: 160, top: 404 }}>
        <Wipe start={T.titleIn} end={T.titleOut}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: 118, letterSpacing: "-0.025em", color: COLORS.white, lineHeight: 1 }}>Vitamin C</div>
        </Wipe>
        <div style={{ height: 26 }} />
        <Wipe start={T.titleIn + 22} end={T.titleOut + 4} duration={36}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 48, height: 2, background: COLORS.orange }} />
            <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 24, letterSpacing: "0.34em", color: COLORS.orangeLight }}>ASCORBINSÄURE</div>
          </div>
        </Wipe>
      </div>

      <div style={{ position: "absolute", left: 160, top: 132 }}>
        <Wipe start={T.captionIn} duration={36}>
          <div style={{ fontFamily: FONTS.text, fontWeight: 600, fontSize: 20, letterSpacing: "0.32em", color: COLORS.orangeLight }}>KOLLAGEN</div>
        </Wipe>
        <div style={{ height: 16 }} />
        <Wipe start={T.captionIn + 16} duration={48}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 500, fontSize: 46, letterSpacing: "-0.015em", color: COLORS.white, lineHeight: 1.2, whiteSpace: "nowrap" }}>
            Vitamin C wird gebraucht, um Kollagen zu bilden.
            <Ref ids={[1]} size={0.45} />
          </div>
        </Wipe>
      </div>
      <div style={{ position: "absolute", right: 160, bottom: 150 }}>
        <Wipe start={T.captionIn + 40} duration={30}>
          <div style={{ fontFamily: FONTS.text, fontWeight: 500, fontSize: 18, letterSpacing: "0.08em", color: COLORS.greyDim }}>Schematische Darstellung</div>
        </Wipe>
      </div>

      {/* Kennzeichnung als Stilprobe */}
      <div style={{ position: "absolute", right: 48, top: 40, fontFamily: FONTS.text, fontWeight: 600, fontSize: 15, letterSpacing: "0.24em", color: "rgba(255,255,255,0.28)" }}>
        STILTEST V2 · VORSCHAU
      </div>

      <Grain opacity={0.05} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeOut }} />

      {/* --- Ton: Ausschnitt der vorhandenen, per Code erzeugten Musik --- */}
      <Html5Audio
        src={staticFile("audio/music/score.mp3")}
        trimBefore={54 * 30}
        volume={(f) =>
          0.75 *
          interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
          interpolate(f, [T.total - 50, T.total - 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      <Sequence from={T.cutStart} layout="none" name="SFX Schnitt">
        <Html5Audio src={staticFile("audio/sfx/shimmer.mp3")} volume={0.22} />
      </Sequence>
      <Sequence from={T.pushStart + 6} layout="none" name="SFX Übergang">
        <Html5Audio src={staticFile("audio/sfx/whoosh-long.mp3")} volume={0.28} />
      </Sequence>
    </AbsoluteFill>
  );
};
