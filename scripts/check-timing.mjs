/**
 * Prüft die Zeitplanung des Films:
 *  - Gesamtlänge ≤ 180 s
 *  - jeder Sprechertext passt in seine Szene
 *  - Sprechtempo realistisch (Wörter pro Sekunde)
 *  - keine Überschneidungen zwischen Sprechertexten
 *
 *   npm run check:timing
 */
import { readFileSync } from "node:fs";

const timeline = JSON.parse(readFileSync(new URL("../src/data/timeline.json", import.meta.url)));
const narration = JSON.parse(readFileSync(new URL("../src/data/narration.json", import.meta.url)));
const MAX = 180;
let ok = true;
const fail = (msg) => { ok = false; console.log(`  ✗ ${msg}`); };

const scenes = {};
let t = 0;
console.log("\nSZENEN");
for (const s of timeline.scenes) {
  scenes[s.id] = { start: t, seconds: s.seconds, title: s.title };
  const fmt = (x) => `${Math.floor(x / 60)}:${String((x % 60).toFixed(0)).padStart(2, "0")}`;
  console.log(`  ${fmt(t).padStart(5)} – ${fmt(t + s.seconds).padStart(5)}  ${String(s.seconds).padStart(3)} s  ${s.title}`);
  t += s.seconds;
}
console.log(`  Gesamt: ${t} s (${(t * timeline.fps).toFixed(0)} Frames bei ${timeline.fps} fps, ${timeline.width}×${timeline.height})`);
if (t > MAX) fail(`Gesamtlänge ${t} s ist länger als ${MAX} s!`);

console.log("\nSPRECHERTEXT");
const wps = narration.wordsPerSecond ?? 2.3;
let words = 0;
const abs = [];
for (const c of narration.cues) {
  const sc = scenes[c.scene];
  if (!sc) { fail(`${c.id}: unbekannte Szene «${c.scene}»`); continue; }
  const w = c.text.split(/\s+/).filter(Boolean).length;
  words += w;
  const need = w / wps;
  const end = c.startSec + c.durationSec;
  const flag = [];
  if (end > sc.seconds + 0.01) flag.push(`endet nach Szenenende (${end.toFixed(1)} > ${sc.seconds} s)`);
  if (need > c.durationSec + 0.6) flag.push(`zu viel Text: ca. ${need.toFixed(1)} s nötig, ${c.durationSec} s geplant`);
  console.log(`  ${c.id} ${c.speaker.padEnd(6)} ${String(w).padStart(3)} Wörter  ~${need.toFixed(1).padStart(4)} s / ${String(c.durationSec).padStart(4)} s  ${flag.length ? "⚠ " + flag.join("; ") : "✓"}`);
  if (flag.length) ok = false;
  abs.push({ id: c.id, a: sc.start + c.startSec, b: sc.start + end });
}
abs.sort((x, y) => x.a - y.a);
for (let i = 1; i < abs.length; i++) if (abs[i].a < abs[i - 1].b - 0.01) fail(`${abs[i - 1].id} und ${abs[i].id} überschneiden sich`);
const spk = {};
for (const c of narration.cues) spk[c.speaker] = (spk[c.speaker] ?? 0) + c.text.split(/\s+/).length;
console.log(`  Wörter gesamt: ${words} · Verteilung: ${Object.entries(spk).map(([k, v]) => `${k} ${v}`).join(", ")}`);

console.log(ok ? "\n✓ Zeitplanung in Ordnung.\n" : "\n✗ Bitte die markierten Punkte prüfen.\n");
process.exit(ok ? 0 : 1);
