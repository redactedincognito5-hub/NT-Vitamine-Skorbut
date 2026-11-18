/**
 * Rendert Testbilder (PNG) an bestimmten Zeitpunkten – zur Kontrolle der Bildqualität.
 *
 *   npm run frames                 → Standard-Zeitpunkte aus allen Szenen
 *   npm run frames -- 12.5 40 95   → eigene Zeitpunkte in Sekunden
 *
 * Ergebnis: out/frames/*.png
 * Optional: Umgebungsvariable REMOTION_BROWSER = Pfad zu einem Chrome/Chromium.
 */
import path from "node:path";
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const DEFAULT_SECONDS = [
  0.8, 2.5, 4.6, 7.5, 9.0, 11.0, 12.3, 14.0, // Einstieg
  18, 23, 26, 31, 37, 45, 52, 55.5, // Vitamine
  56.5, 59.5, 63, 68, 73, 77, // Vitamin C
  80.5, 86, 92, 97, 101, 108, 112, // Skorbut
  115, 120, 127, 132, 139, 145, // Geschichte
  147, 152, 159, // Vorbeugen
  163, 166, // Schluss
  170, 175, // Quellen
];

const args = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
const seconds = args.length ? args : DEFAULT_SECONDS;
const scale = Number(process.env.SCALE ?? 0.5);

const outDir = path.resolve("out/frames");
mkdirSync(outDir, { recursive: true });

console.log("Bündle das Projekt …");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const composition = await selectComposition({ serveUrl, id: "VitamineSkorbut", browserExecutable });

for (const s of seconds) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = path.join(outDir, `t${String(s.toFixed(1)).padStart(5, "0")}s_f${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale, browserExecutable, imageFormat: "png" });
  console.log(`✓ ${output}`);
}
console.log("Fertig.");
