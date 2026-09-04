import { useEffect, useMemo, useRef, useState } from "react";

import type { MergedContent, Section } from "@/data/types";
import { buildDocMap } from "@/lib/portfolio-content";
import { useInvalidateContent } from "@/lib/useContent";

import { resolveTabDef } from "../content-resolve";
import { type TabKind } from "../tabs-data";

type Line = { kind: "input" | "output" | "error"; text: string };

const PROMPT = "abdullah@workspace";

const OPEN_ALIASES: Record<string, TabKind> = {
  about: "about",
  projects: "projects-index",
  research: "research-index",
  experience: "experience",
  skills: "skills",
  resume: "resume",
  contact: "contact",
  terminal: "terminal",
};

const WELCOME: Line[] = [
  { kind: "output", text: "abdullah-workspace v1.0.0 — type 'help' to see available commands." },
];

function helpText(isAdmin: boolean): string {
  const base = [
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
    "  admin              sign in to add or edit content",
  ];
  if (isAdmin) {
    base.push(
      "",
      "Admin commands:",
      "  add <project|research|certification|course>     add a new item",
      "  edit <section> <id>                              edit an existing item",
      "  delete <section> <id>                             delete an item",
      "  list <section>                                    list ids in a section",
      "  logout                                            end the admin session",
    );
  }
  return base.join("\n");
}

// --- Admin field wizard -----------------------------------------------------

type FieldKind = "text" | "list" | "bool";
type FieldSpec = { key: string; label: string; required: boolean; kind: FieldKind };

const PROJECT_FIELDS: FieldSpec[] = [
  { key: "name", label: "Name", required: true, kind: "text" },
  { key: "summary", label: "Summary (one line)", required: true, kind: "text" },
  { key: "problem", label: "Problem it solves", required: true, kind: "text" },
  { key: "solution", label: "Solution (more detail)", required: false, kind: "text" },
  { key: "architecture", label: "Architecture (one paragraph)", required: true, kind: "text" },
  { key: "stack", label: "Tech stack (comma-separated)", required: true, kind: "list" },
  { key: "links.github", label: "GitHub URL", required: false, kind: "text" },
  { key: "links.demo", label: "Live demo URL", required: false, kind: "text" },
  { key: "featured", label: "Featured? (y/n)", required: false, kind: "bool" },
];

const RESEARCH_FIELDS: FieldSpec[] = [
  { key: "name", label: "Name", required: true, kind: "text" },
  { key: "summary", label: "Summary (one line)", required: true, kind: "text" },
  { key: "role", label: "Role / publication line", required: true, kind: "text" },
  { key: "status", label: 'Status badge (e.g. "Under Review")', required: true, kind: "text" },
  { key: "problem", label: "Problem", required: true, kind: "text" },
  { key: "work", label: "Your work", required: true, kind: "text" },
  { key: "stack", label: "Tech stack (comma-separated)", required: true, kind: "list" },
  { key: "links.github", label: "GitHub URL", required: false, kind: "text" },
  { key: "links.report", label: "Paper/report URL", required: false, kind: "text" },
];

const CREDENTIAL_FIELDS: FieldSpec[] = [
  { key: "name", label: "Name", required: true, kind: "text" },
  { key: "issuer", label: 'Issuer (e.g. "Cisco Networking Academy · 2025")', required: true, kind: "text" },
];

function fieldsFor(section: Section): FieldSpec[] {
  if (section === "projects") return PROJECT_FIELDS;
  if (section === "research") return RESEARCH_FIELDS;
  return CREDENTIAL_FIELDS;
}

const SECTION_ALIASES: Record<string, Section> = {
  project: "projects",
  projects: "projects",
  research: "research",
  certification: "certifications",
  certifications: "certifications",
  cert: "certifications",
  certs: "certifications",
  course: "courses",
  courses: "courses",
};

const SECTION_LABEL: Record<Section, string> = {
  projects: "project",
  research: "research entry",
  certifications: "certification",
  courses: "course",
  skillGroups: "skill group",
};

