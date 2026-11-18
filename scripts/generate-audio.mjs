/**
 * ERZEUGT DIE MUSIK UND DIE SOUNDEFFEKTE – komplett per Code (Klangsynthese).
 * Keine Samples, keine fremde Musik → keine Urheberrechts- oder Lizenzfragen.
 * (Das Skript wurde KI-unterstützt geschrieben.)
 *
 *   npm run audio
 *
 * Ausgabe:
 *   public/audio/music/score.mp3   – ruhige Hintergrundmusik, passend zu den Szenenlängen
 *   public/audio/sfx/*.mp3         – whoosh, whoosh-long, hit-soft, hit-deep, shimmer
 *
 * Braucht ffmpeg zum Umwandeln in MP3. Falls kein ffmpeg installiert ist, wird
 * automatisch das ffmpeg von Remotion verwendet («npx remotion ffmpeg»).
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const SR = 44100;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const timeline = JSON.parse(readFileSync(path.join(root, "src/data/timeline.json"), "utf8"));

/* ------------------------------------------------------------------ */
/* Grundbausteine                                                       */
/* ------------------------------------------------------------------ */

let seed = 20261122;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const NOTE = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
const n = (name) => {
  const m = name.match(/^([A-G][#b]?)(-?\d)$/);
  return midiToHz(12 * (Number(m[2]) + 1) + NOTE[m[1]]);
};

/** Weiche Wellenform (wenige Obertöne) als Tabelle → schnell. */
const TABLE_SIZE = 4096;
const softSaw = new Float32Array(TABLE_SIZE);
for (let i = 0; i < TABLE_SIZE; i++) {
  let v = 0;
  for (let h = 1; h <= 7; h++) v += Math.sin((2 * Math.PI * h * i) / TABLE_SIZE) / Math.pow(h, 1.6);
  softSaw[i] = v * 0.7;
}
const lookup = (table, phase) => table[Math.floor(phase * TABLE_SIZE) & (TABLE_SIZE - 1)];

const makeBuffer = (seconds) => [new Float32Array(Math.ceil(seconds * SR)), new Float32Array(Math.ceil(seconds * SR))];

/** Einfacher Hall (Schroeder: 4 Kammfilter + 2 Allpässe). */
const reverb = ([L, R], { mix = 0.3, size = 1 } = {}) => {
  const proc = (input, offset) => {
    const combs = [1557, 1617, 1491, 1422].map((d) => ({ buf: new Float32Array(Math.round((d + offset) * size)), i: 0, fb: 0.82, lp: 0 }));
    const aps = [225, 556].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
    const out = new Float32Array(input.length);
    for (let s = 0; s < input.length; s++) {
      let acc = 0;
      for (const c of combs) {
        const y = c.buf[c.i];
        c.lp = y * 0.6 + c.lp * 0.4; // Dämpfung der Höhen
        c.buf[c.i] = input[s] + c.lp * c.fb;
        c.i = (c.i + 1) % c.buf.length;
        acc += y;
      }
      acc *= 0.25;
      for (const a of aps) {
        const y = a.buf[a.i];
        const x = acc + y * 0.5;
        a.buf[a.i] = x;
        a.i = (a.i + 1) % a.buf.length;
        acc = y - x * 0.5;
      }
      out[s] = input[s] * (1 - mix) + acc * mix;
    }
    return out;
  };
  return [proc(L, 0), proc(R, 23)];
};

/** Tiefpass erster Ordnung (in place). */
const lowpass = (buf, cutoffHz) => {
  const a = Math.exp((-2 * Math.PI * cutoffHz) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    y = buf[i] * (1 - a) + y * a;
    buf[i] = y;
  }
};

/** Bandpass (Biquad) mit zeitabhängiger Mittenfrequenz. */
const bandpassSweep = (input, freqAt, q = 2) => {
  const out = new Float32Array(input.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const f = freqAt(i / SR);
    const w = (2 * Math.PI * f) / SR;
    const alpha = Math.sin(w) / (2 * q);
    const b0 = alpha, b2 = -alpha, a0 = 1 + alpha, a1 = -2 * Math.cos(w), a2 = 1 - alpha;
    const x0 = input[i];
    const y0 = (b0 * x0 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x0; y2 = y1; y1 = y0;
    out[i] = y0;
  }
  return out;
};

const env = (t, a, d, total) => {
  if (t < 0 || t > total) return 0;
  const att = Math.min(1, t / a);
  const rel = Math.min(1, (total - t) / d);
  return Math.min(att, rel);
};

const smooth = (x) => x * x * (3 - 2 * x);

/** WAV (16 Bit, Stereo) schreiben. */
const writeWav = (file, [L, R], gain = 1) => {
  const len = L.length;
  const buf = Buffer.alloc(44 + len * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + len * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(len * 4, 40);
  for (let i = 0; i < len; i++) {
    const l = Math.tanh(L[i] * gain), r = Math.tanh(R[i] * gain);
    buf.writeInt16LE(Math.round(l * 32000), 44 + i * 4);
    buf.writeInt16LE(Math.round(r * 32000), 46 + i * 4);
  }
  writeFileSync(file, buf);
};

const normalize = ([L, R], peak = 0.89) => {
  let m = 1e-9;
  for (let i = 0; i < L.length; i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i]));
  const g = peak / m;
  for (let i = 0; i < L.length; i++) { L[i] *= g; R[i] *= g; }
};

/* ------------------------------------------------------------------ */
/* Instrumente                                                          */
/* ------------------------------------------------------------------ */

/** Flächenklang: Akkord von t0 bis t1 mit weichem Ein-/Ausblenden. */
const pad = ([L, R], notes, t0, t1, { vol = 0.12, attack = 2.2, release = 2.6, bright = 1 } = {}) => {
  const s0 = Math.max(0, Math.floor(t0 * SR));
  const s1 = Math.min(L.length, Math.ceil((t1 + release) * SR));
  for (const name of notes) {
    const f = n(name);
    const detune = [0.9965, 1.0035];
    const phases = [rnd(), rnd()];
    const pan = 0.5 + (rnd() - 0.5) * 0.6;
    for (let s = s0; s < s1; s++) {
      const t = s / SR - t0;
      const e = smooth(Math.min(1, t / attack)) * (s / SR > t1 ? smooth(Math.max(0, 1 - (s / SR - t1) / release)) : 1);
      if (e <= 0) continue;
      const lfo = 1 + 0.08 * Math.sin(2 * Math.PI * 0.11 * (s / SR) + f);
      let v = 0;
      for (let k = 0; k < 2; k++) {
        phases[k] = (phases[k] + (f * detune[k]) / SR) % 1;
        v += lookup(softSaw, phases[k]) * (k === 0 ? 1 : bright);
      }
      v *= vol * e * lfo * (f > 600 ? 0.6 : 1);
      L[s] += v * (1 - pan);
      R[s] += v * pan;
    }
  }
};

/** Gezupfter Ton (Sinus + Oberton, schnell abklingend). */
const pluck = ([L, R], name, t, { vol = 0.12, decay = 0.9, pan = 0.5 } = {}) => {
  const f = n(name);
  const s0 = Math.floor(t * SR);
  const len = Math.floor(decay * 4 * SR);
  for (let i = 0; i < len && s0 + i < L.length; i++) {
    const tt = i / SR;
    const e = Math.min(1, tt / 0.004) * Math.exp(-tt / decay);
    const v = (Math.sin(2 * Math.PI * f * tt) + 0.3 * Math.sin(4 * Math.PI * f * tt) * Math.exp(-tt / (decay * 0.4))) * e * vol;
    L[s0 + i] += v * (1 - pan);
    R[s0 + i] += v * pan;
  }
};

/** Tiefer «Herzschlag». */
const heartbeat = ([L, R], t, vol = 0.5) => {
  for (const [dt, a] of [[0, 1], [0.24, 0.7]]) {
    const s0 = Math.floor((t + dt) * SR);
    for (let i = 0; i < SR * 0.5 && s0 + i < L.length; i++) {
      const tt = i / SR;
      const f = 42 + 50 * Math.exp(-tt / 0.03);
      const v = Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt / 0.16) * vol * a;
      L[s0 + i] += v; R[s0 + i] += v;
    }
  }
};

/** Meeresrauschen (gefiltertes Rauschen mit langsamen Wellen). */
const waves = ([L, R], t0, t1, vol = 0.12) => {
  const len = Math.ceil((t1 - t0) * SR);
  const nl = new Float32Array(len), nr = new Float32Array(len);
  for (let i = 0; i < len; i++) { nl[i] = rnd() * 2 - 1; nr[i] = rnd() * 2 - 1; }
  lowpass(nl, 700); lowpass(nl, 900); lowpass(nr, 700); lowpass(nr, 900);
  const s0 = Math.floor(t0 * SR);
  for (let i = 0; i < len && s0 + i < L.length; i++) {
    const t = i / SR;
    const swell = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * t / 7.3 - 1.2), 2);
    const swell2 = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 11.1 + 0.4);
    const e = env(t, 2.5, 3, t1 - t0);
    L[s0 + i] += nl[i] * vol * e * swell * (0.7 + 0.3 * swell2) * 3;
    R[s0 + i] += nr[i] * vol * e * swell * (0.7 + 0.3 * (1 - swell2)) * 3;
  }
};

