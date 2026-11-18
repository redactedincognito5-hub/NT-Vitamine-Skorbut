/**
 * Optionale Untertitel (aus src/data/narration.json).
 * Einschalten: im Studio rechts bei den Props «untertitel» aktivieren
 * oder beim Rendern: --props='{"untertitel":true}'
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CUES } from "../design/timeline";
import { COLORS, FONTS } from "../design/theme";
import { ramp } from "./anim";

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= c.absFrom && frame < c.absTo + 10);
  if (!cue) return null;
  const o = ramp(frame, cue.absFrom, 6) * (1 - ramp(frame, cue.absTo + 4, 6));
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 54, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: 1400,
          padding: "12px 28px",
          borderRadius: 14,
          background: "rgba(8,9,13,0.72)",
          fontFamily: FONTS.text,
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.35,
          color: COLORS.white,
          textAlign: "center",
          opacity: o,
        }}
      >
        <span style={{ color: COLORS.orange, fontWeight: 600, marginRight: 12 }}>{cue.speaker}:</span>
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
