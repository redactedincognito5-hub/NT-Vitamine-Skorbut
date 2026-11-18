# Vitamine & Skorbut

**Animierter Erklärfilm** · Natur & Technik, 3. Sekundarschule · Schweizer Hochdeutsch
Ein Projekt von **Adem & David** · gebaut mit [Remotion](https://www.remotion.dev), React und TypeScript

| | |
|---|---|
| Länge | **2:58** (178 s, inkl. Quellen & Abspann; Maximum 3:00) |
| Format | 1920 × 1080 (16:9), 30 fps, MP4 / H.264 + AAC-Ton |
| Kosten | CHF 0 – nur kostenlose Software, keine Abos, keine Cloud-Dienste |
| Abgabe | 22. November 2026, 12:00 |

## ▶ Der fertige Film

**[`film/Vitamine-und-Skorbut_1080p.mp4`](film/Vitamine-und-Skorbut_1080p.mp4)** – 2:58, 1920 × 1080, 30 fps, H.264/AAC, 37 MB.

Diese Fassung enthält **Musik und Soundeffekte, aber noch keine Sprachaufnahmen** – die nehmen Adem und David
selbst auf (siehe [Sprachaufnahmen einbauen](#sprachaufnahmen-einbauen)). Danach den Film mit `npm run render`
neu erstellen. Tipp: Neue Renderings nicht jedes Mal ins Git-Repository hochladen (grosse Dateien), sondern nur
die Endfassung – und die alte Datei dabei ersetzen.

**Stiltest v2 (nur Vorschau, ca. 21 s):** [`film/Stiltest-v2_Vitamin-C_Vorschau.mp4`](film/Stiltest-v2_Vitamin-C_Vorschau.mp4) –
eine mögliche neue Bildsprache (3D, ruhiger, weniger Text) am Beispiel Vitamin C → Kollagen.
Ändert den Film nicht. Details: [docs/STILTEST-V2.md](docs/STILTEST-V2.md).

> **KI-Hinweis:** Code, Animationen, Illustrationen, Musik und der Entwurf des Sprechertexts wurden
> **mit KI-Unterstützung (Claude, Anthropic)** erstellt. Adem und David sind für die fachlichen
> Erklärungen, die redaktionellen Entscheidungen, die Sprachaufnahmen und den fertigen Film
> verantwortlich. Details: [KI-HINWEIS.md](KI-HINWEIS.md).

---

## Inhalt

1. [Der Film im Überblick](#der-film-im-überblick)
2. [Schnellstart auf dem Mac (Intel-iMac)](#schnellstart-auf-dem-mac-intel-imac)
3. [Checkliste bis zur Abgabe](#checkliste-bis-zur-abgabe-22112026-1200)
4. [Die wichtigsten Befehle](#die-wichtigsten-befehle)
5. [Was ihr selbst anpassen könnt](#was-ihr-selbst-anpassen-könnt)
6. [Sprachaufnahmen einbauen](#sprachaufnahmen-einbauen)
7. [Projektstruktur](#projektstruktur)
8. [Fehlerbehebung](#fehlerbehebung)
9. [Technische Hinweise & Grenzen](#technische-hinweise--grenzen)

---

## Der Film im Überblick

| Zeit | Szene | Inhalt |
|---|---|---|
| 0:00–0:15 | 1 · Einstieg | Leuchtendes oranges Teilchen → «EIN EINZIGES VITAMIN.» → «SEIN FEHLEN KANN TÖDLICH SEIN.» → «WARUM?» → Kamerafahrt durch den Text zum Segelschiff in der Nacht |
| 0:15–0:54 | 2 · Was sind Vitamine? | Molekülfeld, «KLEINE MENGEN. GROSSE WIRKUNG.», Ring der 13 Vitamine, die Vitamine fliegen in zwei Gruppen: fettlöslich (Speicher) und wasserlöslich (Wasserbecher mit Abfluss) |
| 0:54–1:19 | 3 · Vitamin C | Rotierende Orange zerfällt in Schichten → «VITAMIN C / ASCORBINSÄURE», Kollagen als Dreifach-Helix und als Gerüst im Gewebe |
| 1:19–1:53 | 4 · Skorbut | Zeitachse (unter ca. 10 mg/Tag → erste Anzeichen nach etwa 1 Monat), schematisches Blutgefäss mit schwächer werdender Kollagenwand, Symptome an einer abstrakten Figur |
| 1:53–2:24 | 5 · Geschichte | Segelschiff auf nächtlichem Meer, Proviant an Bord, Zeitachse 1747 (James Lind) und 1795 (Zitronensaft), Morgendämmerung |
| 2:24–2:41 | 6 · Vorbeugen | Helle Szene: Peperoni, Kiwi, Broccoli, Orange mit Vitamin-C-Gehalt (Schweizer Werte), «VITAMIN C – REGELMÄSSIG ZUFÜHREN» |
| 2:41–2:48 | 7 · Schluss | «KLEINES VITAMIN. GROSSE BEDEUTUNG.» |
| 2:48–2:58 | 8 · Quellen & Mitwirkende | Gut lesbarer Abspann mit 8 Quellen |

Alle Fakten sind mit Quellen belegt → **[SOURCES.md](SOURCES.md)**.
Sprechertext mit Zeiten → **[NARRATION.md](NARRATION.md)**.

---

## Schnellstart auf dem Mac (Intel-iMac)

### 1. Node.js installieren (einmalig, gratis)

1. https://nodejs.org öffnen → **«LTS»** herunterladen (macOS Installer, `.pkg`). Version 20, 22 oder 24 funktioniert.
2. Installer ausführen.
3. Programm **Terminal** öffnen (Programme → Dienstprogramme → Terminal) und prüfen:

```bash
node --version
```

Es sollte z. B. `v22.x.x` erscheinen.

### 2. Projekt herunterladen

Entweder auf GitHub: **Code → Download ZIP**, entpacken, z. B. in den Ordner «Dokumente».
Oder mit [GitHub Desktop](https://desktop.github.com) klonen. Danach im Terminal in den Ordner wechseln
(Tipp: `cd ` tippen, Leerzeichen, dann den Ordner aus dem Finder ins Terminal ziehen):

```bash
cd ~/Documents/NT-Vitamine-Skorbut
```

### 3. Abhängigkeiten installieren (einmalig, ca. 1–3 Minuten)

```bash
npm ci
```

### 4. Vorschau im Browser öffnen

```bash
npm run studio
```

Im Browser öffnet sich das Remotion Studio (http://localhost:3000). Dort könnt ihr den Film abspielen,
vor- und zurückspulen und rechts bei den **Props** Untertitel, Musik, Effekte und Sprecher ein- oder
ausschalten. Beenden im Terminal mit `Ctrl + C`.

### 5. Den fertigen Film als MP4 rendern

```bash
npm run render
```

Ergebnis: **`out/vitamine-und-skorbut.mp4`**

- Beim **ersten** Rendern lädt Remotion automatisch eine kostenlose Version von Chrome
  («Chrome Headless Shell», ca. 100 MB) herunter. Das passiert nur einmal.
- Dauer: In der Testumgebung (Linux, 4 Prozessorkerne) dauerte das Rendern **13 Minuten**.
  Auf einem Intel-iMac rechnet mit etwa **15–60 Minuten**, je nach Prozessor (nicht auf einem Mac gemessen).
- Schneller Testlauf in halber Auflösung: `npm run render:draft`

---

## Checkliste bis zur Abgabe (22.11.2026, 12:00)

- [ ] Sprechertext in [NARRATION.md](NARRATION.md) lesen, mit den Quellen vergleichen und in eigenen Worten anpassen (in `src/data/narration.json`)
- [ ] Offene Punkte in [SOURCES.md → «Bitte selbst prüfen»](SOURCES.md#bitte-selbst-prüfen-nicht-vollständig-belegt-oder-widersprüchlich) klären
- [ ] Bildschirmtexte in `src/data/texts.ts` prüfen (Rechtschreibung, Inhalt)
- [ ] Sprachaufnahmen machen und in `public/audio/narration/` ablegen
- [ ] Im Studio (`npm run studio`) den ganzen Film mit Ton anschauen; Zeiten bei Bedarf anpassen
- [ ] `npm run check:timing` → muss «✓ Zeitplanung in Ordnung» zeigen
- [ ] Eigene Änderungen in [KI-HINWEIS.md](KI-HINWEIS.md) eintragen
- [ ] `npm run render` → MP4 anschauen (Ton, Länge ≤ 3:00, Lesbarkeit)
- [ ] **Rechtzeitig rendern** – auf einem älteren iMac kann das bis zu einer Stunde dauern

---

## Die wichtigsten Befehle

| Befehl | Was er macht |
|---|---|
| `npm run studio` | Vorschau im Browser (live, Änderungen sofort sichtbar) |
| `npm run render` | Fertiges MP4 in voller Qualität → `out/vitamine-und-skorbut.mp4` |
| `npm run render:draft` | Schneller Entwurf in halber Auflösung |
| `npm run check:timing` | Prüft Gesamtlänge (≤ 180 s) und ob alle Sprechertexte in ihre Szene passen |
| `npm run docs` | Erzeugt `NARRATION.md` und `docs/untertitel.srt` aus dem Sprechertext |
| `npm run frames` | Rendert Testbilder an vielen Zeitpunkten → `out/frames/` |
| `npm run audio` | Erzeugt Musik & Soundeffekte neu (nach geänderten Szenenlängen) |
| `npm run typecheck` | Prüft den Code auf Tippfehler (TypeScript) |

Untertitel einbrennen (z. B. für eine Version ohne Ton):

```bash
npx remotion render src/index.ts VitamineSkorbut out/mit-untertiteln.mp4 --props='{"untertitel":true}'
```

---

## Was ihr selbst anpassen könnt

Alles, was ihr ändern wollt, liegt in wenigen, gut kommentierten Dateien:

| Was | Datei |
|---|---|
| **Alle Texte im Bild** | [`src/data/texts.ts`](src/data/texts.ts) |
| **Sprechertext** (Wortlaut, Sprecher, Zeitpunkt) | [`src/data/narration.json`](src/data/narration.json) → danach `npm run docs` |
| **Szenenlängen**, Soundeffekte | [`src/data/timeline.json`](src/data/timeline.json) → danach `npm run check:timing` und `npm run audio` |
| Quellen im Abspann | [`src/data/sources.ts`](src/data/sources.ts) (und [SOURCES.md](SOURCES.md)) |
| Farben, Schriften, Bewegungskurven | [`src/design/theme.ts`](src/design/theme.ts) |
| Einzelne Szenen (Animation) | [`src/scenes/`](src/scenes/) – eine Datei pro Szene |
| Illustrationen (Orange, Schiff, …) | [`src/illustrations/`](src/illustrations/) |
| Lautstärken | [`src/audio/Soundtrack.tsx`](src/audio/Soundtrack.tsx) |

Tipps:
- Im Studio sieht man jede Änderung sofort, sobald die Datei gespeichert ist.
- Schweizer Hochdeutsch: **«ss» statt «ß»**.
- Wenn ihr einen Fakt ändert oder ergänzt: Quelle in [SOURCES.md](SOURCES.md) eintragen und im Text die Nummer anpassen (`refs`).
- Eigene Ideen sind ausdrücklich erwünscht – z. B. eine eigene Szene, eigene Zeichnungen (als SVG oder PNG in `public/`) oder eine andere Reihenfolge.

---

## Sprachaufnahmen einbauen

Kurzfassung (ausführlich: [public/audio/narration/README.md](public/audio/narration/README.md)):

1. Text aus [NARRATION.md](NARRATION.md) aufnehmen – eine Datei pro Abschnitt (z. B. mit «Sprachmemos» auf dem iPhone).
2. Datei mit dem richtigen Namen in `public/audio/narration/` legen, z. B. `02b-david.m4a`.
3. `npm run studio` → die Aufnahme ist sofort im Film. Die Musik wird beim Sprechen automatisch leiser.
4. Zeit anpassen, falls nötig: `startSec` / `durationSec` in `src/data/narration.json`.

Fehlende Aufnahmen sind kein Problem: Der Film rendert auch ohne Sprache (dann nur mit Musik und Effekten).

---

## Projektstruktur

```
├── src/
│   ├── index.ts, Root.tsx      Einstieg & Komposition (1920×1080, 30 fps)
│   ├── Film.tsx                setzt Szenen, Überblendungen und Ton zusammen
│   ├── data/                   ← HIER bearbeitet ihr Inhalte
│   │   ├── texts.ts            alle Bildschirmtexte
│   │   ├── narration.json      Sprechertext + Zeiten + Dateinamen
│   │   ├── timeline.json       Szenenlängen + Soundeffekte
│   │   └── sources.ts          Quellen für den Abspann
│   ├── design/                 Farben, Schriften, Zeitberechnung
│   ├── motion/                 wiederverwendbare Animations-Bausteine
│   ├── illustrations/          eigene SVG-Illustrationen
│   ├── scenes/                 S1Hook … S8Quellen
│   └── audio/Soundtrack.tsx    Musik, Effekte, automatische Spracherkennung
├── public/
│   ├── fonts/                  Inter & Inter Display (OFL-Lizenz)
│   ├── audio/narration/        ← eure Sprachaufnahmen
│   ├── audio/music/, audio/sfx/  per Code erzeugte Musik & Effekte
│   └── textures/grain.png      Filmkorn
├── scripts/                    Hilfsskripte (Testbilder, Audio, Zeitprüfung, Doku)
├── docs/untertitel.srt         Untertitel-Datei
├── NARRATION.md                Sprechertext zum Ablesen
├── SOURCES.md                  Quellen mit belegten Aussagen
└── KI-HINWEIS.md               Was KI-unterstützt erstellt wurde
```

---

## Fehlerbehebung

| Problem | Lösung |
|---|---|
| `command not found: npm` | Node.js ist nicht installiert oder das Terminal war beim Installieren offen → Terminal schliessen, neu öffnen. |
| `npm ci` meldet Fehler | Ordner `node_modules` löschen und nochmals `npm ci`. Nicht `sudo` verwenden. |
| Chrome-Download beim ersten Rendern schlägt fehl | Oft blockiert das Schulnetz Downloads → zu Hause im WLAN `npx remotion browser ensure` ausführen, danach normal rendern. |
| Rendern ist sehr langsam / Mac wird heiss | Andere Programme schliessen. Weniger parallele Prozesse: `npm run render -- --concurrency=2`. Erst einen Entwurf mit `npm run render:draft` machen. |
| Fehlermeldung «Port 3000 in use» | Es läuft schon ein Studio → anderes Terminal-Fenster schliessen oder `npm run studio -- --port=3001`. |
| Eine Sprachaufnahme wird nicht abgespielt | Dateiname genau prüfen (Kleinbuchstaben, Bindestrich, z. B. `03a-david.mp3`), Datei muss in `public/audio/narration/` liegen. Studio neu laden. |
| Der Ton ist verschoben | Stille am Anfang der Aufnahme wegschneiden (z. B. in Audacity oder QuickTime: Bearbeiten → Trimmen) oder `startSec` anpassen. |
| Text ist nach einer Änderung zu lang / überlappt | Text kürzen oder Schriftgrösse in der jeweiligen Szene (`fontSize`) verkleinern, dann in der Vorschau prüfen. |
| Ältere macOS-Version | Remotion lädt eine aktuelle Chrome-Version; empfohlen ist eine aktuelle macOS-Version (macOS 12 oder neuer). Falls das Rendern auf dem iMac nicht klappt: Projekt auf einem anderen Computer (Mac/Windows/Linux) mit denselben Befehlen rendern. |

---

## Technische Hinweise & Grenzen

- **Versionen:** Remotion 4.0.538, React 19.2, TypeScript 5.9 (fest eingetragen in `package.json` und `package-lock.json`).
- **Gerendert & geprüft** wurde der Film in einer Linux-Testumgebung (Node 22, 4 Kerne). Auf macOS wurde er
  nicht getestet; das Projekt enthält aber das passende macOS-Intel-Modul von Remotion (`@remotion/compositor-darwin-x64`), und es braucht kein separat installiertes ffmpeg.
- **Bewegungsunschärfe** wird angenähert (Unschärfe abhängig von der Geschwindigkeit), weil echte
  Mehrfachbelichtung das Rendern stark verlangsamen würde.
- **Musik & Effekte** sind synthetisch erzeugt und bewusst zurückhaltend. Ihr könnt sie durch eigene,
  lizenzfreie Musik ersetzen (siehe `public/audio/music/README.md`).
- **Sprachaufnahmen** fehlen noch – sie werden von Adem und David selbst aufgenommen. Der Sprechertext ist so
  getimt, dass er bei ruhigem Tempo (ca. 2,3 Wörter/Sekunde) in die Szenen passt.
- **Abspann:** 10 Sekunden für 8 Quellen sind knapp; zum Lesen kann man das Video pausieren. Wer mehr Zeit
  will, muss dafür an anderer Stelle kürzen (max. 180 s, Prüfung mit `npm run check:timing`).
- Remotion ist für Einzelpersonen kostenlos (Remotion Free License).
