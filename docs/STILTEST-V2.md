# Stiltest v2 – «Premium Science Motion Design»

**Nur eine Stilprobe (ca. 21 s).** Version 1 des Films bleibt unverändert
(`film/Vitamine-und-Skorbut_1080p.mp4`, Komposition «VitamineSkorbut»).

- Video: [`film/Stiltest-v2_Vitamin-C_Vorschau.mp4`](../film/Stiltest-v2_Vitamin-C_Vorschau.mp4) – 21 s, 1920 × 1080, 30 fps, H.264/AAC, 17 MB
- Code: [`src/preview/`](../src/preview/) (Komposition «StilTest»)

## Inhalt der Probe

| Zeit | Bild | Text |
|---|---|---|
| 0:00–0:07 | Eine Orange wird in einem dunklen Raum langsam von einem weichen Führungslicht enthüllt. Kühles Kantenlicht, Staub im Licht, leichte Kamerafahrt. | – (bewusst kein Text) |
| 0:07–0:13 | Ein sauberer Schnitt: Die obere Hälfte gleitet weg, die untere zeigt ihre leuchtende Schnittfläche (Segmente, Saftbläschen). | «Vitamin C» · «Ascorbinsäure» |
| 0:13–0:15 | Die Kamera taucht in die leuchtende Schnittfläche – weiche Lichtblende als Übergang. | – |
| 0:15–0:21 | Kollagen als schematisches Molekülmodell (Dreifach-Helix aus Kugeln), Tiefe durch Nebel und weitere Moleküle im Hintergrund. | «Vitamin C wird gebraucht, um Kollagen zu bilden.» [1] |

## Was sich gegenüber Version 1 ändert

| Version 1 | Stiltest v2 |
|---|---|
| Flache 2D-Vektorgrafik (SVG) | Echte 3D-Szene (three.js): Licht, Glanz, Schatten, Tiefe |
| Viel Text, viele animierte Wörter | Wenige Wörter, Text nur wo er hilft |
| Wörter hüpfen/zoomen einzeln herein | Text wird ruhig über eine weiche Maske aufgedeckt – er bewegt sich nicht (kein Flimmern) |
| Schnelle Wechsel, viele Effekte | Lange, ruhige Einstellungen; eine Kamerabewegung pro Einstellung |
| Grossbuchstaben, sehr fett | Zurückhaltende Typografie (Inter Display Semibold, normale Schreibweise) |
| Kollagen als flache Wellenlinien | Kollagen als glänzendes Molekülmodell mit Tiefenstaffelung |

Gleich geblieben: dunkle Farbpalette, Vitamin-C-Orange als Akzent, Schrift Inter, Quellenmarker, Musik.

## Selbst ansehen / rendern

```bash
npm run studio
```

Im Studio links die Komposition **«StilTest»** auswählen.

```bash
npm run render:stiltest
```

Ergebnis: `out/stiltest-v2.mp4`. Der Befehl verwendet `--gl=angle` (Grafikkarte des Macs).
Falls die 3D-Bilder schwarz bleiben, stattdessen mit Software-Grafik rendern (langsamer):

```bash
npx remotion render src/index.ts StilTest out/stiltest-v2.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --gl=swiftshader
```

## Technische Hinweise & ehrliche Grenzen

- **Alles kostenlos:** three.js (MIT), @react-three/fiber (MIT), @remotion/three. Keine Fotos, keine gekauften 3D-Modelle,
  keine Cloud-Dienste. Texturen (Schale, Schnittfläche) sind per Code gezeichnet (`src/preview/textures.ts`).
- **Gerendert in der Testumgebung ohne Grafikkarte** (Software-WebGL «SwiftShader»). Auf dem Mac sollte die Grafikkarte
  genutzt werden (`--gl=angle`); das wurde **nicht auf einem Mac getestet**.
- **Keine echte Tiefenunschärfe/Bloom-Nachbearbeitung:** Diese Effekte sind angenähert (Nebel, weiche Lichthöfe,
  unscharfe Lichtpunkte im Vorder-/Hintergrund), weil echte Nachbearbeitung das Rendern stark verlangsamen würde.
- **Die Orange ist stilisiert-realistisch**, kein Foto: Poren, Glanz und Saftbläschen sind prozedural. Aus der Nähe
  erkennt man, dass es eine Computergrafik ist.
- **Kollagen ist schematisch:** Die Dreifach-Helix aus Kugeln zeigt das Prinzip, nicht die echte Atomstruktur.
- **Renderzeit (gemessen in der Testumgebung, 4 Kerne, Software-Grafik):** Stiltest 21 s Film → 4,6 Minuten
  (ca. 13 s Rechenzeit pro Filmsekunde). Version 1: 178 s Film → 13 Minuten (ca. 4,4 s pro Filmsekunde).
  Der 3D-Stil ist also etwa **dreimal so aufwendig** zu rendern. Mit Grafikkarte (Mac) dürfte es schneller gehen – nicht gemessen.
- Musik: Ausschnitt der bereits vorhandenen, per Code erzeugten Musik (`public/audio/music/score.mp3`, ab 0:54).

## KI-Hinweis

Diese Stilprobe (Code, 3D-Szenen, Texturen) wurde **KI-unterstützt erstellt** (Claude, Anthropic).
Ob dieser Stil für den ganzen Film übernommen wird, entscheiden Adem und David.
