import { Boxes, FileText, FlaskConical } from "lucide-react";

import { slugify, type MergedContent } from "@/data/types";

import { SEED_ICON_BY_ID, TABS, type StaticTabKind, type TabDef, type TabKind } from "./tabs-data";

// The single lookup for "what tab is this id" — used by Workspace (tab bar,
// breadcrumb, status bar), Explorer (sidebar items), and CommandPalette
// (search results). A seed page comes straight from TABS; a project/research
// id — seed or admin-added — is synthesized from the merged content, so
// nothing here ever needs updating when an item is added or edited.
export function resolveTabDef(id: TabKind, content: MergedContent): TabDef {
  if (id in TABS) return TABS[id as StaticTabKind];

  const project = content.projects.find((p) => p.id === id);
  if (project) {
    return {
      id,
      label: project.name,
      filename: `${slugify(project.name)}.md`,
      icon: SEED_ICON_BY_ID[id] ?? Boxes,
      accent: project.accent,
      breadcrumb: ["Workspace", "Projects", project.name],
    };
  }

  const research = content.research.find((r) => r.id === id);
  if (research) {
    return {
      id,
      label: research.name,
      filename: `${slugify(research.name)}.md`,
      icon: SEED_ICON_BY_ID[id] ?? FlaskConical,
      accent: research.accent,
      breadcrumb: ["Workspace", "Research", research.name],
    };
  }

  return {
    id,
    label: id,
    filename: id,
    icon: FileText,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", id],
  };
}
