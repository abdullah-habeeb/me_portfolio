// Structured portfolio content that powers the context-aware AI assistant
// and the terminal's `cat` command. Every fact here is grounded in
// Abdullah's resume — no fabricated metrics.
//
// Project/research/certification/course docs are generated from the merged
// content (seed + admin-added) instead of hand-written per item — add or
// edit one through the admin terminal and the AI + terminal both pick it up
// automatically, with nothing here to keep in sync.

import type { AboutContent, ContactContent, CredentialItem, ExperienceContent, MergedContent, ProjectDef, ResearchDef, SkillGroup } from "@/data/types";

// The pages that are never a collection (no add/delete — one record each,
// edited as a whole through the admin GUI's About/Experience/Skills/Resume/
// Contact forms). Their docs are generated from that same merged record
// below, so an edit through the GUI is reflected here with nothing to sync.
export type StaticContextKey = "about" | "projects-index" | "research-index" | "experience" | "skills" | "resume" | "contact";

// Widened so a project-*/research-* id — seed or admin-added — is a valid
// ContextKey too, same trick as TabKind.
export type ContextKey = StaticContextKey | (string & {});

type Doc = { title: string; body: string };

const RESUME_DOC: Doc = {
  title: "Resume",
  body: "Full resume PDF is available in the Resume tab. Contains Education, Experience, Projects, Research Publications, Certifications & Achievements, and Technical Skills.",
};

function aboutToDoc(a: AboutContent): Doc {
  const lines = [a.bio];
  if (a.interests.length) lines.push(`Interests: ${a.interests.join(", ")}.`);
  if (a.highlights.length) lines.push(`Highlights: ${a.highlights.map((h) => `${h.title} — ${h.detail}`).join(" | ")}`);
  return { title: "About Abdullah", body: lines.join("\n") };
}

function experienceToDoc(e: ExperienceContent): Doc {
  const lines = e.roles.map((r) => `- ${r.role}, ${r.org} (${r.period}) — ${r.details}`);
  if (e.achievements.length) lines.push(`Achievements: ${e.achievements.map((a) => a.text).join(", ")}.`);
  return { title: "Experience & Leadership", body: lines.join("\n") || "No experience listed yet." };
}

function contactToDoc(c: ContactContent): Doc {
  return {
    title: "Contact",
    body: `Email: ${c.email}\nPhone: ${c.phone}\nLocation: ${c.location}\nLinkedIn: ${c.linkedin}\nGitHub: ${c.github}`,
  };
}

function skillGroupLines(groups: SkillGroup[]): string {
  return groups.map((g) => `${g.category}: ${g.items.join(", ")}.`).join("\n");
}

function projectToDoc(p: ProjectDef): Doc {
  const lines = [`Stack: ${p.stack.join(", ")}.`, `What it does: ${p.problem}${p.solution ? " " + p.solution : ""}`];
  if (p.architecture) lines.push(`Architecture: ${p.architecture}`);
  if (p.engineeringDecisions?.length) {
    lines.push(`Key decisions: ${p.engineeringDecisions.map((d) => `${d.name} — ${d.reason}`).join(" | ")}`);
  }
  if (p.challenges?.length) lines.push(`Challenges: ${p.challenges.join("; ")}`);
  if (p.links.demo) lines.push(`Live: ${p.links.demo}`);
  if (p.links.github) lines.push(`GitHub: ${p.links.github}`);
  return { title: p.name, body: lines.join("\n") };
}

function researchToDoc(r: ResearchDef): Doc {
  const lines = [`Status: ${r.status}.`, `Problem: ${r.problem}`, `Work: ${r.work}`];
  if (r.highlights?.length) lines.push(`Key results: ${r.highlights.join("; ")}`);
  if (r.resultsTable?.length) {
    lines.push(`Benchmark: ${r.resultsTable.map((row) => `${row.method} — ${row.acc} acc / ${row.asr} ASR`).join("; ")}`);
  }
  if (r.links.report) lines.push(`Full paper: ${r.links.report}`);
  if (r.links.github) lines.push(`GitHub: ${r.links.github}`);
  return { title: r.name, body: lines.join("\n") };
}

function credentialLines(items: CredentialItem[]): string {
  return items.length ? items.map((c) => `- ${c.name} — ${c.issuer}`).join("\n") : "- none listed";
}

// Builds the full { id -> doc } map for the current merged content. This is
// the single source both the AI system prompt and the terminal's `cat`
// command read from.
export function buildDocMap(content: MergedContent): Record<string, Doc> {
  const docs: Record<string, Doc> = { resume: RESUME_DOC };

  for (const p of content.projects) docs[p.id] = projectToDoc(p);
  for (const r of content.research) docs[r.id] = researchToDoc(r);

  docs.about = aboutToDoc(content.about);
  docs.experience = experienceToDoc(content.experience);
  docs.contact = contactToDoc(content.contact);

  docs["projects-index"] = {
    title: "Projects overview",
    body:
      content.projects.map((p) => `${p.featured ? "[Featured] " : ""}${p.name} — ${p.summary}`).join("\n") ||
      "No projects listed yet.",
  };
  docs["research-index"] = {
    title: "Research overview",
    body: content.research.map((r) => `${r.name} (${r.status}) — ${r.summary}`).join("\n") || "No research published yet.",
  };
  docs.skills = {
    title: "Skills & Certifications",
    body: `${skillGroupLines(content.skillGroups)}\n\nCertifications:\n${credentialLines(content.certifications)}\n\nCourses:\n${credentialLines(content.courses)}`,
  };

  return docs;
}

export function buildSystemPrompt(context: ContextKey | null | undefined, content: MergedContent): string {
  const docs = buildDocMap(content);
  const scoped = context ? docs[context] : null;
  const scopeHeader = scoped
    ? `The user is currently viewing: **${scoped.title}**. Prefer answering from this section first, but you may draw on the rest of the portfolio when helpful.`
    : `No specific section is focused. Answer from the entire portfolio.`;

  const allDocs = Object.values(docs)
    .map((d) => `## ${d.title}\n${d.body}`)
    .join("\n\n");

  return `You are the AI assistant embedded inside Abdullah's engineering workspace portfolio. Answer questions about his work concisely, warmly, and accurately.

${scopeHeader}

# Rules
- Ground every answer in the portfolio content below. Do not invent metrics, dates, or achievements.
- Keep answers under ~150 words unless the user explicitly asks for depth.
- Use markdown: short paragraphs, bullet lists, and code blocks when relevant.
- When you cite a specific project or section, mention it inline like [Renewly] or [Research].
- If asked something not in the portfolio, say you're not sure and suggest the Contact section.
- Never fabricate. If a detail isn't present, say "not documented yet" or "currently under development."

${scoped ? `# Focused section\n## ${scoped.title}\n${scoped.body}\n\n` : ""}# Full portfolio
${allDocs}`;
}
