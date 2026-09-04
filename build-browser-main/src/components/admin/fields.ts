import { ACCENT_PALETTE, type CredentialItem, type ProjectDef, type ResearchDef, type Section, type SkillGroup } from "@/data/types";

export type FieldDef =
  | { key: string; label: string; kind: "text"; required?: boolean; placeholder?: string }
  | { key: string; label: string; kind: "textarea"; required?: boolean; placeholder?: string }
  | { key: string; label: string; kind: "list"; required?: boolean; placeholder?: string }
  | { key: string; label: string; kind: "url"; required?: boolean; placeholder?: string }
  | { key: string; label: string; kind: "bool"; required?: boolean };

export type CollectionConfig<T extends { id: string }> = {
  section: Section;
  singularLabel: string;
  pluralLabel: string;
  hasAccent: boolean;
  fields: FieldDef[];
  blank: () => Record<string, unknown>;
  fromItem: (item: T) => Record<string, unknown>;
  getTitle: (draft: Record<string, unknown>) => string;
  getSubtitle?: (item: T) => string;
};

export const PROJECTS_CONFIG: CollectionConfig<ProjectDef> = {
  section: "projects",
  singularLabel: "Project",
  pluralLabel: "Projects",
  hasAccent: true,
  fields: [
    { key: "name", label: "Name", kind: "text", required: true },
    { key: "summary", label: "Summary", kind: "text", required: true, placeholder: "One line" },
    { key: "problem", label: "Problem", kind: "textarea", required: true },
    { key: "solution", label: "Solution", kind: "textarea", placeholder: "Optional — more detail on the approach" },
    { key: "architecture", label: "Architecture", kind: "textarea", required: true },
    { key: "stack", label: "Tech stack", kind: "list", required: true, placeholder: "Add a technology…" },
    { key: "links.github", label: "GitHub URL", kind: "url" },
    { key: "links.demo", label: "Live demo URL", kind: "url" },
    { key: "featured", label: "Featured", kind: "bool" },
  ],
  blank: () => ({
    name: "",
    summary: "",
    problem: "",
    solution: "",
    architecture: "",
    stack: [],
    featured: false,
    accent: ACCENT_PALETTE[0],
    links: { github: "", demo: "" },
  }),
  fromItem: (p) => ({
    name: p.name,
    summary: p.summary,
    problem: p.problem,
    solution: p.solution ?? "",
    architecture: p.architecture,
    stack: p.stack,
    featured: !!p.featured,
    accent: p.accent,
    links: { github: p.links.github ?? "", demo: p.links.demo ?? "" },
  }),
  getTitle: (d) => (d.name as string) || "Untitled project",
  getSubtitle: (p) => p.summary,
};

export const RESEARCH_CONFIG: CollectionConfig<ResearchDef> = {
  section: "research",
  singularLabel: "Research entry",
  pluralLabel: "Research",
  hasAccent: true,
  fields: [
    { key: "name", label: "Name", kind: "text", required: true },
    { key: "summary", label: "Summary", kind: "text", required: true, placeholder: "One line" },
    { key: "role", label: "Role / publication line", kind: "text", required: true, placeholder: "e.g. Research Publication • Under Review" },
    { key: "status", label: "Status badge", kind: "text", required: true, placeholder: 'e.g. "Under Review"' },
    { key: "problem", label: "Problem", kind: "textarea", required: true },
    { key: "work", label: "Your work", kind: "textarea", required: true },
    { key: "stack", label: "Tech stack", kind: "list", required: true, placeholder: "Add a technology…" },
    { key: "links.github", label: "GitHub URL", kind: "url" },
    { key: "links.report", label: "Paper / report URL", kind: "text", placeholder: "URL or a path like /paper.pdf" },
  ],
  blank: () => ({
    name: "",
    summary: "",
    role: "",
    status: "",
    problem: "",
    work: "",
    stack: [],
    accent: ACCENT_PALETTE[0],
    links: { github: "", report: "" },
  }),
  fromItem: (r) => ({
    name: r.name,
    summary: r.summary,
    role: r.role,
    status: r.status,
    problem: r.problem,
    work: r.work,
    stack: r.stack,
    accent: r.accent,
    links: { github: r.links.github ?? "", report: r.links.report ?? "" },
  }),
  getTitle: (d) => (d.name as string) || "Untitled research entry",
  getSubtitle: (r) => r.summary,
};

