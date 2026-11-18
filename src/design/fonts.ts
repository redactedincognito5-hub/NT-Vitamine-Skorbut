/**
 * Lädt die mitgelieferten Schriftdateien aus public/fonts.
 * Inter & Inter Display – SIL Open Font License 1.1 (siehe public/fonts/OFL-LICENSE.txt).
 * Weil die Dateien im Projekt liegen, sieht der Film auf jedem Computer gleich aus.
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const FILES: { family: string; file: string; weight: string }[] = [
  { family: "Inter", file: "Inter-Regular.otf", weight: "400" },
  { family: "Inter", file: "Inter-Medium.otf", weight: "500" },
  { family: "Inter", file: "Inter-SemiBold.otf", weight: "600" },
  { family: "Inter", file: "Inter-Bold.otf", weight: "700" },
  { family: "Inter Display", file: "InterDisplay-Medium.otf", weight: "500" },
  { family: "Inter Display", file: "InterDisplay-SemiBold.otf", weight: "600" },
  { family: "Inter Display", file: "InterDisplay-Bold.otf", weight: "700" },
  { family: "Inter Display", file: "InterDisplay-ExtraBold.otf", weight: "800" },
  { family: "Inter Display", file: "InterDisplay-Black.otf", weight: "900" },
];

let started = false;

export const loadAllFonts = () => {
  if (started) return;
  started = true;
  for (const f of FILES) {
    loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: "normal" });
  }
};
