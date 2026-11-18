/**
 * STILTEST v2 – prozedurale Texturen (per Code gezeichnet, keine Fotos).
 * Alles ist «geseedet»: Jeder Render erzeugt exakt dieselben Texturen.
 */
import * as THREE from "three";

/** Kleiner, deterministischer Zufallsgenerator (mulberry32). */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D nicht verfügbar");
  return { c, ctx };
};

const toTexture = (c: HTMLCanvasElement, srgb: boolean) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
};

/**
 * Orangenschale für die ganze Kugel (Breite = Umfang, Höhe = Nordpol bis Südpol).
 * Beide Hälften verwenden dieselbe Textur → keine sichtbare Naht.
 */
export const makePeelTextures = () => {
  const W = 2048;
  const H = 1024;
  const top = true;
  const r = rng(11);
  const color = canvas(W, H);
  const bump = canvas(W, H);

  // Grundfarbe mit leichter Marmorierung
  const g = color.ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#F27D0E");
  g.addColorStop(0.5, "#FF8E1C");
  g.addColorStop(1, "#EE760C");
  color.ctx.fillStyle = g;
  color.ctx.fillRect(0, 0, W, H);
  bump.ctx.fillStyle = "#808080";
  bump.ctx.fillRect(0, 0, W, H);

  void top;
  const theta = (y: number) => (y / H) * Math.PI;

  for (let i = 0; i < 480; i++) {
    const x = r() * W;
    const y = r() * H;
    const rad = 40 + r() * 140;
    const stretch = 1 / Math.max(0.15, Math.sin(theta(y)));
    const tones = ["rgba(255,175,60,0.10)", "rgba(215,90,0,0.09)", "rgba(255,150,30,0.08)", "rgba(190,75,0,0.06)"];
    for (const dx of [0, -W, W]) {
      const gr = color.ctx.createRadialGradient(x + dx, y, 0, x + dx, y, rad);
      gr.addColorStop(0, tones[i % 4]);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      color.ctx.save();
      color.ctx.translate(x + dx, y);
      color.ctx.scale(Math.min(4, stretch), 1);
      color.ctx.translate(-(x + dx), -y);
      color.ctx.fillStyle = gr;
      color.ctx.fillRect(x + dx - rad, y - rad, rad * 2, rad * 2);
      color.ctx.restore();
    }
  }
  // grobe Unebenheiten in der Bump-Map
  for (let i = 0; i < 1400; i++) {
    const x = r() * W;
    const y = r() * H;
    const rad = 10 + r() * 40;
    const v = r() > 0.5 ? 255 : 0;
    const gr = bump.ctx.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(${v},${v},${v},0.06)`);
    gr.addColorStop(1, "rgba(128,128,128,0)");
    bump.ctx.fillStyle = gr;
    bump.ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  // Poren (Öldrüsen der Schale): kleine Vertiefungen
  let placed = 0;
  let guard = 0;
  while (placed < 20000 && guard < 120000) {
    guard++;
    const y = r() * H;
    const s = Math.sin(theta(y));
    if (r() > s) continue; // weniger Poren pro Bildzeile in Polnähe
    const x = r() * W;
    const rad = 1.6 + r() * 2.6;
    const sx = Math.min(5, 1 / Math.max(0.12, s));
    for (const dx of [0, -W, W]) {
      const cx = x + dx;
      if (cx < -20 || cx > W + 20) continue;
      bump.ctx.save();
      bump.ctx.translate(cx, y);
      bump.ctx.scale(sx, 1);
      bump.ctx.beginPath();
      bump.ctx.arc(0, 0, rad * 1.7, 0, Math.PI * 2);
      bump.ctx.fillStyle = "rgba(170,170,170,0.35)"; // leicht erhöhter Rand
      bump.ctx.fill();
      bump.ctx.beginPath();
      bump.ctx.arc(0, 0, rad, 0, Math.PI * 2);
      bump.ctx.fillStyle = "rgba(40,40,40,0.75)";
      bump.ctx.fill();
      bump.ctx.restore();
      color.ctx.save();
      color.ctx.translate(cx, y);
      color.ctx.scale(sx, 1);
      color.ctx.beginPath();
      color.ctx.arc(0, 0, rad * 0.9, 0, Math.PI * 2);
      color.ctx.fillStyle = "rgba(150,60,0,0.16)";
      color.ctx.fill();
      color.ctx.restore();
    }
    placed++;
  }
  return { map: toTexture(color.c, true), bump: toTexture(bump.c, false) };
};

/**
 * Schnittfläche einer Orange (von oben gesehen): Schale, weisse Haut,
 * Segmente mit Saftbläschen, Trennhäute, Mitte.
 * map = Farbe, glow = nur leuchtende Saftbläschen (für Gegenlicht & Relief).
 */
export const makeFaceTextures = () => {
  const S = 1024;
  const c = S / 2;
  const R = S / 2 - 2;
  const r = rng(77);
  const map = canvas(S, S);
  const glow = canvas(S, S);
  glow.ctx.fillStyle = "#000";
  glow.ctx.fillRect(0, 0, S, S);

  const m = map.ctx;
  // Schale
  m.beginPath();
  m.arc(c, c, R, 0, Math.PI * 2);
  m.fillStyle = "#E9720C";
  m.fill();
  // weisse Haut (Albedo) mit weichem Übergang
  const pith = m.createRadialGradient(c, c, R * 0.86, c, c, R * 0.965);
  pith.addColorStop(0, "#FFE9C8");
  pith.addColorStop(0.75, "#FBEBD4");
  pith.addColorStop(1, "#F3C48A");
  m.beginPath();
  m.arc(c, c, R * 0.962, 0, Math.PI * 2);
  m.fillStyle = pith;
  m.fill();

  const N = 11;
  const r0 = R * 0.1;
  const r1 = R * 0.885;
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2 + (r() - 0.5) * 0.04;
    const a1 = ((i + 1) / N) * Math.PI * 2 + (r() - 0.5) * 0.04;
    const gap = 0.018;
    const wedge = (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.moveTo(c + Math.cos(a0 + gap * 2) * r0, c + Math.sin(a0 + gap * 2) * r0);
      ctx.lineTo(c + Math.cos(a0 + gap) * r1, c + Math.sin(a0 + gap) * r1);
      ctx.arc(c, c, r1, a0 + gap, a1 - gap);
      ctx.lineTo(c + Math.cos(a1 - gap * 2) * r0, c + Math.sin(a1 - gap * 2) * r0);
      ctx.closePath();
    };
    // Segment-Grundfarbe
    const sg = m.createRadialGradient(c, c, r0, c, c, r1);
    sg.addColorStop(0, "#FFB24E");
    sg.addColorStop(0.45, "#FF9120");
    sg.addColorStop(1, "#EE7208");
    wedge(m);
    m.fillStyle = sg;
    m.fill();
    // Saftbläschen
    for (const ctx of [m, glow.ctx]) {
      ctx.save();
      wedge(ctx);
      ctx.clip();
    }
    const count = 170;
    for (let k = 0; k < count; k++) {
      const rr = r0 + (0.08 + r() * 0.92) * (r1 - r0);
      const aa = a0 + (0.06 + r() * 0.88) * (a1 - a0);
      const len = R * (0.05 + r() * 0.06);
      const wid = R * (0.011 + r() * 0.012) * (0.6 + (rr / R) * 0.7);
      const x = c + Math.cos(aa) * rr;
      const y = c + Math.sin(aa) * rr;
      const tone = r();
      // Farbe
      m.save();
      m.translate(x, y);
      m.rotate(aa + (r() - 0.5) * 0.25);
      const vg = m.createLinearGradient(-len / 2, 0, len / 2, 0);
      vg.addColorStop(0, tone > 0.5 ? "rgba(255,196,110,0.6)" : "rgba(255,170,70,0.55)");
      vg.addColorStop(1, tone > 0.5 ? "rgba(225,95,0,0.6)" : "rgba(205,85,0,0.5)");
      m.beginPath();
      m.ellipse(0, 0, len / 2, wid, 0, 0, Math.PI * 2);
      m.fillStyle = vg;
      m.fill();
      m.strokeStyle = "rgba(255,226,180,0.28)";
      m.lineWidth = 1.2;
      m.stroke();
      // Glanzpunkt
      m.beginPath();
      m.ellipse(-len * 0.15, -wid * 0.3, len * 0.12, wid * 0.28, 0, 0, Math.PI * 2);
      m.fillStyle = "rgba(255,246,225,0.35)";
      m.fill();
      m.restore();
      // Leuchtkarte
      const gctx = glow.ctx;
      gctx.save();
      gctx.translate(x, y);
      gctx.rotate(aa);
      const gg = gctx.createRadialGradient(0, 0, 0, 0, 0, len / 2);
      gg.addColorStop(0, `rgba(255,${200 + Math.round(tone * 40)},150,0.85)`);
      gg.addColorStop(1, "rgba(255,120,20,0.0)");
      gctx.beginPath();
      gctx.ellipse(0, 0, len / 2, wid * 1.1, 0, 0, Math.PI * 2);
      gctx.fillStyle = gg;
      gctx.fill();
      gctx.restore();
    }
    m.restore();
    glow.ctx.restore();
    // Trennhaut
    m.save();
    wedge(m);
    m.strokeStyle = "rgba(255,236,205,0.8)";
    m.lineWidth = 3;
    m.stroke();
    m.restore();
  }
  // Mitte
  m.beginPath();
  for (let k = 0; k <= 22; k++) {
    const a = (k / 22) * Math.PI * 2;
    const rad = r0 * (k % 2 ? 0.75 : 1.25);
    const x = c + Math.cos(a) * rad;
    const y = c + Math.sin(a) * rad;
    if (k === 0) m.moveTo(x, y);
    else m.lineTo(x, y);
  }
  m.closePath();
  m.fillStyle = "#FFF0D8";
  m.fill();
  return { map: toTexture(map.c, true), glow: toTexture(glow.c, true) };
};

/** Weicher runder Punkt für Partikel. */
export const makeDotTexture = () => {
  const { c, ctx } = canvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return toTexture(c, true);
};
