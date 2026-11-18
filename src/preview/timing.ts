/**
 * STILTEST v2 – Zeitplan in Frames (30 fps). Gesamt 630 Frames = 21 s.
 */
export const T = {
  total: 630,
  /** Orange wird durch Licht enthüllt: 0 – cutStart */
  cutStart: 200,
  /** Titel «Vitamin C / Ascorbinsäure» */
  titleIn: 254,
  titleOut: 382,
  /** Kamera taucht in die leuchtende Schnittfläche */
  pushStart: 384,
  pushEnd: 446,
  /** Lichtblende als Übergang (Höhepunkt) */
  bloomPeak: 438,
  /** Kollagen-Szene startet (unter der Lichtblende) */
  helixStart: 420,
  captionIn: 478,
  /** Schlussblende */
  fadeOut: 596,
} as const;
