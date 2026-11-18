/**
 * Quellenverzeichnis für den Abspann.
 * Die Nummern [1] … [8] werden im Film als kleine Quellenmarker verwendet.
 * Die ausführliche Liste (inkl. der genauen Aussagen) steht in SOURCES.md.
 * Alle Seiten wurden am 18.11.2026 abgerufen.
 */
export type Source = {
  id: number;
  org: string;
  title: string;
  detail: string;
  url: string;
};

export const SOURCES: Source[] = [
  {
    id: 1,
    org: "NIH Office of Dietary Supplements (USA)",
    title: "Vitamin C – Fact Sheet for Health Professionals",
    detail: "aktualisiert 31.07.2025",
    url: "ods.od.nih.gov/factsheets/VitaminC-HealthProfessional",
  },
  {
    id: 2,
    org: "NHS (UK)",
    title: "Scurvy",
    detail: "geprüft 27.09.2023",
    url: "nhs.uk/conditions/scurvy",
  },
  {
    id: 3,
    org: "NHS (UK)",
    title: "Vitamins and minerals – Overview & Vitamin C",
    detail: "geprüft 03.08.2020",
    url: "nhs.uk/conditions/vitamins-and-minerals",
  },
  {
    id: 4,
    org: "MedlinePlus, U.S. National Library of Medicine",
    title: "Vitamins",
    detail: "Review 21.01.2025",
    url: "medlineplus.gov/ency/article/002399.htm",
  },
  {
    id: 5,
    org: "MedlinePlus, U.S. National Library of Medicine",
    title: "Vitamin C",
    detail: "Review 21.01.2025",
    url: "medlineplus.gov/ency/article/002404.htm",
  },
  {
    id: 6,
    org: "Schweizerische Gesellschaft für Ernährung SGE",
    title: "Merkblatt Vitamin C (Referenzwerte BLV 2022, Nährwerte: Schweizer Nährwertdatenbank)",
    detail: "2026",
    url: "sge-ssn.ch/media/jycd1mzo/vitamin-c-2026.pdf",
  },
  {
    id: 7,
    org: "Royal Museums Greenwich",
    title: "What is scurvy?",
    detail: "o. J.",
    url: "rmg.co.uk/stories/maritime-history/what-scurvy",
  },
  {
    id: 8,
    org: "Houlberg, Wickenden & Freshwater",
    title: "Five centuries of medical contributions from the Royal Navy. Clin Med 19(1):22–25",
    detail: "2019",
    url: "doi.org/10.7861/clinmedicine.19-1-22",
  },
];

export const ACCESSED = "Alle Quellen abgerufen am 18.11.2026 · Vollständige Liste: SOURCES.md";
