import type { MergedContent } from "@/data/types";
import type { ContextKey, StaticContextKey } from "@/lib/portfolio-content";

import type { TabKind } from "./tabs-data";

export function tabToContext(tab: TabKind | null): ContextKey | null {
  if (!tab) return null;
  if (tab === "skills") return "skills";
  if (tab === "terminal") return null;
  // Tab ids and context keys share the same namespace for everything else
  // (the 7 static pages, and every project-*/research-* id, seed or
  // admin-added).
  return tab;
}

type ContextMeta = { label: string; dot: string; icon: string };

export const CONTEXT_META: Record<StaticContextKey, ContextMeta> = {
  about: { label: "About", dot: "var(--cyan-accent)", icon: "🧭" },
  "projects-index": { label: "Projects", dot: "var(--cyan-accent)", icon: "🗂" },
  "research-index": { label: "Research", dot: "var(--violet-accent)", icon: "🔬" },
  experience: { label: "Experience", dot: "var(--amber-accent)", icon: "🧑‍💻" },
  skills: { label: "Skills", dot: "var(--cyan-accent)", icon: "⚙️" },
  resume: { label: "Resume", dot: "var(--rose-accent)", icon: "📄" },
  contact: { label: "Contact", dot: "var(--cyan-accent)", icon: "✉️" },
};

// The single lookup for "what does this context id look like in the AI
// panel" — resolves seed pages from CONTEXT_META and project-*/research-*
// ids (seed or admin-added) from the merged content, so a new item never
// needs an entry hand-added here.
export function resolveContextMeta(id: ContextKey | null, content: MergedContent): ContextMeta | null {
  if (!id) return null;
  if (id in CONTEXT_META) return CONTEXT_META[id as StaticContextKey];

  const project = content.projects.find((p) => p.id === id);
  if (project) return { label: project.name, dot: project.accent, icon: "🧩" };

  const research = content.research.find((r) => r.id === id);
  if (research) return { label: research.name, dot: research.accent, icon: "🔬" };

  return null;
}
