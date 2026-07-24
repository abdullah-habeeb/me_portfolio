import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FadeIn, SectionHeader } from "../ui";

const EXPERIENCE = [
  {
    role: "Software Engineering Extern",
    org: "Unisys — Remote",
    period: "Dec 2025 – May 2026",
    accent: "var(--rose-accent)",
    details:
      "Built a Python (Flask) + PowerShell system that autonomously monitors Windows OS events and applies rules-based corrections, designed end-to-end with no existing framework to extend. Shipped a real-time event-tracking dashboard with severity classification and remediation scheduling, owning the full stack from backend logic to the operator-facing UI. Engineered an automated logging pipeline processing 10,000+ system events with metadata enrichment for scalable downstream analytics.",
  },
  {
    role: "Social Media & Design Head",
    org: "AWS Student Builder Group, BMSITM",
    period: "Nov 2025 – Present",
    accent: "var(--amber-accent)",
    details:
      "Led end-to-end design operations and cross-functional coordination for the college's AWS community chapter.",
  },
];

const ACHIEVEMENTS: Array<{ text: string; link?: string }> = [
  { text: "SAP Backend Developer (CAP) — 2026" },
  { text: "SAP Business Data Cloud — 2026" },
  { text: "3rd Place, UI/UX Design Ideathon (May 2025) — high-fidelity Figma prototype replicating the IKS Health platform" },
];

export function ExperienceSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <FadeIn>
        <SectionHeader
          eyebrow="Timeline"
          title="Experience & Leadership"
          subtitle="Industry experience, cloud community leadership, and achievements."
        />
      </FadeIn>

      <div className="grid gap-3">
        {EXPERIENCE.map((e, i) => {
          const isOpen = open === i;
          return (
            <FadeIn key={e.role} delay={0.04 * i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full rounded-xl border border-border/70 bg-card/60 p-5 text-left transition-colors hover:border-border"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: e.accent }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{e.role}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.org}{e.period ? ` · ${e.period}` : ""}
                      </div>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {e.details}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.2}>
        <div className="mt-10">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Achievements
          </div>
          <ul className="space-y-2 text-sm text-foreground/90">
            {ACHIEVEMENTS.map((a) => (
              <li key={a.text} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{a.text}</span>
                {a.link && (
                  <a href={a.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded border border-border/80 bg-elevated/60 px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground shadow-sm ml-1">
                    Builder Article ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}
