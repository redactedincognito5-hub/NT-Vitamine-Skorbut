/**
 * DER FILM – setzt alle Szenen und den Ton zusammen.
 * Reihenfolge und Länge der Szenen: src/data/timeline.json
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./design/theme";
import { SCENES, TRANSITION, type SceneId } from "./design/timeline";
import { SceneShell } from "./motion/SceneShell";
import { Grain } from "./motion/Atmosphere";
import { S1Hook } from "./scenes/S1Hook";
import { S2Vitamine } from "./scenes/S2Vitamine";
import { S3VitaminC } from "./scenes/S3VitaminC";
import { S4Skorbut } from "./scenes/S4Skorbut";
import { S5Geschichte } from "./scenes/S5Geschichte";
import { S6Praevention } from "./scenes/S6Praevention";
import { S7Schluss } from "./scenes/S7Schluss";
import { S8Quellen } from "./scenes/S8Quellen";
import { Soundtrack } from "./audio/Soundtrack";
import { Subtitles } from "./motion/Subtitles";

export type FilmProps = {
  /** Untertitel aus dem Sprechertext einblenden */
  untertitel: boolean;
  /** Hintergrundmusik abspielen */
  musik: boolean;
  /** Soundeffekte abspielen */
  soundeffekte: boolean;
  /** Sprachaufnahmen (falls vorhanden) abspielen */
  sprecher: boolean;
};

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  hook: S1Hook,
  vitamine: S2Vitamine,
  vitaminc: S3VitaminC,
  skorbut: S4Skorbut,
  geschichte: S5Geschichte,
  praevention: S6Praevention,
  schluss: S7Schluss,
  quellen: S8Quellen,
};

export const Film: React.FC<FilmProps> = ({ untertitel, musik, soundeffekte, sprecher }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    {SCENES.map((scene, i) => {
      const Component = SCENE_COMPONENTS[scene.id];
      const isFirst = i === 0;
      const isLast = i === SCENES.length - 1;
      return (
        <Sequence key={scene.id} name={scene.title} from={scene.from} durationInFrames={scene.durationInFrames + (isLast ? 0 : TRANSITION)}>
          <SceneShell duration={scene.durationInFrames} fadeIn={!isFirst} fadeOut={!isLast}>
            <Component />
          </SceneShell>
        </Sequence>
      );
    })}
    <Grain opacity={0.06} />
    {untertitel ? <Subtitles /> : null}
    <Soundtrack musik={musik} soundeffekte={soundeffekte} sprecher={sprecher} />
  </AbsoluteFill>
);
