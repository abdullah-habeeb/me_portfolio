import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useContent } from "@/lib/useContent";

import { Card, Chip, FadeIn, SectionHeader } from "../ui";
import type { TabKind } from "../tabs-data";

import { ExperienceSection } from "./Experience";
import { ProjectsIndex } from "./Projects";
import { ResearchIndex } from "./Research";
import { SkillsSection } from "./Skills";
import { ContactSection } from "./Contact";

export function AboutSection({ onOpen }: { onOpen: (t: TabKind) => void }) {
  const content = useContent();
  const { bio, photo, stats, interests, highlights } = content.about;
  return (
    <div className="h-full">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="flex-1">
              <SectionHeader eyebrow="README" title="About Me" subtitle={bio} />
            </div>
            <div className="w-full md:w-64 shrink-0 mx-auto md:mx-0">
              <img
                src={photo}
                alt="Abdullah"
                className="w-full h-auto rounded-2xl object-cover border border-border/60 shadow-lg shadow-black/20"
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mb-10">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Quick Stats
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
                  className="rounded-xl border border-border/70 bg-card/60 p-4"
                >
                  <div className="text-lg font-semibold text-foreground">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-10">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Technical Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div>
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Highlights
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {highlights.map((h) => (
                <div key={h.id} className={h.featured ? "md:col-span-3" : ""}>
                  <Card className={h.featured ? "border-[var(--emerald-accent)]/30 bg-[var(--emerald-accent)]/10 shadow-[0_0_20px_rgba(var(--emerald-accent-rgb),0.1)]" : ""}>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: h.accent }}
                      />
                      <div className="text-sm font-medium text-foreground">{h.title}</div>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{h.detail}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-12 flex flex-wrap gap-3">
            <button
              onClick={() => onOpen("projects-index")}
              className="group inline-flex items-center gap-2 rounded-md border border-border/80 bg-elevated px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              Explore projects
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => onOpen("research-index")}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View research
            </button>
            <button
              onClick={() => onOpen("skills")}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              See skills & certifications
            </button>
          </div>
        </FadeIn>
      </div>

      <div className="border-t border-border/60 bg-muted/20">
        <ProjectsIndex projects={content.projects} onOpen={onOpen} />
      </div>

      <div className="border-t border-border/60">
        <ResearchIndex research={content.research} onOpen={onOpen} />
      </div>

      <div className="border-t border-border/60 bg-muted/20">
        <ExperienceSection />
      </div>

      <div className="border-t border-border/60">
        <SkillsSection skillGroups={content.skillGroups} certifications={content.certifications} courses={content.courses} />
      </div>

      <div className="border-t border-border/60 bg-muted/20">
        <ContactSection />
      </div>
    </div>
  );
}
