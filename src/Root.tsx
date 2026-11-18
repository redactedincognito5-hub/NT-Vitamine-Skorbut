/**
 * Registriert die Komposition «VitamineSkorbut»: 1920 × 1080, 30 fps.
 */
import React from "react";
import { Composition } from "remotion";
import { Film, type FilmProps } from "./Film";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./design/timeline";
import { loadAllFonts } from "./design/fonts";

loadAllFonts();

const defaultProps: FilmProps = {
  untertitel: false,
  musik: true,
  soundeffekte: true,
  sprecher: true,
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VitamineSkorbut"
    component={Film}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={defaultProps}
  />
);
