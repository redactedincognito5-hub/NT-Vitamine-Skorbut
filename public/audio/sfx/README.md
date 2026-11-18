# Soundeffekte

Alle Effekte sind **per Code erzeugt** (`scripts/generate-audio.mjs`): `whoosh`, `whoosh-long`,
`hit-soft`, `hit-deep`, `shimmer`. Wann welcher Effekt erklingt, steht in `src/data/timeline.json`
unter `sfx` (Szene, Sekunde, Lautstärke). Eigene Effekte: Datei hier ablegen und dort eintragen.
Alle Effekte ausschalten: Prop `soundeffekte` auf `false`.
