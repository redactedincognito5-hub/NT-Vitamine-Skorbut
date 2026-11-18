# KI-Hinweis (Transparenz)

KI durfte in diesem Schulprojekt **nur als Hilfsmittel** eingesetzt werden. Diese Datei hält fest,
welche Teile mit KI-Unterstützung entstanden sind und wofür Adem und David selbst verantwortlich sind.

Verwendetes KI-Werkzeug: **Claude (Anthropic), in Claude Code**, Stand November 2026.

## Mit KI-Unterstützung erstellt

| Teil | Dateien | Bemerkung |
|---|---|---|
| Programmcode des Films (Remotion/React/TypeScript) | `src/**`, `remotion.config.ts` | vollständig KI-unterstützt geschrieben |
| Animationen & Bewegungsabläufe | `src/scenes/*`, `src/motion/*` | KI-unterstützt |
| Illustrationen (Orange, Schiff, Meer, Figur, Kollagen, Blutgefäss, Lebensmittel, Icons) | `src/illustrations/*` | als Code gezeichnete Vektorgrafiken, KI-unterstützt; keine fremden Bilder |
| Musik & Soundeffekte | `scripts/generate-audio.mjs` → `public/audio/music`, `public/audio/sfx` | per Code synthetisiert, KI-unterstützt; keine Samples, keine fremde Musik |
| Filmkorn-Textur | `scripts/generate-textures.mjs` → `public/textures/grain.png` | per Code erzeugt |
| **Entwurf** des Sprechertexts | `src/data/narration.json`, `NARRATION.md` | Entwurf – muss von Adem & David geprüft und in eigenen Worten überarbeitet werden |
| **Entwurf** der Bildschirmtexte | `src/data/texts.ts` | Entwurf – bitte prüfen und anpassen |
| Quellenrecherche & Zuordnung der Aussagen | `SOURCES.md`, `src/data/sources.ts` | Die Quellen wurden von der KI geöffnet und gelesen; die belegten Stellen sind wörtlich (bzw. bei MedlinePlus sinngemäss) angegeben. **Bitte jede Quelle selbst nachprüfen.** |
| Dokumentation | `README.md`, `KI-HINWEIS.md`, READMEs in `public/audio/*` | KI-unterstützt |
| Stiltest v2 (3D-Vorschau, ca. 21 s) | `src/preview/*`, `docs/STILTEST-V2.md`, `film/Stiltest-v2_Vitamin-C_Vorschau.mp4` | 3D-Szenen und Texturen per Code, KI-unterstützt; nur Stilprobe |

## Verantwortung von Adem & David

- **Fachliche Richtigkeit:** jede Aussage mit den Quellen vergleichen, offene Punkte in
  [SOURCES.md → «Bitte selbst prüfen»](SOURCES.md#bitte-selbst-prüfen-nicht-vollständig-belegt-oder-widersprüchlich) klären.
- **Redaktionelle Entscheidungen:** Was bleibt im Film, was wird gekürzt, umformuliert oder ergänzt?
- **Sprachaufnahmen:** von Adem und David selbst gesprochen (keine künstlichen Stimmen).
- **Endfassung des Films:** Abnahme und Abgabe.

## Was nicht behauptet werden soll

KI-unterstützt erstellte Teile dürfen **nicht** als von Hand gemacht ausgegeben werden. Wenn ihr Teile
selbst überarbeitet oder neu gestaltet, könnt ihr das hier ergänzen:

| Was wurde von uns geändert / selbst gemacht? | Wer? | Datum |
|---|---|---|
| *(z. B. Sprechertext Szene 2 in eigenen Worten umgeschrieben)* | | |
| | | |
