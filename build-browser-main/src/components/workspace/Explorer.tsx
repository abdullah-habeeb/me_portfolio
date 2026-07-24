import { AnimatePresence, motion } from "framer-motion";
import {
  Braces,
  Briefcase,
  ChevronRight,
  Contact as ContactIcon,
  Download,
  FileText,
  FlaskConical,
  FolderOpen,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
  TerminalSquare,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";


import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

import { SOCIAL, TABS, type TabKind } from "./tabs-data";

type TreeItem = {
  id: TabKind;
  label: string;
  accent?: string;
};

type TreeGroup = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tabId?: TabKind;
  items?: TreeItem[];
  defaultOpen?: boolean;
};

const GROUPS: TreeGroup[] = [
  { id: "about", label: "About", icon: User, tabId: "about" },
  {
    id: "projects",
    label: "Projects",
    icon: FolderOpen,
    tabId: "projects-index",
    defaultOpen: true,
    items: [
      { id: "project-renewly", label: "Renewly", accent: "var(--emerald-accent)" },
      { id: "project-ciphercare", label: "CipherCare", accent: "var(--cyan-accent)" },
    ],
  },
  {
    id: "research",
    label: "Research",
    icon: FlaskConical,
    tabId: "research-index",
    defaultOpen: true,
    items: [
      { id: "research-stackelberg", label: "Adversarial Regularization", accent: "var(--rose-accent)" },
    ],
  },
  { id: "experience", label: "Experience", icon: Briefcase, tabId: "experience" },
  { id: "skills", label: "Skills", icon: Braces, tabId: "skills" },
  { id: "resume", label: "Resume", icon: FileText, tabId: "resume" },
  { id: "contact", label: "Contact", icon: ContactIcon, tabId: "contact" },
  { id: "terminal", label: "Terminal", icon: TerminalSquare, tabId: "terminal" },
];

const EXPAND_KEY = "workspace.explorer.groups";

type Props = {
  activeTab: TabKind | null;
  onOpen: (tab: TabKind) => void;
};

export function Explorer({ activeTab, onOpen }: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const g of GROUPS) init[g.id] = !!g.defaultOpen;
    return init;
  });

  // Restore expanded state from localStorage after hydration.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(EXPAND_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, boolean>;
        setOpenGroups((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(EXPAND_KEY, JSON.stringify(openGroups));
    } catch {
      /* ignore */
    }
  }, [openGroups]);

  const toggle = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const { theme, toggle: toggleTheme } = useTheme();

  return (
    <aside className="flex h-full w-full flex-col bg-panel text-panel-foreground">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Explorer
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/70">abdullah-workspace</span>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <div className="h-px bg-border/60" />

      <nav className="flex-1 overflow-y-auto py-2">
        {GROUPS.map((group) => {
          const hasItems = !!group.items?.length;
          const open = openGroups[group.id];
          const isActive =
            (group.tabId && activeTab === group.tabId) ||
            (hasItems && group.items!.some((i) => i.id === activeTab));
          const Icon = group.icon;

          return (
            <div key={group.id} className="px-2">
              <button
                onClick={() => {
                  if (hasItems) toggle(group.id);
                  if (group.tabId) onOpen(group.tabId);
                }}
                className={cn(
                  "group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-elevated text-foreground"
                    : "text-muted-foreground hover:bg-elevated/60 hover:text-foreground",
                )}
              >
                {hasItems ? (
                  <motion.span
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-muted-foreground/70"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </motion.span>
                ) : (
                  <span className="w-3.5" />
                )}
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">{group.label}</span>
              </button>

              <AnimatePresence initial={false}>
                {hasItems && open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 border-l border-border/70 pl-2 py-0.5">
                      {group.items!.map((item) => {
                        const active = item.id === activeTab;
                        const tab = TABS[item.id];
                        return (
                          <button
                            key={item.id}
                            onClick={() => onOpen(item.id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
                              active
                                ? "bg-elevated text-foreground"
                                : "text-muted-foreground hover:bg-elevated/60 hover:text-foreground",
                            )}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: item.accent }}
                            />
                            <tab.icon className="h-3.5 w-3.5 opacity-80" />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="flex items-center justify-between gap-1">
          {[
            { icon: Github, href: SOCIAL.github, label: "GitHub" },
            { icon: Linkedin, href: SOCIAL.linkedin, label: "LinkedIn" },
            { icon: Mail, href: SOCIAL.email, label: "Email" },
          ].map(({ icon: I, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
            >
              <I className="h-4 w-4" />
            </a>
          ))}
          <a
            href="/Abdullah_Resume.pdf"
            download="Abdullah_Resume.pdf"
            className="ml-1 inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border/80 bg-elevated/60 px-2 py-1.5 text-xs text-foreground transition-colors hover:bg-elevated"
            title="Download Resume"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>
        </div>
      </div>
    </aside>
  );
}
