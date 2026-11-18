/**
 * Remotion-Konfiguration – gilt für `npm run render`, `npm run studio` usw.
 * Doku: https://www.remotion.dev/docs/config
 *
 * Codec (H.264), Qualität (CRF 18) und Pixelformat stehen bewusst in den
 * npm-Befehlen (package.json → "render"), damit auch reine Ton-Exporte
 * (z. B. --codec=wav) ohne Fehlermeldung funktionieren.
 */
import { Config } from "@remotion/cli/config";

// Bildformat der Einzelbilder während des Renderns (jpeg ist schneller als png).
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);

// Bestehende Datei ohne Nachfrage überschreiben.
Config.setOverwriteOutput(true);
