/**
 * Erzeugt aus src/data/narration.json:
 *  - NARRATION.md        (Sprechertext zum Ablesen, mit Zeiten und Dateinamen)
 *  - docs/untertitel.srt (Untertitel-Datei, z. B. für YouTube oder VLC)
 *
 *   npm run docs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const timeline = JSON.parse(readFileSync(new URL("../src/data/timeline.json", import.meta.url)));
const narration = JSON.parse(readFileSync(new URL("../src/data/narration.json", import.meta.url)));

const scenes = {};
let t = 0;
for (const s of timeline.scenes) { scenes[s.id] = { ...s, start: t }; t += s.seconds; }
const mmss = (x) => `${Math.floor(x / 60)}:${(x % 60).toFixed(1).padStart(4, "0")}`;
const srtTime = (x) => {
  const ms = Math.round(x * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
};

let md = `# Sprechertext – Vitamine & Skorbut

> **Automatisch erzeugt** aus \`src/data/narration.json\` (Befehl: \`npm run docs\`).
> Wenn ihr den Text ändert, ändert ihn in \`narration.json\` und führt \`npm run docs\` aus.
>
> **Hinweis:** Dieser Text ist ein **KI-unterstützter Entwurf**. Adem und David sind für die
> fachlichen Erklärungen verantwortlich: Bitte jeden Satz prüfen, in eigenen Worten anpassen
> und mit den Quellen in [SOURCES.md](SOURCES.md) vergleichen.

**Tempo:** ca. ${narration.wordsPerSecond} Wörter pro Sekunde – ruhig und deutlich sprechen.
**Aufnahme:** eine Datei pro Abschnitt, Dateiname wie in der Spalte «Datei» (Endung .mp3, .wav oder .m4a).
Ablage: \`public/audio/narration/\`. Anleitung: [public/audio/narration/README.md](public/audio/narration/README.md).

`;
let srt = "";
let idx = 1;
let currentScene = null;
for (const c of narration.cues) {
  const sc = scenes[c.scene];
  if (currentScene !== c.scene) {
    currentScene = c.scene;
    md += `\n## ${sc.title} (${mmss(sc.start)} – ${mmss(sc.start + sc.seconds)})\n\n| Zeit | Sprecher | Text | Quellen | Datei |\n|---|---|---|---|---|\n`;
  }
  const a = sc.start + c.startSec, b = a + c.durationSec;
  const refs = c.refs.length ? c.refs.map((r) => `[${r}]`).join(" ") : "–";
  md += `| ${mmss(a)}–${mmss(b)} | **${c.speaker}** | ${c.text} | ${refs} | \`${c.file.split("/").pop()}\` |\n`;
  srt += `${idx++}\n${srtTime(a)} --> ${srtTime(b + 0.3)}\n${c.text}\n\n`;
}
md += `\n---\n\nGesamtlänge des Films: ${t} s. Zahlen in eckigen Klammern = Quellen in [SOURCES.md](SOURCES.md).\n`;

writeFileSync(new URL("../NARRATION.md", import.meta.url), md);
mkdirSync(new URL("../docs/", import.meta.url), { recursive: true });
writeFileSync(new URL("../docs/untertitel.srt", import.meta.url), srt);
console.log("✓ NARRATION.md und docs/untertitel.srt erzeugt.");
