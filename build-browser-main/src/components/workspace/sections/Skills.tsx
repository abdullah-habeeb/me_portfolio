import { Card, Chip, FadeIn, SectionHeader } from "../ui";

const SKILLS: Array<{ category: string; items: string[]; accent: string }> = [
  {
    category: "Languages",
    items: ["C++", "C", "Python", "Java", "JavaScript"],
    accent: "var(--cyan-accent)",
  },
  {
    category: "Full-Stack",
    items: ["React", "Express.js", "Node.js", "Flask", "REST APIs", "HTML", "CSS"],
    accent: "var(--violet-accent)",
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase Firestore"],
    accent: "var(--emerald-accent)",
  },
  {
    category: "DevOps",
    items: ["Docker", "Docker Compose", "Jenkins CI/CD", "Nginx", "Git", "GitHub", "Linux"],
    accent: "var(--amber-accent)",
  },
  {
    category: "AI / ML",
    items: ["LLMs", "RAG", "AI Agents", "Prompt Engineering", "Computer Vision (YOLO, MiDaS)", "Federated Learning"],
    accent: "var(--rose-accent)",
  },
];

const CERTIFICATIONS = [
  { name: "SAP Backend Developer (CAP)", issuer: "SAP · 2026" },
  { name: "SAP Business Data Cloud", issuer: "SAP · 2026" },
];

export function SkillsSection() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <FadeIn>
        <SectionHeader
          eyebrow="Toolbox"
          title="Skills & Certifications"
          subtitle="What I reach for when building — from languages and frameworks to cloud and ML tooling."
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid gap-4 md:grid-cols-2">
          {SKILLS.map((group) => (
            <Card key={group.category}>
              <div
                className="mb-3 text-xs font-medium uppercase tracking-wider"
                style={{ color: group.accent }}
              >
                {group.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item} accent={group.accent}>
                    {item}
                  </Chip>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="mt-10">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Certifications
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {CERTIFICATIONS.map((c) => (
              <Card key={c.name}>
                <div className="text-sm font-medium text-foreground">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.issuer}</div>
              </Card>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