/* ------------------------------------------------------------------ */
/* Partitur – richtet sich nach src/data/timeline.json                  */
/* ------------------------------------------------------------------ */

const scenes = {};
let cursor = 0;
for (const s of timeline.scenes) {
  scenes[s.id] = { start: cursor, end: cursor + s.seconds, dur: s.seconds };
  cursor += s.seconds;
}
const TOTAL = cursor;
console.log(`Gesamtlänge laut timeline.json: ${TOTAL} s`);

const buildScore = () => {
  const music = makeBuffer(TOTAL + 1);
  const S = scenes;

  // 1 – Einstieg: tiefer Grundton, Spannung, Herzschlag
  pad(music, ["D2", "A2"], S.hook.start + 0.2, S.hook.end - 0.5, { vol: 0.16, attack: 3 });
  pad(music, ["D3", "F3"], S.hook.start + 5.6, S.hook.start + 9.5, { vol: 0.07, attack: 1.5, release: 2 });
  pad(music, ["Eb4"], S.hook.start + 6.0, S.hook.start + 9.2, { vol: 0.025, attack: 2, release: 1.5 });
  for (let t = 6.2; t < 10.4; t += 1.05) heartbeat(music, S.hook.start + t, 0.42);
  pad(music, ["D3", "A3", "E4"], S.hook.start + 11.2, S.hook.end + 1, { vol: 0.06, attack: 2.5 });

  // 2 – Vitamine: neugierig, leicht – Akkordfolge + gezupfte Arpeggien
  const vChords = [
    ["D3", "A3", "C4", "E4", "F4"],
    ["Bb2", "F3", "A3", "D4"],
    ["F2", "C3", "A3", "E4"],
    ["C3", "G3", "D4", "E4"],
  ];
  const vLen = S.vitamine.dur / 8;
  for (let i = 0; i < 8; i++) {
    pad(music, vChords[i % 4], S.vitamine.start + i * vLen, S.vitamine.start + (i + 1) * vLen, { vol: 0.055, attack: 1.8, release: 2.2 });
  }
  const arp = ["D5", "A4", "F5", "E5", "A5", "C5", "D5", "G4"];
  const beat = 60 / 96 / 2;
  for (let t = S.vitamine.start + 2; t < S.vitamine.end - 1; t += beat) {
    const k = Math.round((t - S.vitamine.start) / beat);
    if (k % 8 === 3 || k % 16 === 13) continue;
    pluck(music, arp[k % arp.length], t, { vol: 0.045, decay: 0.45, pan: k % 2 ? 0.3 : 0.7 });
  }

  // 3 – Vitamin C: warm, offen
  const cChords = [
    ["F2", "C3", "A3", "G4"],
    ["Bb2", "F3", "D4", "C5"],
    ["D3", "A3", "F4", "E5"],
    ["C3", "G3", "E4", "D5"],
  ];
  const cLen = S.vitaminc.dur / 4;
  for (let i = 0; i < 4; i++) pad(music, cChords[i], S.vitaminc.start + i * cLen, S.vitaminc.start + (i + 1) * cLen, { vol: 0.06, attack: 2, release: 2.5 });
  const arpC = ["F5", "C5", "A4", "G5", "E5", "C5"];
  for (let t = S.vitaminc.start + 4; t < S.vitaminc.end - 3; t += beat * 2) {
    const k = Math.round((t - S.vitaminc.start) / (beat * 2));
    pluck(music, arpC[k % arpC.length], t, { vol: 0.04, decay: 0.7, pan: k % 2 ? 0.25 : 0.75 });
  }

  // 4 – Skorbut: dunkel, schwebend, langsamer Puls
  pad(music, ["D2", "A2", "D3"], S.skorbut.start, S.skorbut.end, { vol: 0.12, attack: 2.5, release: 3 });
  pad(music, ["F3", "C4"], S.skorbut.start + 4, S.skorbut.start + 20, { vol: 0.04, attack: 4, release: 4 });
  pad(music, ["Eb3", "Bb3"], S.skorbut.start + 18, S.skorbut.end - 2, { vol: 0.035, attack: 5, release: 4 });
  for (let t = S.skorbut.start + 1; t < S.skorbut.end - 2; t += 2.2) heartbeat(music, t, 0.18);

  // 5 – Geschichte: Meer, weite Akkorde, am Ende Morgendämmerung (Dur)
  waves(music, S.geschichte.start - 1, S.geschichte.end + 2, 0.1);
  const hChords = [
    ["D2", "A2", "F3", "A3"],
    ["G2", "D3", "Bb3"],
    ["Bb2", "F3", "D4"],
    ["A2", "E3", "A3", "C#4"],
  ];
  const hLen = (S.geschichte.dur - 6) / 4;
  for (let i = 0; i < 4; i++) pad(music, hChords[i], S.geschichte.start + i * hLen, S.geschichte.start + (i + 1) * hLen, { vol: 0.065, attack: 3, release: 3 });
  pad(music, ["D3", "A3", "F#4", "E5"], S.geschichte.end - 6, S.geschichte.end + 0.5, { vol: 0.06, attack: 4, release: 2 });

  // 6 – Vorbeugen: hell, frisch (D-Dur)
  const pChords = [
    ["D3", "A3", "F#4", "E5"],
    ["G2", "D3", "B3", "F#4"],
    ["B2", "F#3", "D4", "A4"],
    ["A2", "E3", "C#4", "E4"],
  ];
  const pLen = S.praevention.dur / 4;
  for (let i = 0; i < 4; i++) pad(music, pChords[i], S.praevention.start + i * pLen, S.praevention.start + (i + 1) * pLen, { vol: 0.06, attack: 1.4, release: 2 });
  const arpP = ["D5", "F#5", "A5", "E5", "B5", "A5", "F#5", "E5"];
  for (let t = S.praevention.start + 0.6; t < S.praevention.end - 0.5; t += beat) {
    const k = Math.round((t - S.praevention.start) / beat);
    pluck(music, arpP[k % arpP.length], t, { vol: 0.04, decay: 0.38, pan: k % 2 ? 0.3 : 0.7 });
  }

  // 7 – Schluss: Auflösung
  pad(music, ["D2", "A2", "F#3", "C#4", "E4"], S.schluss.start, S.schluss.end + 2, { vol: 0.075, attack: 1.2, release: 4 });
  pluck(music, "D5", S.schluss.start + 0.5, { vol: 0.06, decay: 1.6, pan: 0.4 });
  pluck(music, "A5", S.schluss.start + 2.95, { vol: 0.06, decay: 1.8, pan: 0.6 });

  // 8 – Abspann: ruhige Fläche, ausblenden
  pad(music, ["D3", "A3", "E4"], S.quellen.start, S.quellen.end - 1.5, { vol: 0.05, attack: 2, release: 2.5 });

  const wet = reverb(music, { mix: 0.32, size: 1.15 });
  // Ein- und Ausblenden
  for (let i = 0; i < wet[0].length; i++) {
    const t = i / SR;
    const g = Math.min(1, t / 0.5) * Math.min(1, Math.max(0, (TOTAL - t) / 3));
    wet[0][i] *= g; wet[1][i] *= g;
  }
  normalize(wet, 0.8);
  return wet;
};

