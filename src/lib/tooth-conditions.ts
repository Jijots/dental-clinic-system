export const TOOTH_CONDITIONS = [
  { code: "DECAYED", label: "Decayed (D)", color: "#ef4444" },
  { code: "MISSING_CARIES", label: "Missing due to Caries (M)", color: "#7f1d1d" },
  { code: "FILLED", label: "Filled (F)", color: "#3b82f6" },
  { code: "INDICATED_EXTRACTION", label: "Indicated for Extraction (I)", color: "#f97316" },
  { code: "ROOT_FRAGMENT", label: "Root Fragment (RF)", color: "#78350f" },
  { code: "MISSING_OTHER", label: "Missing, Other Causes (MO)", color: "#6b7280" },
  { code: "IMPACTED", label: "Impacted (Im)", color: "#a855f7" },
  { code: "JACKET_CROWN", label: "Jacket Crown (J)", color: "#eab308" },
  { code: "AMALGAM_FILLING", label: "Amalgam Filling (A)", color: "#0ea5e9" },
  { code: "ABUTMENT", label: "Abutment (AB)", color: "#14b8a6" },
  { code: "PONTIC", label: "Pontic (P)", color: "#6366f1" },
  { code: "INLAY", label: "Inlay (In)", color: "#22c55e" },
  { code: "FIXED_CURE_COMPOSITE", label: "Fixed Cure Composite (FX)", color: "#84cc16" },
  { code: "REMOVABLE_DENTURE", label: "Removable Denture (Rm)", color: "#d946ef" },
  { code: "EXTRACTION_CARIES", label: "Extraction, Caries (X)", color: "#dc2626" },
  { code: "EXTRACTION_OTHER", label: "Extraction, Other (XO)", color: "#991b1b" },
  { code: "PRESENT", label: "Present (✓)", color: "#16a34a" },
  { code: "CONGENITALLY_MISSING", label: "Congenitally Missing (Cm)", color: "#9ca3af" },
  { code: "SUPERNUMERARY", label: "Supernumerary (Sp)", color: "#f59e0b" },
] as const;

export type ToothConditionCode = (typeof TOOTH_CONDITIONS)[number]["code"];
