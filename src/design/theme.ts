/**
 * DESIGN-SYSTEM – Farben, Schriften, Bewegungskurven.
 * Änderungen hier wirken sich auf den ganzen Film aus.
 */
import { Easing } from "remotion";

export const COLORS = {
  // Primär
  bg: "#08090D", // Fast-Schwarz
  bgLift: "#12141B", // leicht aufgehelltes Schwarz (Lichtkegel)
  white: "#FFFFFF",
  grey: "#A1A1AA", // Soft Grey
  greyDim: "#5B5B66",
  hairline: "rgba(255,255,255,0.14)",
  // Akzente
  orange: "#FF8A24", // Vitamin-C-Orange
  orangeLight: "#FFB872",
  orangeDeep: "#C85A0C",
  green: "#9DE06D", // Fresh Green
  greenDeep: "#4E8F35",
  blue: "#4DA9FF", // Medical Blue
  blueDeep: "#1F5FA8",
  // Sehr sparsam eingesetzt: schematische Darstellung von Blut (Szene Skorbut)
  blood: "#D9434B",
  // Helle Szene (Vorbeugen)
  paper: "#F4F5F0",
  ink: "#0B0C10",
  inkSoft: "#5B5E66",
} as const;

export const FONTS = {
  display: "'Inter Display', 'Inter', system-ui, sans-serif",
  text: "'Inter', system-ui, sans-serif",
} as const;

/** Typografische Skala (px bei 1920 × 1080). */
export const TYPE = {
  mega: 230,
  hero: 168,
  h1: 120,
  h2: 84,
  h3: 56,
  lead: 40,
  body: 32,
  small: 26,
  micro: 20,
} as const;

/** Bewegungskurven – überall dieselben, damit der Film einheitlich wirkt. */
export const EASE = {
  /** Sanftes, «teures» Abbremsen – Standard für Einblendungen. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Weiche Beschleunigung + Abbremsen – für Kamerafahrten. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Langsames Anlaufen – für Ausblendungen. */
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Sehr weich – für lange Drifts. */
  soft: Easing.bezier(0.37, 0, 0.63, 1),
} as const;

/** Feder-Einstellungen für spring(). */
export const SPRING = {
  /** Ohne Überschwingen – elegant. */
  smooth: { damping: 200, stiffness: 80, mass: 1 },
  /** Leichtes Überschwingen – lebendig. */
  gentle: { damping: 16, stiffness: 90, mass: 0.9 },
  /** Schnell & präzise – für kleine Elemente. */
  snappy: { damping: 22, stiffness: 180, mass: 0.6 },
} as const;
