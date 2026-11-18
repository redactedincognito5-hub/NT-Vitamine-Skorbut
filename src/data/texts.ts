/**
 * ALLE BILDSCHIRMTEXTE DES FILMS
 * ------------------------------------------------------------
 * Hier könnt ihr (Adem & David) jeden Text im Film ändern.
 * Schweizer Hochdeutsch: kein «ß», sondern «ss».
 * Zahlen in eckigen Klammern (refs) verweisen auf SOURCES.md.
 *
 * Tipp: Kurze Texte wirken im Film stärker. Wenn ein Text viel
 * länger wird, kann er im Layout umbrechen – danach Vorschau prüfen
 * (npm run studio).
 */

export const TEXT = {
  hook: {
    line1: ["EIN", "EINZIGES", "VITAMIN."],
    line2a: "SEIN FEHLEN",
    line2b: "KANN TÖDLICH SEIN.",
    line2Refs: [1, 2],
    line3: "WARUM?",
  },

  vitamine: {
    title: "VITAMINE",
    subtitle: "Stoffe, die der Körper für Zellfunktion, Wachstum und Entwicklung braucht",
    subtitleRefs: [4],
    ringCount: "13",
    ringLabel: "lebenswichtige Vitamine",
    ringRefs: [4],
    ringItems: ["A", "C", "D", "E", "K", "B1", "B2", "B3", "B5", "B6", "B7", "B9", "B12"],
    small: "KLEINE MENGEN.",
    big: "GROSSE WIRKUNG.",
    unitNote: "1 Milligramm (mg) = 1 Tausendstel Gramm   ·   1 Mikrogramm (µg) = 1 Millionstel Gramm",
    unitRefs: [3],
    waterTitle: "WASSERLÖSLICH",
    waterSub: "Vitamin C · B-Vitamine",
    waterNote: "Kaum gespeichert – Überschuss verlässt den Körper mit dem Urin",
    waterRefs: [4],
    waterResult: "regelmässig aufnehmen",
    waterFootnote: "Ausnahme: Vitamin B12 kann in der Leber gespeichert werden",
    fatTitle: "FETTLÖSLICH",
    fatSub: "Vitamine A · D · E · K",
    fatNote: "Gespeichert in Leber, Fettgewebe und Muskeln",
    fatRefs: [4],
    fatResult: "Vorrat im Körper",
  },

  vitaminc: {
    title1: "VITAMIN",
    title2: "C",
    subtitle: "ASCORBINSÄURE",
    fact1: "Der Mensch kann Vitamin C nicht selbst herstellen.",
    fact1Refs: [1],
    fact2: "Es muss mit der Nahrung aufgenommen werden.",
    collagenKicker: "AUFGABE",
    collagenTitle: "KOLLAGEN",
    collagenSub: "Vitamin C wird für die Bildung von Kollagen gebraucht",
    collagenSubRefs: [1],
    collagenLabels: ["Haut", "Sehnen", "Bänder", "Blutgefässe"],
    collagenLabelRefs: [5],
    collagenNote: "Wichtiger Baustein des Bindegewebes – zentral für die Wundheilung",
    collagenNoteRefs: [1],
    question: "Und wenn Vitamin C fehlt?",
  },

  skorbut: {
    title: "SKORBUT",
    subtitle: "Die Krankheit durch Vitamin-C-Mangel",
    subtitleRefs: [1, 2],
    timelineLabel: "weniger als ca. 10 mg Vitamin C pro Tag",
    timelineWeeks: ["Woche 1", "Woche 2", "Woche 3", "Woche 4"],
    timelineResult: "erste Anzeichen nach etwa 1 Monat",
    timelineRefs: [1],
    levelLabel: "Vitamin-C-Vorrat",
    mechanism: ["Weniger Kollagen", "Schwächeres Bindegewebe", "Empfindliche Blutgefässe"],
    mechanismRefs: [1, 5],
    symptomsTitle: "TYPISCHE ANZEICHEN",
    symptomsRefs: [2],
    symptoms: [
      "Müdigkeit & Schwäche",
      "Geschwollenes, blutendes Zahnfleisch",
      "Gelenk- & Muskelschmerzen",
      "Schlecht heilende Wunden",
      "Rote oder blaue Flecken auf der Haut",
      "Schnell entstehende Blutergüsse",
    ],
    danger: "UNBEHANDELT LEBENSGEFÄHRLICH",
    dangerRefs: [1, 2],
    dangerSub: "Mit Vitamin C meist gut behandelbar",
    dangerSubRefs: [2],
  },

  geschichte: {
    kicker: "GESCHICHTE",
    title: "Monatelang auf See",
    titleRefs: [7],
    provisions: ["Schiffszwieback", "Pökelfleisch", "Käse"],
    noFresh: "Kaum frisches Obst & Gemüse",
    provisionsRefs: [7],
    fatal: "Skorbut kostete viele Seeleute das Leben.",
    fatalRefs: [7],
    events: [
      {
        year: "1747",
        title: "James Lind vergleicht Behandlungen",
        text: "Seeleute mit Orangen & Zitronen erholen sich fast vollständig",
      },
      {
        year: "1795",
        title: "Zitronensaft an Bord",
        text: "Die britische Marine gibt offiziell Zitronensaft aus",
      },
    ],
    eventsRefs: [8],
  },

  praevention: {
    kicker: "HEUTE",
    headline: "Vitamin C steckt in Obst & Gemüse",
    foods: [
      { name: "Peperoni", detail: "rot", mg: 149 },
      { name: "Kiwi", detail: "", mg: 75 },
      { name: "Broccoli", detail: "gedämpft", mg: 74 },
      { name: "Orange", detail: "", mg: 51 },
    ],
    unit: "mg Vitamin C pro 100 g",
    unitRefs: [6],
    final1: "VITAMIN C",
    final2: "REGELMÄSSIG ZUFÜHREN",
    note1: "Referenzwert 15–17 Jahre: 90–100 mg pro Tag",
    note1Refs: [6],
    note2: "Empfindlich gegenüber Hitze und Sauerstoff – frisch ist ideal",
    note2Refs: [1, 6],
  },

  schluss: {
    line1: "KLEINES VITAMIN.",
    line2: "GROSSE BEDEUTUNG.",
  },

  quellen: {
    title: "QUELLEN & MITWIRKENDE",
    creditsLabel: "Ein Projekt von",
    names: "Adem & David",
    course: "Natur & Technik · 3. Sekundarschule",
    roles: [
      { label: "Stimmen", value: "Adem & David" },
      { label: "Verantwortung Inhalt & Text", value: "Adem & David" },
      { label: "Animation & Code", value: "KI-unterstützt erstellt (Claude, Anthropic) mit Remotion" },
      { label: "Musik & Klänge", value: "per Code erzeugt, KI-unterstützt · lizenzfrei" },
      { label: "Schrift", value: "Inter – SIL Open Font License 1.1" },
    ],
    year: "2026",
  },
} as const;
