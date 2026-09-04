import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronRight, Command, X } from "lucide-react";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";

import type { MergedContent } from "@/data/types";
import { useContent } from "@/lib/useContent";

import { AIPanel } from "./AIPanel";
import { CommandPalette } from "./CommandPalette";
import { resolveTabDef } from "./content-resolve";
import { Explorer } from "./Explorer";
import { type TabKind } from "./tabs-data";
import { resolveContextMeta, tabToContext } from "./context-labels";
import { AboutSection } from "./sections/About";
import { ContactSection } from "./sections/Contact";
import { ExperienceSection } from "./sections/Experience";
import { ProjectPage, ProjectsIndex } from "./sections/Projects";
import { ResearchPage, ResearchIndex } from "./sections/Research";
import { ResumeSection } from "./sections/Resume";
import { SkillsSection } from "./sections/Skills";
import { TerminalSection } from "./sections/Terminal";

function renderTab(id: TabKind, open: (t: TabKind) => void, content: MergedContent) {
  switch (id) {
    case "about":
      return <AboutSection onOpen={open} />;
    case "projects-index":
      return <ProjectsIndex projects={content.projects} onOpen={open} />;
    case "research-index":
      return <ResearchIndex research={content.research} onOpen={open} />;
    case "experience":
      return <ExperienceSection />;
    case "skills":
      return <SkillsSection skillGroups={content.skillGroups} certifications={content.certifications} courses={content.courses} />;
    case "resume":
      return <ResumeSection />;
    case "contact":
      return <ContactSection />;
    case "terminal":
      return <TerminalSection onOpen={open} content={content} />;
    default: {
      const project = content.projects.find((p) => p.id === id);
      if (project) return <ProjectPage project={project} />;
      const research = content.research.find((r) => r.id === id);
      if (research) return <ResearchPage research={research} />;
      return null;
    }
  }
}

export function Workspace() {
  const [openTabs, setOpenTabs] = useState<TabKind[]>(["about"]);
  const [active, setActive] = useState<TabKind>("about");
  const [contextOverride, setContextOverride] = useState<null | "cleared">(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const open = useCallback((id: TabKind) => {
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActive(id);
    setContextOverride(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const isModP = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p";
      if (isModK || isModP) {
        e.preventDefault();
        setIsPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = useCallback(
    (id: TabKind) => {
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t !== id);
        if (active === id) {
          const idx = prev.indexOf(id);
          const fallback = next[idx] ?? next[idx - 1] ?? next[0] ?? null;
          if (fallback) setActive(fallback);
        }
        return next;
      });
    },
    [active],
  );

  const content = useContent();
  const tab = resolveTabDef(active, content);
  const isResume = active === "resume";

  const chatContext = useMemo(
    () => (contextOverride === "cleared" ? null : tabToContext(active)),
    [active, contextOverride],
  );
  const chatContextMeta = useMemo(() => resolveContextMeta(chatContext, content), [chatContext, content]);

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    setContextOverride(null);
  }, [active]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Left */}
      <div className="hidden md:flex w-[260px] shrink-0 min-h-0 flex-col border-r border-border/60">
        <Explorer activeTab={active} onOpen={open} />
      </div>

      {/* Center */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* Tab bar */}
        <div className="flex h-9 items-center gap-0 border-b border-border/60 bg-panel/70 pl-1">
          <div className="flex flex-1 items-center overflow-x-auto">
            <AnimatePresence initial={false}>
              {openTabs.map((id) => {
                const t = resolveTabDef(id, content);
                const Icon = t.icon;
                const isActive = active === id;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`group flex h-9 shrink-0 items-center gap-2 border-r border-border/60 px-3 text-xs transition-colors ${
                      isActive
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:bg-elevated/60 hover:text-foreground"
                    }`}
                  >
                    <button
                      onClick={() => setActive(id)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: t.accent }} />
                      <span>{t.filename}</span>
                    </button>
                    <button
                      onClick={() => close(id)}
                      className="ml-1 rounded p-0.5 opacity-60 transition-opacity hover:bg-accent hover:opacity-100"
                      aria-label={`Close ${t.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="hidden md:flex h-full items-center gap-1.5 border-l border-border/60 px-3 text-xs text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
            title="Command palette"
          >
            <Command className="h-3.5 w-3.5" />
            <kbd className="rounded border border-border/70 bg-elevated/60 px-1 py-0.5 text-[10px]">
              Ctrl K
            </kbd>
          </button>
          <button
            onClick={() => setIsAIOpen((prev) => !prev)}
            className={`flex h-full items-center gap-2 border-l border-border/60 px-4 text-xs font-medium transition-colors hover:bg-elevated ${isAIOpen ? "bg-elevated text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Ask Abdullah</span>
          </button>
        </div>

        {/* Breadcrumb */}
        {openTabs.length > 0 && !isResume && (
          <div className="flex items-center gap-1 border-b border-border/60 bg-background/80 px-5 py-2 text-[11px] text-muted-foreground">
            {tab.breadcrumb.map((c, i) => (
              <span key={c} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
                <span
                  className={
                    i === tab.breadcrumb.length - 1
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {c}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto">
          {openTabs.length === 0 ? (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              No files open — pick something from the explorer.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
                className="h-full"
              >
                {renderTab(active, open, content)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Status bar */}
        <div className="flex h-6 items-center justify-between border-t border-border/60 bg-panel/80 px-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--emerald-accent)" }}
              />
              workspace ready
            </span>
            <span className="hidden sm:inline">Knowledge · loaded</span>
            <span className="hidden md:inline">
              Context ·{" "}
              <span className="text-foreground/80">
                {chatContext ? tab.label : "Entire portfolio"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>{tab.filename}</span>
            <span className="hidden sm:inline">UTF-8</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <AnimatePresence>
        {isAIOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIOpen(false)}
              className="absolute inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute inset-y-0 right-0 z-50 flex w-[85vw] sm:w-[360px] shrink-0 flex-col border-l border-border/60 bg-panel shadow-2xl md:relative md:w-[360px] md:translate-x-0 md:shadow-none"
            >
              <button 
                onClick={() => setIsAIOpen(false)} 
                className="absolute top-3 right-3 z-50 grid h-7 w-7 place-items-center rounded-md bg-elevated text-foreground md:hidden hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-full w-full flex-col">
                <AIPanel
                  context={chatContext}
                  meta={chatContextMeta}
                  onClearContext={() => setContextOverride("cleared")}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CommandPalette
        open={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenTab={open}
      />
    </div>
  );
}
