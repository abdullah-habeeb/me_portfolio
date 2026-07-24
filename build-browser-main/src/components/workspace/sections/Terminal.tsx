import { useEffect, useRef, useState } from "react";

import { PORTFOLIO_DOCS, type ContextKey } from "@/lib/portfolio-content";

import { SOCIAL, TABS, type TabKind } from "../tabs-data";

type Line = { kind: "input" | "output" | "error"; text: string };

const PROMPT = "abdullah@workspace";

const FILES: Record<string, ContextKey> = {
  "about.md": "about",
  "projects.md": "projects-index",
  "renewly.md": "project-renewly",
  "ciphercare.md": "project-ciphercare",
  "research.md": "research-index",
  "stackelberg.md": "research-stackelberg",
  "experience.md": "experience",
  "skills.md": "skills",
  "resume.md": "resume",
  "contact.md": "contact",
};

const OPEN_ALIASES: Record<string, TabKind> = {
  about: "about",
  projects: "projects-index",
  renewly: "project-renewly",
  ciphercare: "project-ciphercare",
  research: "research-index",
  stackelberg: "research-stackelberg",
  experience: "experience",
  skills: "skills",
  resume: "resume",
  contact: "contact",
  terminal: "terminal",
};

const WELCOME: Line[] = [
  { kind: "output", text: "abdullah-workspace v1.0.0 — type 'help' to see available commands." },
];

function helpText(): string {
  return [
    "Available commands:",
    "  help               show this message",
    "  whoami             who am I",
    "  ls                 list workspace files",
    "  cat <file>         print a file's contents",
    "  open <tab>         jump to a tab (e.g. open renewly)",
    "  resume             open the resume",
    "  contact            print contact info",
    "  links              print social links",
    "  date               print current date/time",
    "  echo <text>        print text back",
    "  clear              clear the terminal",
  ].join("\n");
}

export function TerminalSection({ onOpen }: { onOpen: (t: TabKind) => void }) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const push = (...newLines: Line[]) => setLines((prev) => [...prev, ...newLines]);

  const run = (raw: string) => {
    const trimmed = raw.trim();
    push({ kind: "input", text: trimmed });
    if (!trimmed) return;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        push({ kind: "output", text: helpText() });
        break;
      case "whoami":
        push({ kind: "output", text: "abdullah — full-stack engineer, Bengaluru, India" });
        break;
      case "ls":
        push({ kind: "output", text: Object.keys(FILES).join("  ") });
        break;
      case "cat": {
        if (!arg) {
          push({ kind: "error", text: "usage: cat <file>" });
          break;
        }
        const key = FILES[arg.toLowerCase()];
        if (!key) {
          push({ kind: "error", text: `cat: ${arg}: No such file` });
          break;
        }
        push({ kind: "output", text: PORTFOLIO_DOCS[key].body });
        break;
      }
      case "open": {
        if (!arg) {
          push({ kind: "error", text: "usage: open <tab>" });
          break;
        }
        const tabId = OPEN_ALIASES[arg.toLowerCase()];
        if (!tabId) {
          push({ kind: "error", text: `open: ${arg}: no such tab. Try 'ls' for a list.` });
          break;
        }
        push({ kind: "output", text: `Opening ${TABS[tabId].label}…` });
        onOpen(tabId);
        break;
      }
      case "resume":
        push({ kind: "output", text: "Opening Resume…" });
        onOpen("resume");
        break;
      case "contact":
        push({
          kind: "output",
          text: [
            `Email: ${SOCIAL.email.replace("mailto:", "")}`,
            `Phone: ${SOCIAL.phone}`,
            `LinkedIn: ${SOCIAL.linkedin}`,
            `GitHub: ${SOCIAL.github}`,
          ].join("\n"),
        });
        break;
      case "links":
        push({
          kind: "output",
          text: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.leetcode].join("\n"),
        });
        break;
      case "date":
        push({ kind: "output", text: new Date().toString() });
        break;
      case "echo":
        push({ kind: "output", text: arg });
        break;
      case "sudo":
        push({ kind: "error", text: "Permission denied — nice try. This shell doesn't have root." });
        break;
      case "clear":
        setLines([]);
        break;
      default:
        push({ kind: "error", text: `command not found: ${cmd} — type 'help' for a list.` });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setHistory((h) => [...h, input]);
    }
    setHistoryIdx(null);
    run(input);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === null ? history.length - 1 : Math.max(historyIdx - 1, 0);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= history.length) {
        setHistoryIdx(null);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    }
  };

  return (
    <div
      className="flex h-full flex-col bg-background font-mono text-[13px]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {lines.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap leading-relaxed">
            {line.kind === "input" ? (
              <span>
                <span className="text-primary">{PROMPT}</span>
                <span className="text-muted-foreground">:~$ </span>
                <span className="text-foreground">{line.text}</span>
              </span>
            ) : (
              <span className={line.kind === "error" ? "text-[var(--rose-accent)]" : "text-foreground/85"}>
                {line.text}
              </span>
            )}
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex items-center gap-0">
          <span className="text-primary">{PROMPT}</span>
          <span className="text-muted-foreground">:~$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-foreground outline-none"
          />
        </form>
      </div>
      <div className="border-t border-border/60 px-5 py-2 text-[11px] text-muted-foreground/70">
        Type 'help' for commands · ↑↓ for history
      </div>
    </div>
  );
}
