// ── Design tokens — Home blue warm ───────────────────────────────────────────
export const C = {
  bg:          "#fdf8f0",
  surface:     "#ffffff",
  card:        "#fffcf7",
  border:      "#e8d9c0",
  accent:      "#2B5A9E",
  accentLight: "#eaf1fb",
  accentBorder:"#BAD6F0",
  ink:         "#0F1D2B",
  muted:       "#5a6e7f",
  subtle:      "#8B5E20",
  gold:        "#F5C97A",
  goldLight:   "#fdf8ed",
  goldDark:    "#7a4e0a",
  green:       "#2d7a4f",
  greenLight:  "#edf7f1",
  red:         "#c0392b",
  redLight:    "#fdf0ef",
};

// ── Priorités tâches ──────────────────────────────────────────────────────────
export const PRIORITY = {
  high:   { icon:"🔴", label:"Chaud devant !",         color:"#c0392b", bg:"#fdf0ef" },
  normal: { icon:"🟡", label:"C'est pour aujourd'hui", color:"#8B5E20", bg:"#fdf3e3" },
  low:    { icon:"🟢", label:"Quand tu peux…",         color:"#2d7a4f", bg:"#edf7f1" },
};

// ── Deadlines Synthèse NotesFlow ──────────────────────────────────────────────
export const SYNTHESE_DEADLINES = [
  { id:"s1", date:"2026-06-01", label:"Synthèse Mai" },
  { id:"s2", date:"2026-07-06", label:"Synthèse Juin–Juillet" },
  { id:"s3", date:"2026-09-07", label:"Synthèse Juil–Août" },
  { id:"s4", date:"2026-10-05", label:"Synthèse Sept–Oct" },
  { id:"s5", date:"2026-11-02", label:"Synthèse Oct–Nov" },
  { id:"s6", date:"2026-12-07", label:"Synthèse Nov–Déc" },
];

// ── Grille horaire ────────────────────────────────────────────────────────────
export const GRID_START = 0;
export const GRID_END   = 24 * 60;
export const GRID_TOTAL = GRID_END - GRID_START;
export const SLOT_H     = 56;
export const GRID_H     = (GRID_TOTAL / 60) * SLOT_H;
export const GRID_DEFAULT_SCROLL = 12 * 60;

// ── Récurrences disponibles ───────────────────────────────────────────────────
export const RECURRENCE_OPTIONS = [
  { value:"",                                   label:"Aucune" },
  { value:"FREQ=DAILY;INTERVAL=1",              label:"Quotidienne" },
  { value:"FREQ=WEEKLY;INTERVAL=1",             label:"Hebdomadaire" },
  { value:"FREQ=WEEKLY;INTERVAL=2",             label:"Toutes les 2 semaines" },
  { value:"FREQ=MONTHLY;INTERVAL=1",            label:"Mensuelle (même date)" },
  { value:"FREQ=MONTHLY;BYDAY=1MO",             label:"1er lundi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=2MO",             label:"2ème lundi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=3MO",             label:"3ème lundi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=1TU",             label:"1er mardi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=2TU",             label:"2ème mardi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=1WE",             label:"1er mercredi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=2WE",             label:"2ème mercredi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=1TH",             label:"1er jeudi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=2TH",             label:"2ème jeudi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=1FR",             label:"1er vendredi du mois" },
  { value:"FREQ=MONTHLY;BYDAY=2FR",             label:"2ème vendredi du mois" },
  { value:"FREQ=YEARLY;INTERVAL=1",             label:"Annuelle" },
  { value:"FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",  label:"Lun–Ven (jours ouvrés)" },
];
