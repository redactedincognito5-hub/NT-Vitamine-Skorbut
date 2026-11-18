/**
 * Erzeugt die Filmkorn-Textur public/textures/grain.png (256 × 256, Graustufen).
 * Komplett per Code erzeugt – keine fremden Bilder, keine Lizenzfragen.
 * Ausführen: node scripts/generate-textures.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const W = 256;
const H = 256;

// Deterministischer Zufall (gleiches Ergebnis bei jedem Lauf)
let s = 1337;
const rnd = () => {
  s = (s * 1664525 + 1013904223) >>> 0;
  return s / 4294967296;
};

const raw = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W + 1)] = 0; // Filter: none
  for (let x = 0; x < W; x++) {
    // Summe aus 3 Zufallswerten → weichere (gaussähnliche) Verteilung
    const v = (rnd() + rnd() + rnd()) / 3;
    raw[y * (W + 1) + 1 + x] = Math.round(Math.min(255, Math.max(0, 128 + (v - 0.5) * 2.2 * 255)));
  }
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // Bit-Tiefe
ihdr[9] = 0; // Graustufen
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync(new URL("../public/textures/", import.meta.url), { recursive: true });
writeFileSync(new URL("../public/textures/grain.png", import.meta.url), png);
console.log(`grain.png geschrieben (${png.length} Bytes)`);
