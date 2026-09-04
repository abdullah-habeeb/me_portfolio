// Shared content types. Used by both the seed data (compiled into the app)
// and the admin-added data (persisted in content-store.json). An admin-added
// item and a seed item are structurally identical — the merge layer is what
// makes the distinction, not the shape.

export type ProjectDef = {
  id: string;
  name: string;
  summary: string;
  problem: string;
  architecture: string;
  stack: string[];
  accent: string;
  links: { github?: string; docs?: string; demo?: string };
  featured?: boolean;

  image?: string;
  topTags?: string[];
  solution?: string;
  stackCategorized?: { category: string; items: string[] }[];
  engineeringDecisions?: { name: string; reason: string }[];
  challenges?: string[];
  keyCapabilities?: { icon: string; title: string; description: string }[];
  hasLiveDemo?: boolean;
};

export type ResearchDef = {
  id: string;
  name: string;
  summary: string;
  role: string;
  status: string;
  problem: string;
  work: string;
  architectureFlow: string[];
  highlights?: string[];
  contributions?: string[];
  resultsTable?: { method: string; acc: string; asr: string; delta: string }[];
  stack: string[];
  accent: string;
  links: { github?: string; docs?: string; report?: string };
};

export type CredentialItem = {
  id: string;
  name: string;
  issuer: string;
};

export type SkillGroup = {
  id: string;
  category: string;
  items: string[];
  accent: string;
};

export type StatItem = { label: string; value: string };
export type HighlightItem = { id: string; title: string; detail: string; accent: string; featured?: boolean };

// About, Experience, and Contact are singleton pages (one record, not a
// collection) — edited as a whole via one form each in the admin GUI rather
// than added/removed item by item.
export type AboutContent = {
  bio: string;
  photo: string;
  stats: StatItem[];
  interests: string[];
  highlights: HighlightItem[];
};

export type ExperienceItem = { id: string; role: string; org: string; period: string; accent: string; details: string };
export type AchievementItem = { id: string; text: string; link?: string };

export type ExperienceContent = {
  roles: ExperienceItem[];
  achievements: AchievementItem[];
};

export type ContactContent = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  leetcode: string;
};

// The resume PDF's current URL — a static /public path by default, or a
// Vercel Blob URL once someone uploads a replacement in production (see
// content-server.ts's setUploadedAssetUrl).
export type ResumeContent = { url: string };

export type CollectionSection = "projects" | "research" | "certifications" | "courses" | "skillGroups";
export type SingletonSection = "about" | "experience" | "contact" | "resume";
export type Section = CollectionSection;

export type MergedContent = {
  projects: ProjectDef[];
  research: ResearchDef[];
  certifications: CredentialItem[];
  courses: CredentialItem[];
  skillGroups: SkillGroup[];
  about: AboutContent;
  experience: ExperienceContent;
  contact: ContactContent;
  resume: ResumeContent;
};

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-+|-+$)/g, "") || "item"
  );
}

export const ACCENT_PALETTE = [
  "var(--cyan-accent)",
  "var(--emerald-accent)",
  "var(--violet-accent)",
  "var(--amber-accent)",
  "var(--rose-accent)",
] as const;

export function pickAccent(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}