/* ------------------------------------------------------------------ */
/* Soundeffekte                                                         */
/* ------------------------------------------------------------------ */

const noise = (seconds) => {
  const a = new Float32Array(Math.ceil(seconds * SR));
  for (let i = 0; i < a.length; i++) a[i] = rnd() * 2 - 1;
  return a;
};

const whoosh = (dur, fLow, fHigh) => {
  const out = makeBuffer(dur + 0.6);
  const peak = dur * 0.62;
  const bp = bandpassSweep(noise(dur + 0.6), (t) => {
    const x = Math.min(1, t / peak);
    const y = t < peak ? x : Math.max(0, 1 - (t - peak) / (dur - peak));
    return fLow + (fHigh - fLow) * y * y;
  }, 1.4);
  for (let i = 0; i < bp.length; i++) {
    const t = i / SR;
    const e = t < peak ? Math.pow(t / peak, 2.2) : Math.exp(-(t - peak) / (dur * 0.18));
    const pan = Math.min(1, t / dur);
    out[0][i] = bp[i] * e * (1.2 - pan * 0.6);
    out[1][i] = bp[i] * e * (0.6 + pan * 0.6);
  }
  const w = reverb(out, { mix: 0.25 });
  normalize(w, 0.85);
  return w;
};

const hit = (dur, f0, f1, airy) => {
  const out = makeBuffer(dur);
  const nz = noise(dur);
  lowpass(nz, 1800);
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR;
    const f = f1 + (f0 - f1) * Math.exp(-t / 0.08);
    const body = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / (dur * 0.28));
    const click = nz[i] * Math.exp(-t / 0.025) * 0.5;
    const air = airy ? Math.sin(2 * Math.PI * n("D6") * t) * 0.04 * Math.exp(-t / 0.9) * Math.min(1, t / 0.05) : 0;
    out[0][i] = body + click + air;
    out[1][i] = body + click * 0.9 + air * 1.1;
  }
  const w = reverb(out, { mix: 0.35, size: 1.3 });
  normalize(w, 0.9);
  return w;
};

