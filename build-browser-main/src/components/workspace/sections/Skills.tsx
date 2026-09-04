import type { CredentialItem, SkillGroup } from "@/data/types";

import { Card, Chip, FadeIn, SectionHeader } from "../ui";

export function SkillsSection({
  skillGroups,
  certifications,
  courses,
}: {
  skillGroups: SkillGroup[];
  certifications: CredentialItem[];
  courses: CredentialItem[];
}) {
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
          {skillGroups.map((group) => (
            <Card key={group.id}>
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
            {certifications.map((c) => (
              <Card key={c.id}>
                <div className="text-sm font-medium text-foreground">{c.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.issuer}</div>
              </Card>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-10">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Courses
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.id}>
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
