import { motion } from "framer-motion";
import { Github, Layers, FileText } from "lucide-react";

import { Card, Chip, FadeIn, SectionHeader } from "../ui";
import { TABS, type TabKind } from "../tabs-data";

export type ResearchDef = {
  id: Extract<TabKind, `research-${string}`>;
  name: string;
  summary: string;
  role: string;
  status: string;
  problem: string;
  work: string;
  architectureFlow: string[];
  highlights?: string[];
  contributions?: string[];
  stack: string[];
  accent: string;
  links: { github?: string; docs?: string; report?: string };
};

export const RESEARCH: ResearchDef[] = [
  {
    id: "research-stackelberg",
    name: "Adversarial Regularization",
    summary: "Defending Deep Neural Networks via Stackelberg Equilibria",
    role: "Research Publication • Under Review, Elsevier FGCS",
    status: "🟣 Under Review",
    problem:
      "Clean-label data poisoning attacks craft correctly-labeled training samples that implant hidden, high-severity backdoors. Because the labels look right, standard anomaly filters that look for mislabeled or out-of-distribution data often fail to catch them.",
    work:
      "Architected a Stackelberg game-theoretic pipeline from scratch in PyTorch to simulate and defend against clean-label poisoning attacks. The defender anticipates the attacker's optimal strategy and retrains against it using an iterative Min-Max algorithm with anticipatory warm-starting — proving both mathematically and empirically that existing anomaly filters fail under semantic data corruption.",
    architectureFlow: [
      "Clean-Label Poisoning Attack Simulation",
      "Stackelberg Game Formulation (Attacker–Defender)",
      "Iterative Min-Max Retraining (Anticipatory Warm-Starting)",
      "Defended Model",
      "Evaluation: Attack Success Rate vs. Clean Baseline"
    ],
    highlights: [
      "Backdoor Attack Success Rate suppressed to 3.53%",
      "Defended model outperformed a pristine, unpoisoned baseline by +4.54%",
      "Proved existing anomaly filters fail under semantic (clean-label) corruption",
      "Discovered a novel Adversarial Regularization effect"
    ],
    contributions: [
      "Architected the Stackelberg attacker/defender pipeline from scratch in PyTorch",
      "Engineered the iterative Min-Max retraining algorithm with anticipatory warm-starting",
      "Ran the experiments that surfaced the Adversarial Regularization effect",
      "Proved mathematically and empirically why existing anomaly filters fail here"
    ],
    stack: ["Python", "PyTorch", "Game Theory", "Min-Max Optimization"],
    accent: "var(--rose-accent)",
    links: {},
  }
];

export function ResearchIndex({ onOpen }: { onOpen: (t: TabKind) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <FadeIn>
        <SectionHeader
          eyebrow="Research"
          title="Academic & Applied Research"
          subtitle="Research on adversarial robustness in deep learning, currently under review."
        />
      </FadeIn>
      <div className="grid gap-4 md:grid-cols-2">
        {RESEARCH.map((r, i) => {
          const tab = TABS[r.id as TabKind];
          const Icon = tab?.icon || FileText;
          return (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.05, duration: 0.35 }}
              whileHover={{ y: -2 }}
              onClick={() => onOpen(r.id as TabKind)}
              className="group text-left rounded-xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-border flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-md shrink-0"
                    style={{ background: `color-mix(in oklab, ${r.accent} 15%, transparent)` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: r.accent }} />
                  </span>
                  <div>
                    <div className="text-base font-semibold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.summary}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between w-full">
                <div className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  Open Workspace &rarr;
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {r.stack.slice(0, 3).map((s) => (
                    <Chip key={s} accent={r.accent}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function ResearchPage({ research }: { research: ResearchDef }) {
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <FadeIn>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: research.accent }} />
          <span className="text-[11px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
            {research.role}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{research.name}</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">{research.summary}</p>
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-elevated/80 px-3 py-1 text-xs font-medium text-foreground border border-border/50 shadow-sm">
            {research.status}
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            The Problem
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{research.problem}</p>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            My Work
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{research.work}</p>
        </section>
      </FadeIn>

      <FadeIn delay={0.12}>
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
            Architecture
          </h2>
          <div className="rounded-xl border border-border/60 bg-elevated/30 p-6 flex flex-col items-center">
            {research.architectureFlow.map((step, idx) => (
              <div key={step} className="flex flex-col items-center w-full">
                <div className="px-4 py-2 bg-card/60 border border-border/80 rounded-md text-sm font-medium text-center w-full max-w-xs shadow-sm">
                  {step}
                </div>
                {idx < research.architectureFlow.length - 1 && (
                  <div className="my-2 text-muted-foreground/60 text-lg">↓</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {research.highlights && (
        <FadeIn delay={0.14}>
          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
              Research Highlights
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {research.highlights.map((h) => (
                <div key={h} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span className="text-[14px] text-foreground/90 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {research.contributions && (
        <FadeIn delay={0.16}>
          <section className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground mb-4">
              Technical Contributions
            </h2>
            <ul className="space-y-3">
              {research.contributions.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full mt-2 shrink-0 bg-muted-foreground/50" />
                  <span className="text-[14px] text-foreground/90 leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>
      )}

      <FadeIn delay={0.2}>
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Tech Stack
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {research.stack.map((s) => (
              <Chip key={s} accent={research.accent}>
                {s}
              </Chip>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.24}>
        <section className="mt-12 flex flex-wrap gap-2">
          {research.links.github && (
            <a
              href={research.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-elevated px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Github className="h-4 w-4" /> Repository <span className="opacity-50">&rarr;</span>
            </a>
          )}
          {research.links.docs && (
            <a
              href={research.links.docs}
              className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-elevated px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Layers className="h-4 w-4" /> Architecture
            </a>
          )}
          {research.links.report && (
            <a
              href={research.links.report}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-primary transition-colors hover:opacity-90"
            >

            </a>
          )}
        </section>
      </FadeIn>
    </div>
  );
}
