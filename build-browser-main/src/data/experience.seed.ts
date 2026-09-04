import type { ExperienceContent } from "./types";

export const SEED_EXPERIENCE: ExperienceContent = {
  roles: [
    {
      id: "role-unisys",
      role: "Software Engineering Extern",
      org: "Unisys — Remote",
      period: "Dec 2025 – May 2026",
      accent: "var(--rose-accent)",
      details:
        "Built a Python (Flask) + PowerShell system that autonomously monitors Windows OS events and applies rules-based corrections, designed end-to-end with no existing framework to extend. Shipped a real-time event-tracking dashboard with severity classification and remediation scheduling, owning the full stack from backend logic to the operator-facing UI. Engineered an automated logging pipeline processing 10,000+ system events with metadata enrichment for scalable downstream analytics.",
    },
    {
      id: "role-aws-sbg",
      role: "Social Media & Design Head",
      org: "AWS Student Builder Group, BMSITM",
      period: "Nov 2025 – Present",
      accent: "var(--amber-accent)",
      details: "Led end-to-end design operations and cross-functional coordination for the college's AWS community chapter.",
    },
  ],
  achievements: [
    { id: "achievement-sap-cap", text: "SAP Backend Developer (CAP) — 2026" },
    { id: "achievement-sap-bdc", text: "SAP Business Data Cloud — 2026" },
    {
      id: "achievement-ideathon",
      text: "3rd Place, UI/UX Design Ideathon (May 2025) — high-fidelity Figma prototype replicating the IKS Health platform",
    },
  ],
};