const shimmer = (dur) => {
  const out = makeBuffer(dur);
  ["D6", "A6", "E6", "F#6", "A6", "D7"].forEach((name, k) => {
    pluck(out, name, 0.03 + k * 0.07, { vol: 0.25, decay: 0.55 + k * 0.05, pan: k % 2 ? 0.25 : 0.75 });
  });
  const w = reverb(out, { mix: 0.45, size: 1.4 });
  normalize(w, 0.75);
  return w;
};

/* ------------------------------------------------------------------ */
/* Ausgabe                                                              */
/* ------------------------------------------------------------------ */

const tmp = path.join(os.tmpdir(), `vitamine-audio-${process.pid}`);
mkdirSync(tmp, { recursive: true });
mkdirSync(path.join(root, "public/audio/music"), { recursive: true });
mkdirSync(path.join(root, "public/audio/sfx"), { recursive: true });

const toMp3 = (wav, mp3, kbps) => {
  const args = ["-y", "-loglevel", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", `${kbps}k`, mp3];
  try {
    execFileSync("ffmpeg", args, { stdio: "inherit" });
  } catch {
    execFileSync("npx", ["remotion", "ffmpeg", ...args], { stdio: "inherit", cwd: root });
  }
};

const jobs = [
  ["music/score", () => buildScore(), 192],
  ["sfx/whoosh", () => whoosh(1.1, 300, 3200), 160],
  ["sfx/whoosh-long", () => whoosh(2.4, 180, 1800), 160],
  ["sfx/hit-soft", () => hit(2.2, 110, 52, true), 160],
  ["sfx/hit-deep", () => hit(3.2, 85, 38, false), 160],
  ["sfx/shimmer", () => shimmer(2.6), 160],
];

for (const [name, make, kbps] of jobs) {
  const t0 = Date.now();
  const buf = make();
  const wav = path.join(tmp, `${path.basename(name)}.wav`);
  writeWav(wav, buf);
  const mp3 = path.join(root, "public/audio", `${name}.mp3`);
  toMp3(wav, mp3, kbps);
  console.log(`✓ public/audio/${name}.mp3 (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
rmSync(tmp, { recursive: true, force: true });
console.log("Fertig.");
