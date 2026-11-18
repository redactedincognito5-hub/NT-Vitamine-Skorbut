/**
 * Rechnet die Szenenlängen aus timeline.json in Frames um.
 * Szenenlängen ändert man in src/data/timeline.json.
 */
import timeline from "../data/timeline.json";
import narration from "../data/narration.json";

export const FPS = timeline.fps;
export const WIDTH = timeline.width;
export const HEIGHT = timeline.height;
/** Dauer der Überblendung zwischen zwei Szenen (Frames). */
export const TRANSITION = timeline.transitionFrames;

export type SceneId =
  | "hook"
  | "vitamine"
  | "vitaminc"
  | "skorbut"
  | "geschichte"
  | "praevention"
  | "schluss"
  | "quellen";

export type SceneTiming = {
  id: SceneId;
  title: string;
  from: number;
  durationInFrames: number;
};

export const SCENES: SceneTiming[] = (() => {
  let cursor = 0;
  return timeline.scenes.map((s) => {
    const durationInFrames = Math.round(s.seconds * FPS);
    const scene: SceneTiming = { id: s.id as SceneId, title: s.title, from: cursor, durationInFrames };
    cursor += durationInFrames;
    return scene;
  });
})();

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.durationInFrames, 0);

export const sceneById = (id: SceneId): SceneTiming => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Unbekannte Szene: ${id}`);
  return s;
};

/** Sekunden → Frames */
export const sec = (s: number) => Math.round(s * FPS);

export type NarrationCue = {
  id: string;
  scene: SceneId;
  speaker: string;
  startSec: number;
  durationSec: number;
  text: string;
  refs: number[];
  file: string;
};

export const CUES: (NarrationCue & { absFrom: number; absTo: number })[] = narration.cues.map((c) => {
  const scene = sceneById(c.scene as SceneId);
  const absFrom = scene.from + sec(c.startSec);
  return { ...(c as NarrationCue), absFrom, absTo: absFrom + sec(c.durationSec) };
});

export const SFX = timeline.sfx.map((s) => ({
  ...s,
  absFrom: sceneById(s.scene as SceneId).from + sec(s.atSec),
}));
