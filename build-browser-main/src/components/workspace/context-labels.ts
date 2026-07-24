import type { ContextKey } from "@/lib/portfolio-content";
import type { TabKind } from "./tabs-data";

export function tabToContext(tab: TabKind | null): ContextKey | null {
  if (!tab) return null;
  switch (tab) {
    case "skills":
      return "skills";
    case "terminal":
      return null;
    default:
      // TabKind names align with ContextKey for the rest
      return tab as ContextKey;
  }
}

export const CONTEXT_META: Record<ContextKey, { label: string; dot: string; icon: string }> = {
  about: { label: "About", dot: "var(--cyan-accent)", icon: "🧭" },
  "projects-index": { label: "Projects", dot: "var(--cyan-accent)", icon: "🗂" },
  "project-renewly": { label: "Renewly", dot: "var(--emerald-accent)", icon: "🔁" },
  "project-ciphercare": { label: "CipherCare", dot: "var(--cyan-accent)", icon: "🛡" },
  "research-index": { label: "Research", dot: "var(--violet-accent)", icon: "🔬" },
  "research-stackelberg": { label: "Adversarial Regularization", dot: "var(--rose-accent)", icon: "🛡" },
  experience: { label: "Experience", dot: "var(--amber-accent)", icon: "🧑‍💻" },
  skills: { label: "Skills", dot: "var(--cyan-accent)", icon: "⚙️" },
  resume: { label: "Resume", dot: "var(--rose-accent)", icon: "📄" },
  contact: { label: "Contact", dot: "var(--cyan-accent)", icon: "✉️" },
};
