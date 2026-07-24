import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FolderClosed, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

import { Workspace } from "@/components/workspace/Workspace";

export const Route = createFileRoute("/")({
  component: Index,
});

const LOADING_STEPS = [
  "Initializing Workspace...",
  "Loading portfolio...",
  "Loading research...",
  "Loading projects...",
  "Connecting AI assistant...",
  "Preparing engineering workspace...",
];

type Phase = "loading" | "picker" | "workspace";

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const total = 2600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(p);
      setStep(Math.min(LOADING_STEPS.length - 1, Math.floor(p * LOADING_STEPS.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-screen w-screen items-center justify-center bg-background"
    >
      <div className="w-full max-w-sm px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg border border-border/70 bg-panel">
            <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_var(--cyan-accent)]" />
          </div>
        </motion.div>

        <div className="relative h-1 w-full overflow-hidden rounded-full bg-elevated">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="mt-5 h-5 text-xs text-muted-foreground">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {LOADING_STEPS[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function WorkspacePicker({ onOpen }: { onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen w-screen items-center justify-center bg-background"
    >
      <div className="w-full max-w-xl px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          Choose a workspace
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          Open a workspace to begin.
        </motion.p>

        <motion.button
          onClick={onOpen}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="group mt-10 w-full rounded-2xl border border-border/70 bg-panel p-6 text-left transition-all hover:border-border hover:shadow-2xl hover:shadow-black/40"
          style={{ transform: hover ? "translateY(-4px)" : "translateY(0)" }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: hover ? -6 : 0, scale: hover ? 1.05 : 1 }}
              transition={{ duration: 0.25 }}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--cyan-accent) 20%, transparent), color-mix(in oklab, var(--emerald-accent) 15%, transparent))",
                border: "1px solid color-mix(in oklab, var(--cyan-accent) 30%, transparent)",
              }}
            >
              {hover ? (
                <FolderOpen className="h-6 w-6 text-primary" />
              ) : (
                <FolderClosed className="h-6 w-6 text-primary" />
              )}
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="text-lg font-semibold text-foreground">Abdullah</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Full-Stack Engineering · DevOps · Federated Learning
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground/70">↵ Open</div>
          </div>
        </motion.button>

        <div className="mt-10 text-[11px] text-muted-foreground/70">
          Press Enter or click the folder to enter the workspace.
        </div>
      </div>
    </motion.div>
  );
}

function Index() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    if (phase !== "picker") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") setPhase("workspace");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  return (
    <AnimatePresence mode="wait">
      {phase === "loading" && (
        <LoadingScreen key="loading" onDone={() => setPhase("picker")} />
      )}
      {phase === "picker" && (
        <WorkspacePicker key="picker" onOpen={() => setPhase("workspace")} />
      )}
      {phase === "workspace" && (
        <motion.div
          key="workspace"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Workspace />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
