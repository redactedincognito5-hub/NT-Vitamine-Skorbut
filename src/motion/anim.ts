/**
 * Kleine Hilfsfunktionen für Animationen.
 * Alle Funktionen sind «rein»: gleiche Eingabe → gleiches Bild.
 * Das ist wichtig, weil Remotion jedes Bild einzeln (und parallel) rendert.
 */
import { interpolate, spring, type SpringConfig } from "remotion";
import { EASE, SPRING } from "../design/theme";

type EasingFn = (t: number) => number;

/** 0 → 1 zwischen start und start + duration (mit Easing, begrenzt). */
export const ramp = (frame: number, start: number, duration: number, easing: EasingFn = EASE.out) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Einblenden und wieder ausblenden: 0 → 1 → 0. */
export const inOut = (
  frame: number,
  inStart: number,
  inDuration: number,
  outStart: number,
  outDuration: number,
  easeIn: EasingFn = EASE.out,
  easeOut: EasingFn = EASE.in,
) => ramp(frame, inStart, inDuration, easeIn) * (1 - ramp(frame, outStart, outDuration, easeOut));

/** Feder-Animation ab einem bestimmten Frame. */
export const springAt = (
  frame: number,
  fps: number,
  start: number,
  config: Partial<SpringConfig> = SPRING.smooth,
  durationInFrames?: number,
) => spring({ frame: frame - start, fps, config, durationInFrames });

/** Lineare Mischung zwischen a und b. */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/**
 * «Bewegungsunschärfe»: Unschärfe proportional zur Geschwindigkeit eines Werts.
 * fn(frame) liefert z. B. eine Position in px.
 */
export const velocityBlur = (fn: (f: number) => number, frame: number, strength = 0.08, max = 14) =>
  Math.min(max, Math.abs(fn(frame) - fn(frame - 1)) * strength);

/** Weiche, deterministische Schwingung (für Schweben, Atmen, Wellen). */
export const wave = (frame: number, periodFrames: number, phase = 0) =>
  Math.sin((frame / periodFrames) * Math.PI * 2 + phase);
