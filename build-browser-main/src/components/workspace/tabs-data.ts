import {
  Boxes,
  Braces,
  Briefcase,
  Calculator,
  Construction,
  Contact as ContactIcon,
  FileText,
  FlaskConical,
  LineChart,
  RefreshCw,
  ShieldCheck,
  TerminalSquare,
  User,
  type LucideIcon,
} from "lucide-react";

// The 8 pages that always exist. Projects and research entries are no
// longer part of this closed union — they're resolved at runtime from
// merged content (seed + admin-added) via resolveTabDef() in
// content-resolve.ts, so adding one never requires a code change here.
export type StaticTabKind =
  | "about"
  | "projects-index"
  | "research-index"
  | "experience"
  | "skills"
  | "resume"
  | "contact"
  | "terminal";

// Widened to any string (keeping autocomplete for the static ids) so a
// project-*/research-* id — seed or admin-added — is a valid TabKind too.
export type TabKind = StaticTabKind | (string & {});

export type TabDef = {
  id: TabKind;
  label: string;
  filename: string;
  icon: LucideIcon;
  accent: string;
  breadcrumb: string[];
};

export const TABS: Record<StaticTabKind, TabDef> = {
  about: {
    id: "about",
    label: "About",
    filename: "about.md",
    icon: User,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "About"],
  },
  "projects-index": {
    id: "projects-index",
    label: "Projects",
    filename: "projects.md",
    icon: Boxes,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Projects"],
  },
  "research-index": {
    id: "research-index",
    label: "Research",
    filename: "research.md",
    icon: FlaskConical,
    accent: "var(--violet-accent)",
    breadcrumb: ["Workspace", "Research"],
  },
  experience: {
    id: "experience",
    label: "Experience",
    filename: "experience.md",
    icon: Briefcase,
    accent: "var(--amber-accent)",
    breadcrumb: ["Workspace", "Experience"],
  },
  skills: {
    id: "skills",
    label: "Skills",
    filename: "skills.md",
    icon: Braces,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Skills"],
  },
  resume: {
    id: "resume",
    label: "Resume",
    filename: "Resume.pdf",
    icon: FileText,
    accent: "var(--rose-accent)",
    breadcrumb: ["Workspace", "Resume.pdf"],
  },
  contact: {
    id: "contact",
    label: "Contact",
    filename: "contact.md",
    icon: ContactIcon,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Contact"],
  },
  terminal: {
    id: "terminal",
    label: "Terminal",
    filename: "terminal",
    icon: TerminalSquare,
    accent: "var(--emerald-accent)",
    breadcrumb: ["Workspace", "Terminal"],
  },
};

// Curated icons for the seed projects/research, keyed by content id. New
// admin-added items fall back to a generic per-section icon (see
// content-resolve.ts) — this map exists purely to keep the original 5
// hand-picked icons rather than genericizing them too.
export const SEED_ICON_BY_ID: Record<string, LucideIcon> = {
  "project-renewly": RefreshCw,
  "project-ciphercare": ShieldCheck,
  "project-pothole": Construction,
  "project-fare-calculator": Calculator,
  "research-stackelberg": LineChart,
};
