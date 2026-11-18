# Sprachaufnahmen von Adem & David

Hier kommen eure eigenen Sprachaufnahmen hinein. **Der Film findet sie automatisch** –
ihr müsst keinen Code ändern, solange die Dateinamen stimmen.

## 1. Welche Dateien?

Eine Datei pro Abschnitt. Die genauen Namen und Texte stehen in [`NARRATION.md`](../../../NARRATION.md)
(Spalte «Datei»). Erlaubte Endungen: **.mp3**, **.wav**, **.m4a**, **.aac**.

| Datei | Sprecher | | Datei | Sprecher |
|---|---|---|---|---|
| `01a-adem` | Adem | | `04a-adem` | Adem |
| `01b-adem` | Adem | | `04b-david` | David |
| `01c-david` | David | | `04c-adem` | Adem |
| `02a-adem` | Adem | | `04d-david` | David |
| `02b-david` | David | | `05a-david` | David |
| `02c-adem` | Adem | | `05b-adem` | Adem |
| `02d-david` | David | | `05c-david` | David |
| `02e-adem` | Adem | | `05d-adem` | Adem |
| `03a-david` | David | | `06a-david` | David |
| `03b-adem` | Adem | | `06b-adem` | Adem |
| `03c-david` | David | | `07a-david` | David |
| | | | `07b-adem` | Adem |

Beispiel: `public/audio/narration/02b-david.m4a`

## 2. Aufnehmen (kostenlos)

- **iPhone:** App «Sprachmemos» → Aufnahme → Teilen → «In Dateien sichern». Ergibt `.m4a` – passt direkt.
- **Mac:** QuickTime Player → Ablage → Neue Audioaufnahme → Sichern (`.m4a`).
- **Audacity** (gratis, https://www.audacityteam.org): Aufnehmen → Datei → Exportieren → MP3 oder WAV.

Tipps:
- Leiser Raum, weiche Möbel (Schrank mit Kleidern, Sofa) dämpfen Hall.
- 15–20 cm Abstand zum Mikrofon, nicht direkt hineinblasen.
- **Am Anfang und Ende jeder Datei höchstens ½ Sekunde Stille** – sonst verschiebt sich der Ton.
- Ruhig und deutlich sprechen. Die geplante Dauer steht in `NARRATION.md`.

## 3. Einbauen & prüfen

1. Datei hier ablegen (richtiger Name!).
2. `npm run studio` starten → der Ton ist sofort im Browser zu hören.
3. Passt eine Aufnahme zeitlich nicht, ändert ihr in `src/data/narration.json` bei diesem Abschnitt
   `startSec` (Start innerhalb der Szene) und `durationSec` (Dauer). Danach `npm run check:timing`.
4. Wenn alles passt: `npm run render`.

Während gesprochen wird, wird die Musik automatisch leiser.

## Wichtig

Bitte **keine** künstlich erzeugten Stimmen (Text-to-Speech) verwenden und als eure Stimme ausgeben.
Die Sprachaufnahmen sollen von euch selbst stammen.
