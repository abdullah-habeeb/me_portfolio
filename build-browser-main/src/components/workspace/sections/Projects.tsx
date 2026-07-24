import { motion } from "framer-motion";
import { Github, Layers } from "lucide-react";

import { GithubBadge } from "../GithubBadge";
import { Card, Chip, FadeIn, SectionHeader } from "../ui";
import { TABS, type TabKind } from "../tabs-data";

export type ProjectDef = {
  id: Extract<TabKind, `project-${string}`>;
  name: string;
  summary: string;
  problem: string;
  architecture: string;
  stack: string[];
  accent: string;
  links: { github?: string; docs?: string; demo?: string };
  featured?: boolean;

  image?: string;
  topTags?: string[];
  solution?: string;
  stackCategorized?: { category: string; items: string[] }[];
  engineeringDecisions?: { name: string; reason: string }[];
  challenges?: string[];
  keyCapabilities?: { icon: string; title: string; description: string }[];
  hasLiveDemo?: boolean;
};

export const PROJECTS: ProjectDef[] = [
  {
    id: "project-renewly",
    name: "Renewly",
    summary: "Every subscription. One quiet place.",
    topTags: ["Full-Stack", "Fintech", "DevOps"],
    problem:
      "A subscription is ₹499 here, ₹1,950 there — an annual plan agreed to eleven months ago and forgotten the moment the tab closed. Each one is too small to notice alone, until a bank statement adds them all up in a number you didn't see coming.",
    solution:
      "Renewly connects to Gmail read-only, reads the payment receipts and bank-alert emails already sitting in the inbox, reconstructs recurring charges automatically, tracks running monthly/yearly cost, and emails a reminder before the next renewal — built India-first around how Indian banks and UPI actually notify a charge, not retrofitted from a US-style bank-linking product.",
    architecture:
      "React 19 SPA (TanStack Router, Tailwind, shadcn/ui) ↔ realtime Firestore for CRUD, and → Express REST API (Bearer Firebase ID token) for anything needing server secrets: Gmail OAuth scanning, Plaid Sandbox bank linking, and a daily reminder cron over Nodemailer/Gmail SMTP.",
    stack: ["React 19", "Express.js", "Firebase", "Plaid", "Docker", "Jenkins CI/CD"],
    stackCategorized: [
      { category: "Frontend", items: ["React 19", "Vite", "TypeScript", "Tailwind CSS 4", "TanStack Router"] },
      { category: "Backend", items: ["Node.js", "Express", "Firebase Admin SDK"] },
      { category: "Integrations", items: ["Firebase Auth + Firestore", "Plaid (bank linking)", "Gmail API (OAuth)", "Claude (optional extraction)"] },
      { category: "Infra & CI/CD", items: ["Docker + Nginx", "Jenkins (lint → test → build → Trivy scan → deploy)", "Firebase Hosting + Render"] },
    ],
    engineeringDecisions: [
      { name: "Why Gmail instead of bank-linking?", reason: "Plaid has no coverage of Indian banks; Gmail is the closest thing to a real-time transaction feed available without a business registration." },
      { name: "Why Firestore over PostgreSQL?", reason: "Realtime onSnapshot listeners let the dashboard reflect new detections live, and per-user security rules handle authorization without a separate auth service." },
      { name: "Why keep AI extraction off by default?", reason: "The Claude fallback pass is built and tested, but it needs an API key and I didn't want it running against a personal budget indefinitely." },
    ],
    challenges: [
      "Deduping the same subscription across multiple linked Gmail inboxes",
      "Filtering marketing email out of the same inbox real receipts live in",
      "Reconstructing recurring charges from unstructured bank-alert emails",
      "Keeping a reminder cron reliable on a free-tier backend that sleeps when idle",
    ],
    accent: "var(--emerald-accent)",
    links: { github: "https://github.com/abdullah-habeeb/renewly-subscription-tracker", demo: "https://subscription-hub-19cf9.web.app" },
    featured: true,
  },
  {
    id: "project-ciphercare",
    name: "CipherCare",
    summary: "Privacy-Preserving Federated Learning Platform for Healthcare AI",
    topTags: ["Federated Learning", "Differential Privacy", "Healthcare AI"],
    problem:
      "Healthcare AI models are typically trained on centralized datasets, requiring hospitals to transfer sensitive patient records into a single repository — a privacy, compliance, and interoperability problem that leaves smaller hospitals with limited data producing weaker diagnostic models.",
    solution:
      "CipherCare simulates five hospital nodes — ECG, vitals, X-ray, geriatric ECG, and multimodal — collaboratively training a shared model via Flower, using a custom FedProxFairness strategy that layers FedProx, fairness-weighted aggregation, differential privacy, and domain-relevance scoring on top, with a blockchain-style hash-chained audit trail for compliance traceability.",
    architecture:
      "Federated Server (Flower + custom FedProxFairness strategy) coordinates training rounds across 5 hospital clients, each training locally and applying differential privacy before sending updates. A DP Update Processor hashes and chains each round into a blockchain-style audit log, surfaced on a React/Vite monitoring dashboard.",
    stack: ["Python", "PyTorch", "Flower", "FastAPI", "React"],
    stackCategorized: [
      { category: "ML / FL", items: ["PyTorch (S4 ECG classifier)", "Flower (flwr)", "Custom FedProxFairness strategy"] },
      { category: "Privacy & Audit", items: ["Differential Privacy (ε=5.0, δ=1e-5)", "Domain relevance scoring", "SHA-256 / Keccak256 audit chain"] },
      { category: "Serving & Dashboard", items: ["FastAPI", "React", "Vite", "Tailwind"] },
    ],
    engineeringDecisions: [
      { name: "Why Flower + a custom strategy?", reason: "Flower handles client/server orchestration; the research contribution — FedProx + fairness weighting + DP + domain relevance + audit — is a custom Strategy on top." },
      { name: "Why fairness-weighted aggregation?", reason: "Pure sample-count weighting would let Hospital A's 17,418 ECG samples drown out Hospital C's 160 X-ray samples even when C performs well locally." },
      { name: "Why exclude datasets/weights from the repo?", reason: "Privacy, compliance, and size — the project follows a code-first reproducibility model, mirroring real-world ML research and production workflows." },
    ],
    challenges: [
      "Weighting aggregation without letting large hospitals dominate",
      "Calibrating DP noise per hospital without over-degrading small datasets",
      "Building a domain relevance metric meaningful across ECG, vitals, and X-ray",
      "Making the audit trail actually verifiable, not just a log file",
    ],
    accent: "var(--cyan-accent)",
    links: { github: "https://github.com/abdullah-habeeb/ciphercare" },
    featured: true,
  },
  {
    id: "project-pothole",
    name: "Pothole Detection Platform",
    summary: "Full-Stack Pothole Detection & Monitoring Platform",
    topTags: ["Full-Stack", "Computer Vision", "Smart City"],
    problem:
      "Identifying and tracking road hazards like potholes is normally manual and reactive, with no unified system to detect, verify, and visualize them at scale.",
    solution:
      "Users upload dashcam footage through a React frontend. A dedicated FastAPI ML microservice samples every 5th frame with OpenCV, sends frames to a Roboflow-hosted YOLOv11 model, and returns a severity rating plus up to 5 detections with bounding boxes and preview images. Results surface on an interactive map and admin dashboard behind JWT-authenticated routes.",
    architecture:
      "React 18 + TypeScript frontend (upload, map, dashboard) → Node.js + Express + MongoDB backend (JWT auth, orchestration) → FastAPI ml-server (OpenCV frame sampling → Roboflow YOLOv11 via InferenceHTTPClient). Three independent services: frontend (3000), backend (5000), ml-server (8000).",
    stack: ["React 18", "Node.js", "MongoDB", "FastAPI", "Roboflow YOLOv11"],
    stackCategorized: [
      { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "TanStack Query", "React Leaflet", "Recharts"] },
      { category: "Backend", items: ["Node.js", "Express", "MongoDB (Mongoose)", "JWT auth"] },
      { category: "ML Service", items: ["FastAPI", "OpenCV", "Roboflow Inference SDK (YOLOv11)"] },
    ],
    engineeringDecisions: [
      { name: "Why a separate FastAPI microservice?", reason: "Keeps the Python ML ecosystem (OpenCV, Roboflow SDK) decoupled from the Node API layer — it can be scaled or redeployed independently." },
      { name: "Why a Roboflow-hosted model?", reason: "Avoids managing GPU infrastructure at this stage while still getting real YOLOv11 detections." },
      { name: "Why sample every 5th frame?", reason: "Running inference on every frame is expensive and mostly redundant — pothole framing barely changes between adjacent frames." },
    ],
    challenges: [
      "Keeping the detection response shape consistent across three independently developed services",
      "Coordinating three separate dev servers during development",
      "Balancing frame-sampling rate against detection coverage and latency",
    ],
    accent: "var(--amber-accent)",
    links: { github: "https://github.com/abdullah-habeeb/pothole" },
  },
  {
    id: "project-fare-calculator",
    name: "Bengaluru Auto Fare Calculator",
    summary: "Official Auto-Rickshaw Fare Calculator for Bengaluru",
    topTags: ["Web", "Google Maps API", "Vanilla JS"],
    problem:
      "Auto-rickshaw fares in Bengaluru are often inconsistent in practice, leading to confusion and overcharging, with no quick official way to check what a trip should cost.",
    solution:
      "A focused web app using Google Places Autocomplete and the Distance Matrix API to get real road distance, then applies the official fare structure — ₹35 minimum for the first 2 km, ₹17/km after, with an automatic 1.5x night surcharge between 10 PM and 5 AM. Built as a one-week project to practice API integration and DOM manipulation without framework overhead.",
    architecture:
      "Single-page vanilla JS app: Google Places Autocomplete for location input → Distance Matrix API for road distance → client-side fare logic (minimum fare + per-km rate + night surcharge window) rendered directly to the DOM.",
    stack: ["HTML5", "CSS3", "Vanilla JavaScript", "Google Maps API"],
    stackCategorized: [
      { category: "Frontend", items: ["HTML5", "CSS3 (Flexbox)", "Vanilla JavaScript"] },
      { category: "APIs", items: ["Google Places API", "Google Distance Matrix API"] },
    ],
    engineeringDecisions: [
      { name: "Why vanilla JS instead of a framework?", reason: "Scoped as a one-week project to practice core API integration and DOM manipulation — a framework would have been overhead for a single-page calculator." },
      { name: "Why Distance Matrix over straight-line distance?", reason: "Fare depends on real road distance, not as-the-crow-flies distance, so the calculated fare stays accurate to what a rider is actually charged." },
    ],
    challenges: [
      "Getting road-accurate distance instead of straight-line distance",
      "Implementing the night-surcharge window correctly across the 10 PM–5 AM boundary",
      "Keeping the UI clean and mobile-friendly with plain CSS and no framework",
    ],
    accent: "var(--violet-accent)",
    links: { github: "https://github.com/abdullah-habeeb/bengaluru-auto-fare-calculator" },
  },
];

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
  const tab = TABS[p.id];
  const Icon = tab.icon;
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

export function ProjectsIndex({ onOpen }: { onOpen: (t: TabKind) => void }) {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
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