type WizardOp = "create" | "update" | "delete";
type WizardState = {
  section: Section;
  op: WizardOp;
  fields: FieldSpec[];
  stepIndex: number;
  values: Record<string, string>;
  targetId?: string;
};

function getExistingValue(content: MergedContent, section: Section, id: string, key: string): unknown {
  const list = content[section] as { id: string }[];
  const item = list.find((x) => x.id === id) as Record<string, unknown> | undefined;
  if (!item) return undefined;
  if (key.startsWith("links.")) {
    const linkKey = key.slice("links.".length);
    return (item.links as Record<string, unknown> | undefined)?.[linkKey];
  }
  return item[key];
}

function buildPayload(fields: FieldSpec[], values: Record<string, string>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const links: Record<string, string> = {};
  for (const f of fields) {
    const raw = values[f.key];
    if (raw === undefined || raw === "") continue;
    if (f.key.startsWith("links.")) {
      links[f.key.slice("links.".length)] = raw;
      continue;
    }
    if (f.kind === "list") payload[f.key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
    else if (f.kind === "bool") payload[f.key] = /^y(es)?$/i.test(raw);
    else payload[f.key] = raw;
  }
  if (Object.keys(links).length) payload.links = links;
  return payload;
}

export function TerminalSection({ onOpen, content }: { onOpen: (t: TabKind) => void; content: MergedContent }) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [awaitingPassword, setAwaitingPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [wizard, setWizard] = useState<WizardState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const invalidateContent = useInvalidateContent();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { authenticated?: boolean }) => {
        if (data.authenticated) setIsAdmin(true);
      })
      .catch(() => {
        /* not logged in — fine */
      });
  }, []);

  const docMap = useMemo(() => buildDocMap(content), [content]);
  const files = useMemo(() => {
    const map: Record<string, string> = {
      "about.md": "about",
      "projects.md": "projects-index",
      "research.md": "research-index",
      "experience.md": "experience",
      "skills.md": "skills",
      "resume.md": "resume",
      "contact.md": "contact",
    };
    for (const p of content.projects) map[resolveTabDef(p.id, content).filename] = p.id;
    for (const r of content.research) map[resolveTabDef(r.id, content).filename] = r.id;
    return map;
  }, [content]);

  const push = (...newLines: Line[]) => setLines((prev) => [...prev, ...newLines]);

  const promptField = (field: FieldSpec, w: WizardState) => {
    let suffix = "";
    if (w.op === "update" && w.targetId) {
      const cur = getExistingValue(content, w.section, w.targetId, field.key);
      if (cur !== undefined && cur !== "") {
        suffix = ` [current: ${Array.isArray(cur) ? cur.join(", ") : String(cur)}] (Enter to keep)`;
      } else {
        suffix = " (Enter to leave blank)";
      }
    } else if (!field.required) {
      suffix = " (optional, Enter to skip)";
    }
    push({ kind: "output", text: `? ${field.label}${suffix}` });
  };

  const startFieldWizard = (section: Section, op: "create" | "update", targetId?: string) => {
    const fields = fieldsFor(section);
    const w: WizardState = { section, op, fields, stepIndex: 0, values: {}, targetId };
    setWizard(w);
    push({
      kind: "output",
      text: `${op === "create" ? "Adding a new" : "Editing"} ${SECTION_LABEL[section]}${op === "update" ? ` (${targetId})` : ""}. Type 'cancel' at any prompt to abort.`,
    });
    promptField(fields[0], w);
  };

  const startDeleteConfirm = (section: Section, id: string) => {
    const w: WizardState = {
      section,
      op: "delete",
      fields: [{ key: "confirm", label: "", required: true, kind: "text" }],
      stepIndex: 0,
      values: {},
      targetId: id,
    };
    setWizard(w);
    push({ kind: "output", text: `? Type 'yes' to permanently delete ${id} from ${section} (anything else cancels)` });
  };

  const submitWizard = async (w: WizardState) => {
    setWizard(null);

    if (w.op === "delete") {
      if (w.values.confirm?.trim().toLowerCase() !== "yes") {
        push({ kind: "output", text: "Cancelled." });
        return;
      }
    }

    push({ kind: "output", text: "Saving…" });
    const body =
      w.op === "delete"
        ? { action: "delete", section: w.section, id: w.targetId }
        : w.op === "create"
          ? { action: "create", section: w.section, data: buildPayload(w.fields, w.values) }
          : { action: "update", section: w.section, id: w.targetId, data: buildPayload(w.fields, w.values) };

    try {
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        push({ kind: "error", text: `Failed: ${json.error ?? res.statusText}` });
        return;
      }
      invalidateContent();
      const verb = w.op === "create" ? "Added" : w.op === "update" ? "Updated" : "Deleted";
      push({ kind: "output", text: `✓ ${verb} successfully.` });
    } catch (err) {
      push({ kind: "error", text: `Network error: ${err instanceof Error ? err.message : String(err)}` });
    }
  };

  const handleWizardStep = (raw: string) => {
    if (!wizard) return;
    if (raw.trim().toLowerCase() === "cancel") {
      push({ kind: "error", text: "Cancelled." });
      setWizard(null);
      return;
    }
    const field = wizard.fields[wizard.stepIndex];
    const value = raw.trim();
    if (field.required && value === "" && wizard.op === "create") {
      push({ kind: "error", text: `${field.label} is required.` });
      promptField(field, wizard);
      return;
    }
    const nextValues = { ...wizard.values, [field.key]: value };
    const nextIndex = wizard.stepIndex + 1;
    if (nextIndex < wizard.fields.length) {
      const nextWizard = { ...wizard, values: nextValues, stepIndex: nextIndex };
      setWizard(nextWizard);
      promptField(wizard.fields[nextIndex], nextWizard);
    } else {
      void submitWizard({ ...wizard, values: nextValues });
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setAwaitingPassword(false);
    if (!password) {
      push({ kind: "error", text: "Cancelled." });
      return;
    }
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        push({ kind: "error", text: json.error ?? "Access denied." });
        return;
      }
      setIsAdmin(true);
      push({ kind: "output", text: "Access granted. Type 'help' for admin commands." });
    } catch (err) {
      push({ kind: "error", text: `Network error: ${err instanceof Error ? err.message : String(err)}` });
    }
  };

  const run = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        push({ kind: "output", text: helpText(isAdmin) });
        break;
      case "whoami":
        push({ kind: "output", text: "abdullah — full-stack engineer, Bengaluru, India" });
        break;
      case "ls":
        push({ kind: "output", text: Object.keys(files).join("  ") });
        break;
      case "cat": {
        if (!arg) {
          push({ kind: "error", text: "usage: cat <file>" });
          break;
        }
        const id = files[arg.toLowerCase()];
        const doc = id ? docMap[id] : undefined;
        if (!doc) {
          push({ kind: "error", text: `cat: ${arg}: No such file` });
          break;
        }
        push({ kind: "output", text: doc.body });
        break;
      }
      case "open": {
        if (!arg) {
          push({ kind: "error", text: "usage: open <tab>" });
          break;
        }
        const key = arg.toLowerCase();
        const tabId =
          OPEN_ALIASES[key] ??
          content.projects.find((p) => p.id === `project-${key}` || p.name.toLowerCase() === key)?.id ??
          content.research.find((r) => r.id === `research-${key}` || r.name.toLowerCase() === key)?.id;
        if (!tabId) {
          push({ kind: "error", text: `open: ${arg}: no such tab. Try 'ls' for a list.` });
          break;
        }
        push({ kind: "output", text: `Opening ${resolveTabDef(tabId, content).label}…` });
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
            `Email: ${content.contact.email}`,
            `Phone: ${content.contact.phone}`,
            `LinkedIn: ${content.contact.linkedin}`,
            `GitHub: ${content.contact.github}`,
          ].join("\n"),
        });
        break;
      case "links":
        push({
          kind: "output",
          text: [content.contact.github, content.contact.linkedin, content.contact.leetcode].join("\n"),
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
      case "admin": {
        if (isAdmin) {
          push({ kind: "output", text: "Already signed in. Type 'help' for admin commands." });
          break;
        }
        setAwaitingPassword(true);
        push({ kind: "output", text: "Password:" });
        break;
      }
      case "logout": {
        if (!isAdmin) {
          push({ kind: "error", text: "Not signed in." });
          break;
        }
        void fetch("/api/admin/logout", { method: "POST" }).finally(() => {
          setIsAdmin(false);
          push({ kind: "output", text: "Signed out." });
        });
        break;
      }
      case "add": {
        if (!isAdmin) {
          push({ kind: "error", text: "admin access required — type 'admin' first." });
          break;
        }
        const section = SECTION_ALIASES[arg.toLowerCase()];
        if (!section) {
          push({ kind: "error", text: "usage: add <project|research|certification|course>" });
          break;
        }
        startFieldWizard(section, "create");
        break;
      }
      case "edit": {
        if (!isAdmin) {
          push({ kind: "error", text: "admin access required — type 'admin' first." });
          break;
        }
        const [sectionArg, idArg] = rest;
        const section = sectionArg ? SECTION_ALIASES[sectionArg.toLowerCase()] : undefined;
        if (!section || !idArg) {
          push({ kind: "error", text: "usage: edit <section> <id> — try 'list <section>' for ids" });
          break;
        }
        if (!(content[section] as { id: string }[]).some((x) => x.id === idArg)) {
          push({ kind: "error", text: `No such item: ${idArg} in ${section}` });
          break;
        }
        startFieldWizard(section, "update", idArg);
        break;
      }
      case "delete": {
        if (!isAdmin) {
          push({ kind: "error", text: "admin access required — type 'admin' first." });
          break;
        }
        const [sectionArg, idArg] = rest;
        const section = sectionArg ? SECTION_ALIASES[sectionArg.toLowerCase()] : undefined;
        if (!section || !idArg) {
          push({ kind: "error", text: "usage: delete <section> <id> — try 'list <section>' for ids" });
          break;
        }
        if (!(content[section] as { id: string }[]).some((x) => x.id === idArg)) {
          push({ kind: "error", text: `No such item: ${idArg} in ${section}` });
          break;
        }
        startDeleteConfirm(section, idArg);
        break;
      }
      case "list": {
        if (!isAdmin) {
          push({ kind: "error", text: "admin access required — type 'admin' first." });
          break;
        }
        const section = SECTION_ALIASES[arg.toLowerCase()];
        if (!section) {
          push({ kind: "error", text: "usage: list <projects|research|certifications|courses>" });
          break;
        }
        const items = content[section] as { id: string; name: string }[];
        push({
          kind: "output",
          text: items.length ? items.map((it) => `${it.id}  —  ${it.name}`).join("\n") : "(empty)",
        });
        break;
      }
      default:
        push({ kind: "error", text: `command not found: ${cmd} — type 'help' for a list.` });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (awaitingPassword) {
      push({ kind: "input", text: "•".repeat(input.length) });
      void handlePasswordSubmit(input);
      setInput("");
      return;
    }

    if (wizard) {
      push({ kind: "input", text: input });
      handleWizardStep(input);
      setInput("");
      return;
    }

    if (input.trim()) setHistory((h) => [...h, input]);
    setHistoryIdx(null);
    push({ kind: "input", text: input.trim() });
    run(input);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (awaitingPassword || wizard) return;
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
            type={awaitingPassword ? "password" : "text"}
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
        {isAdmin ? "Admin session active · type 'help' for commands" : "Type 'help' for commands · ↑↓ for history"}
      </div>
    </div>
  );
}
