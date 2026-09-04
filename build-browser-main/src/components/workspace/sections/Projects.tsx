import { motion } from "framer-motion";
import { Boxes, Github, Layers } from "lucide-react";

import type { ProjectDef } from "@/data/types";

import { GithubBadge } from "../GithubBadge";
import { Card, Chip, FadeIn, SectionHeader } from "../ui";
import { SEED_ICON_BY_ID, type TabKind } from "../tabs-data";

export type { ProjectDef };

function ProjectCard({
  p,
  i,
  onOpen,
  featured,
}: {
  p: ProjectDef;
  i: number;
  onOpen: (t: TabKind) => void;
  featured?: boolean;
}) {
  const Icon = SEED_ICON_BY_ID[p.id] ?? Boxes;
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * i + 0.05, duration: 0.35 }}
      whileHover={{ y: -2 }}
      onClick={() => onOpen(p.id)}
      className={`group relative text-left rounded-xl border p-5 transition-colors flex flex-col justify-between ${
        featured
          ? "border-border bg-card/80 hover:border-[var(--cyan-accent)]/60 shadow-sm"
          : "border-border/70 bg-card/60 hover:border-border"
      }`}
      style={
        featured
          ? { boxShadow: `0 0 0 1px color-mix(in oklab, ${p.accent} 25%, transparent)` }
          : undefined
      }
    >
      {featured && (
        <span
          className="absolute -top-2.5 left-4 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em]"
          style={{
            background: `color-mix(in oklab, ${p.accent} 18%, var(--card))`,
            borderColor: `color-mix(in oklab, ${p.accent} 40%, transparent)`,
            color: p.accent,
          }}
        >
          Featured
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="grid h-8 w-8 place-items-center rounded-md shrink-0"
            style={{ background: `color-mix(in oklab, ${p.accent} 15%, transparent)` }}
          >
            <Icon className="h-4 w-4" style={{ color: p.accent }} />
          </span>
          <div>
            <div className="text-base font-semibold text-foreground">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.summary}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between w-full">
        <div className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          Open Workspace &rarr;
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {p.stack.slice(0, 3).map((s) => (
            <Chip key={s} accent={p.accent}>
              {s}
            </Chip>
          ))}
        </div>
      </div>
      {p.links.github && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <GithubBadge repoUrl={p.links.github} />
        </div>
      )}
    </motion.button>
  );
}

export function ProjectsIndex({ projects, onOpen }: { projects: ProjectDef[]; onOpen: (t: TabKind) => void }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <FadeIn>
        <SectionHeader
          eyebrow="Projects"
          title="Systems I've built"
          subtitle="Full-stack fintech and privacy-preserving ML systems that reflect how I approach end-to-end ownership."
        />
      </FadeIn>

      {featured.length > 0 && (
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} onOpen={onOpen} featured />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <>
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            More Projects
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i + featured.length} onOpen={onOpen} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ProjectPage({ project }: { project: ProjectDef }) {
  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <FadeIn>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent }} />
          {project.topTags ? (
            <span className="text-[11px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
              {project.topTags.join(" • ")}
            </span>
          ) : (
            <span
              className="text-[11px] font-medium uppercase tracking-[0.16em]"
              style={{ color: project.accent }}
            >
              Project
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.name}</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">{project.summary}</p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {project.solution ? "The Problem" : "Overview"}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{project.problem}</p>
        </section>
      </FadeIn>

      {project.image && (
        <FadeIn delay={0.1}>
          <section className="mt-10">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-white/5">
              <img
                src={project.image}
                alt={`${project.name} Architecture`}
                className="w-full h-auto"
              />
            </div>
          </section>
        </FadeIn>
      )}

      {project.solution && (
        <FadeIn delay={0.12}>
          <section className="mt-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              My Solution
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{project.solution}</p>
          </section>
        </FadeIn>
      )}

      {project.keyCapabilities && (
        <FadeIn delay={0.13}>
          <section className="mt-12">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
              Key Capabilities
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.keyCapabilities.map((cap) => (
                <div key={cap.title} className="flex gap-3 p-4 rounded-xl border border-border/60 bg-elevated/30">
                  <span className="text-2xl">{cap.icon}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">{cap.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {project.architecture && (
        <FadeIn delay={0.14}>
          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Architecture
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
              {project.architecture}
            </p>
          </section>
        </FadeIn>
      )}

      {project.stackCategorized ? (
        <FadeIn delay={0.16}>
          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
              Tech Stack
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {project.stackCategorized.map((cat) => (
                <div key={cat.category}>
                  <div className="text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wide">
                    {cat.category}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {cat.items.map((item) => (
                      <div key={item} className="text-[13px] text-muted-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      ) : (
        <FadeIn delay={0.2}>
          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Tech Stack
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Chip key={s} accent={project.accent}>
                  {s}
                </Chip>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {project.engineeringDecisions && (
        <FadeIn delay={0.2}>
          <section className="mt-12">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Engineering Decisions
              </h2>
              <span className="text-lg leading-none">⭐</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {project.engineeringDecisions.map((dec) => (
                <Card key={dec.name} className="p-4 bg-elevated/40 border-border/50">
                  <div className="text-sm font-medium text-foreground mb-1">{dec.name}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{dec.reason}</div>
                </Card>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {project.challenges && (
        <FadeIn delay={0.24}>
          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Challenges
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              {project.challenges.map((c) => (
                <li key={c} className="text-sm text-foreground/80">
                  {c}
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>
      )}

      <FadeIn delay={0.28}>
        <section className="mt-12 flex flex-wrap gap-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-elevated px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Github className="h-4 w-4" /> View Repository <span className="opacity-50">&rarr;</span>
            </a>
          )}
          {project.links.docs && (
            <a
              href={project.links.docs}
              className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-elevated px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Layers className="h-4 w-4" /> Documentation
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-primary transition-colors hover:opacity-90"
            >
              Live Demo
            </a>
          )}
        </section>
      </FadeIn>

      {project.links.github && (
        <FadeIn delay={0.3}>
          <div className="mt-3">
            <GithubBadge repoUrl={project.links.github} />
          </div>
        </FadeIn>
      )}
    </div>
  );
}
