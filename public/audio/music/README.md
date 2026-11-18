# Musik

`score.mp3` ist **per Code erzeugt** (Klangsynthese, `scripts/generate-audio.mjs`) – keine Samples,
keine fremde Musik, keine Lizenzkosten. Die Akkordwechsel passen zu den Szenenlängen in
`src/data/timeline.json`. Nach Änderungen an den Szenenlängen: `npm run audio`.

Eigene Musik verwenden? Nur Musik, die ihr selbst gemacht habt oder die nachweislich lizenzfrei ist
(mit Quellenangabe in SOURCES.md). Datei als `score.mp3` hier ablegen. Lautstärke: `src/audio/Soundtrack.tsx`
(`MUSIC_VOLUME`). Musik ausschalten: Prop `musik` auf `false` (im Studio rechts).
