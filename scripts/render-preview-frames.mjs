/**
 * Testbilder der Stilprobe «StilTest» (3D, braucht WebGL).
 *   node scripts/render-preview-frames.mjs 30 100 225   → Frame-Nummern
 * Ergebnis: out/preview/frames/*.png
 */
import path from "node:path";
import { mkdirSync } from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const frames = process.argv.slice(2).map(Number);
const outDir = path.resolve("out/preview/frames");
mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromiumOptions = { gl: process.env.REMOTION_GL || "swiftshader" };
const composition = await selectComposition({ serveUrl, id: "StilTest", browserExecutable, chromiumOptions });
const scale = Number(process.env.SCALE ?? 0.5);
for (const frame of frames) {
  const t0 = Date.now();
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, scale, browserExecutable, chromiumOptions, imageFormat: "png" });
  console.log(`✓ ${output} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
