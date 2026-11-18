/**
 * TON: Sprachaufnahmen, Musik und Soundeffekte.
 *
 * Sprachaufnahmen werden AUTOMATISCH erkannt: Legt eure Dateien mit den Namen
 * aus src/data/narration.json in public/audio/narration/ ab (z. B. 01a-adem.mp3).
 * Erlaubt sind .mp3, .wav, .m4a und .aac. Fehlt eine Datei, bleibt die Stelle still –
 * der Film lässt sich trotzdem rendern.
 *
 * Während jemand spricht, wird die Musik automatisch leiser («Ducking»).
 */
import React from "react";
import { Html5Audio, Sequence, getStaticFiles, interpolate, staticFile } from "remotion";
import { CUES, SFX, TOTAL_FRAMES } from "../design/timeline";

const EXTENSIONS = [".mp3", ".wav", ".m4a", ".aac"];

/** Grundlautstärke der Musik (0–1) und Lautstärke während gesprochen wird. */
const MUSIC_VOLUME = 0.7;
const MUSIC_DUCKED = 0.22;
const NARRATION_VOLUME = 1.0;

const MUSIC_FILE = "audio/music/score.mp3";

export const Soundtrack: React.FC<{ musik: boolean; soundeffekte: boolean; sprecher: boolean }> = ({ musik, soundeffekte, sprecher }) => {
  const files = new Set(getStaticFiles().map((f) => f.name.replace(/\\/g, "/")));

  const narration = CUES.map((cue) => {
    const ext = EXTENSIONS.find((e) => files.has(cue.file + e));
    return ext ? { ...cue, path: cue.file + ext } : null;
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  // Zeitfenster, in denen gesprochen wird (für das Ducking)
  const windows = sprecher ? narration.map((c) => [c.absFrom, c.absTo] as const) : [];
  const musicVolume = (f: number) => {
    let duck = 0;
    for (const [a, b] of windows) {
      const d = Math.min(
        interpolate(f, [a - 12, a], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        interpolate(f, [b, b + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      );
      duck = Math.max(duck, d);
    }
    const fadeOut = interpolate(f, [TOTAL_FRAMES - 60, TOTAL_FRAMES - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (MUSIC_VOLUME + (MUSIC_DUCKED - MUSIC_VOLUME) * duck) * fadeOut;
  };

  return (
    <>
      {musik && files.has(MUSIC_FILE) ? <Html5Audio src={staticFile(MUSIC_FILE)} volume={musicVolume} /> : null}

      {soundeffekte
        ? SFX.filter((s) => files.has(s.file)).map((s, i) => (
            <Sequence key={`sfx-${i}`} from={s.absFrom} name={`SFX ${s.file}`} layout="none">
              <Html5Audio src={staticFile(s.file)} volume={s.volume} />
            </Sequence>
          ))
        : null}

      {sprecher
        ? narration.map((c) => (
            <Sequence key={c.id} from={c.absFrom} name={`Sprecher ${c.id} (${c.speaker})`} layout="none">
              <Html5Audio src={staticFile(c.path)} volume={NARRATION_VOLUME} />
            </Sequence>
          ))
        : null}
    </>
  );
};
