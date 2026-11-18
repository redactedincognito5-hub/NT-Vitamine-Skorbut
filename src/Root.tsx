/**
 * Registriert die Kompositionen:
 *  - «VitamineSkorbut»: der Film (Version 1), 1920 × 1080, 30 fps
 *  - «StilTest»: kurze Stilprobe für eine mögliche Version 2 (ändert den Film nicht)
 */
import React from "react";
import { Composition } from "remotion";
import { Film, type FilmProps } from "./Film";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./design/timeline";
import { loadAllFonts } from "./design/fonts";
import { StilTest } from "./preview/StilTest";
import { T } from "./preview/timing";

loadAllFonts();

const defaultProps: FilmProps = {
  untertitel: false,
  musik: true,
  soundeffekte: true,
  sprecher: true,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="VitamineSkorbut"
      component={Film}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaultProps}
    />
    <Composition id="StilTest" component={StilTest} durationInFrames={T.total} fps={30} width={1920} height={1080} />
  </>
);
