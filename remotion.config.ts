/**
 * Remotion-Konfiguration – gilt für `npm run render`, `npm run studio` usw.
 * Doku: https://www.remotion.dev/docs/config
 */
import { Config } from "@remotion/cli/config";

// Bildformat der Einzelbilder während des Renderns (jpeg ist schneller als png).
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);

// H.264 / MP4 – läuft auf jedem Mac, PC, Smartphone und Beamer.
Config.setCodec("h264");
// Qualität: kleinere Zahl = bessere Qualität & grössere Datei (18 ist sehr gut).
Config.setCrf(18);
Config.setPixelFormat("yuv420p");

// Bestehende Datei ohne Nachfrage überschreiben.
Config.setOverwriteOutput(true);