const credentialFields: FieldDef[] = [
  { key: "name", label: "Name", kind: "text", required: true },
  { key: "issuer", label: "Issuer", kind: "text", required: true, placeholder: 'e.g. "Cisco Networking Academy · 2025"' },
];

export const CERTIFICATIONS_CONFIG: CollectionConfig<CredentialItem> = {
  section: "certifications",
  singularLabel: "Certification",
  pluralLabel: "Certifications",
  hasAccent: false,
  fields: credentialFields,
  blank: () => ({ name: "", issuer: "" }),
  fromItem: (c) => ({ name: c.name, issuer: c.issuer }),
  getTitle: (d) => (d.name as string) || "Untitled certification",
  getSubtitle: (c) => c.issuer,
};

export const COURSES_CONFIG: CollectionConfig<CredentialItem> = {
  section: "courses",
  singularLabel: "Course",
  pluralLabel: "Courses",
  hasAccent: false,
  fields: credentialFields,
  blank: () => ({ name: "", issuer: "" }),
  fromItem: (c) => ({ name: c.name, issuer: c.issuer }),
  getTitle: (d) => (d.name as string) || "Untitled course",
  getSubtitle: (c) => c.issuer,
};

export const SKILL_GROUPS_CONFIG: CollectionConfig<SkillGroup> = {
  section: "skillGroups",
  singularLabel: "Skill group",
  pluralLabel: "Skill groups",
  hasAccent: true,
  fields: [
    { key: "category", label: "Category", kind: "text", required: true, placeholder: 'e.g. "Languages"' },
    { key: "items", label: "Skills", kind: "list", required: true, placeholder: "Add a skill…" },
  ],
  blank: () => ({ category: "", items: [], accent: ACCENT_PALETTE[0] }),
  fromItem: (g) => ({ category: g.category, items: g.items, accent: g.accent }),
  getTitle: (d) => (d.category as string) || "Untitled skill group",
  getSubtitle: (g) => g.items.join(", "),
};

// Builds the create/update payload from form draft state, respecting each
// field's kind and stripping blank optional link fields so the server's
// url() validation doesn't reject an untouched empty field. A link field
// left blank IS sent through as "" for links the config declares — that's
// how the server knows to clear it rather than leave it alone.
type FormShape = { fields: FieldDef[]; hasAccent: boolean };

export function buildSubmitPayload(config: FormShape, draft: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const links: Record<string, string> = {};

  for (const f of config.fields) {
    if (f.key.startsWith("links.")) {
      const linkKey = f.key.slice("links.".length);
      const raw = draft.links as Record<string, unknown> | undefined;
      const v = raw?.[linkKey];
      links[linkKey] = typeof v === "string" ? v.trim() : "";
      continue;
    }
    const v = draft[f.key];
    if (f.kind === "list") payload[f.key] = Array.isArray(v) ? v : [];
    else if (f.kind === "bool") payload[f.key] = !!v;
    else payload[f.key] = typeof v === "string" ? v.trim() : v;
  }

  if (Object.keys(links).length) payload.links = links;
  if (config.hasAccent && draft.accent) payload.accent = draft.accent;
  return payload;
}

export function isDraftValid(config: FormShape, draft: Record<string, unknown>): boolean {
  return config.fields.every((f) => {
    if (!f.required) return true;
    const v = draft[f.key];
    if (f.kind === "list") return Array.isArray(v) && v.length > 0;
    return typeof v === "string" && v.trim().length > 0;
  });
}
