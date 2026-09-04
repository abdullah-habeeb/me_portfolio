import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useContent } from "@/lib/useContent";

import { resolveTabDef } from "./content-resolve";
import { TABS, type TabKind } from "./tabs-data";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenTab: (id: TabKind) => void;
};

type Entry = {
  id: TabKind;
  label: string;
  sublabel: string;
  keywords: string;
};

function scoreMatch(query: string, entry: Entry): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  if (!entry.keywords.includes(q)) return -1;
  if (entry.label.toLowerCase().startsWith(q)) return 100;
  if (entry.label.toLowerCase().includes(q)) return 50;
  return 10;
}

export function CommandPalette({ open, onClose, onOpenTab }: Props) {
  const content = useContent();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries: Entry[] = useMemo(() => {
    const staticEntries = (Object.values(TABS) as (typeof TABS)[keyof typeof TABS][]).map((tab) => ({
      id: tab.id,
      label: tab.label,
      sublabel: tab.breadcrumb.slice(0, -1).join(" / ") || "Workspace",
      keywords: `${tab.label} ${tab.breadcrumb.join(" ")} ${tab.filename}`.toLowerCase(),
    }));
    const dynamicEntries = [...content.projects, ...content.research].map((item) => {
      const tab = resolveTabDef(item.id, content);
      return {
        id: tab.id,
        label: tab.label,
        sublabel: tab.breadcrumb.slice(0, -1).join(" / ") || "Workspace",
        keywords: `${tab.label} ${tab.breadcrumb.join(" ")} ${tab.filename}`.toLowerCase(),
      };
    });
    return [...staticEntries, ...dynamicEntries];
  }, [content]);

  const results = useMemo(() => {
    return entries
      .map((e) => ({ entry: e, score: scoreMatch(query, e) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.entry);
  }, [entries, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(results.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const entry = results[selected];
        if (entry) {
          onOpenTab(entry.id);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, selected, onOpenTab, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed left-1/2 top-[14vh] z-[101] w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border/70 bg-panel shadow-2xl shadow-black/40"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a tab, project, or section…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <kbd className="hidden shrink-0 rounded border border-border/70 bg-elevated/60 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
                Esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-1.5">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No matches for "{query}"
                </div>
              ) : (
                results.map((entry, i) => {
                  const tab = resolveTabDef(entry.id, content);
                  const Icon = tab.icon;
                  const isSelected = i === selected;
                  return (
                    <button
                      key={entry.id}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => {
                        onOpenTab(entry.id);
                        onClose();
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        isSelected ? "bg-elevated text-foreground" : "text-foreground/85"
                      }`}
                    >
                      <span
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                        style={{ background: `color-mix(in oklab, ${tab.accent} 15%, transparent)` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: tab.accent }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{entry.label}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {entry.sublabel}
                        </span>
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2 text-[11px] text-muted-foreground/70">
              <span>↑↓ to navigate</span>
              <span>Enter to open</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
