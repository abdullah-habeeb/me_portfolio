import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  Check,
  Copy,
  Plus,
  RefreshCw,
  Sparkles,
  Square,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { ContextKey } from "@/lib/portfolio-content";

const SUGGESTIONS_BY_CONTEXT: Partial<Record<ContextKey, string[]>> = {
  about: [
    "Give me a 30-second intro to Abdullah.",
    "What is he most interested in right now?",
    "Where does he study?",
  ],
  "projects-index": [
    "Which project is closest to production?",
    "Compare Renewly and CipherCare.",
    "Which project uses federated learning?",
    "Tell me about the pothole detection platform.",
    "Tell me about the fare calculator.",
  ],
  "project-renewly": [
    "Explain the architecture",
    "Why Gmail instead of bank-linking?",
    "Why does bank linking stay in Plaid Sandbox?",
    "What problem does this solve?",
    "What does the CI/CD pipeline do?",
    "What's the biggest limitation?",
    "Explain this to a recruiter.",
    "Explain this to a non-technical person.",
  ],
  "project-ciphercare": [
    "Why Flower for federated learning?",
    "How does fairness-weighted aggregation work?",
    "What's the differential privacy guarantee?",
    "What is domain relevance scoring?",
    "How does the blockchain audit trail work?",
    "What challenges did you face?",
    "Explain this to a recruiter.",
  ],

  "project-pothole": [
    "Explain the architecture.",
    "Why a separate FastAPI microservice?",
    "Why sample every 5th frame instead of every frame?",
    "What does the ML pipeline actually do?",
    "What challenges did you face?",
    "Explain this to a recruiter.",
  ],
  "project-fare-calculator": [
    "Why vanilla JavaScript instead of a framework?",
    "How is the fare calculated?",
    "Why the Distance Matrix API instead of straight-line distance?",
    "Explain this to a recruiter.",
  ],

  "research-index": [
    "Summarize his research.",
    "What is clean-label poisoning?",
    "What were the results?",
  ],
  "research-stackelberg": [
    "What is a Stackelberg game?",
    "Why clean-label poisoning?",
    "What is the Adversarial Regularization effect?",
    "How does the Min-Max retraining work?",
    "Why do existing anomaly filters fail here?",
    "What challenges did you face?",
    "Explain this to a recruiter.",
  ],
  experience: [
    "What did he build at Unisys?",
    "Tell me about the AWS Student Builder role.",
    "Any achievements?",
  ],
  skills: [
    "What full-stack technologies does he use?",
    "What DevOps tools does he use?",
    "What certifications does he hold?",
  ],
  resume: [
    "Summarize the resume in 3 bullets.",
    "What research is on the resume?",
    "What are his strongest skills?",
  ],
  contact: ["What is his email?", "Where is he based?"],
};

const DEFAULT_SUGGESTIONS = [
  "Give me a 30-second intro.",
  "What has he built?",
  "Summarize his research.",
  "What technologies does he use?",
];

const QUICK_ACTIONS: { label: string; prompt: string }[] = [
  { label: "Explain to a recruiter", prompt: "Explain this to a recruiter." },
  { label: "ELI5", prompt: "Explain this like I'm five." },
  { label: "Summarize in 3 bullets", prompt: "Summarize this in 3 bullets." },
];

function messageText(m: UIMessage) {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

type ContextMeta = { label: string; dot: string; icon: string };

type Props = {
  context: ContextKey | null;
  meta: ContextMeta | null;
  onClearContext: () => void;
};

export function AIPanel({ context, meta, onClearContext }: Props) {
  const [chatId, setChatId] = useState(() => `chat-${Date.now()}`);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/chat` : "/api/chat";

  const { messages, sendMessage, status, setMessages, stop, regenerate } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: apiUrl,
      body: () => ({ context }),
    }),
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatId]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    void sendMessage({ text: value });
    if (inputRef.current) inputRef.current.value = "";
  };

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  const suggestions = useMemo(() => {
    if (context && SUGGESTIONS_BY_CONTEXT[context]) return SUGGESTIONS_BY_CONTEXT[context]!;
    return DEFAULT_SUGGESTIONS;
  }, [context]);

  const newChat = () => {
    stop();
    setChatId(`chat-${Date.now()}`);
    setMessages([]);
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1500);
    } catch {
      /* ignore */
    }
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <aside className="flex h-full w-full flex-col bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-elevated">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </span>
          <div>
            <div className="text-sm font-semibold text-foreground">Ask Abdullah</div>
            <div className="text-[11px] text-muted-foreground">
              Grounded in his portfolio
            </div>
          </div>
        </div>
        <button
          onClick={newChat}
          className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-elevated/60 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
          title="New chat"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      {/* Context badge */}
      <div className="border-b border-border/60 px-4 py-2">
        <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Current context
        </div>
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-elevated/60 px-2 py-0.5 text-[11px] text-foreground"
          >
            {meta ? (
              <>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: meta.dot }}
                />
                <span>{meta.label}</span>
                <button
                  onClick={onClearContext}
                  className="ml-0.5 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Clear context"
                  title="Answer from entire portfolio"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                <span>Entire Portfolio</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4">
        {isEmpty ? (
          <div className="space-y-2">
            <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Try asking
            </div>
            {suggestions.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => send(s)}
                className="w-full rounded-lg border border-border/70 bg-card/60 px-3 py-2 text-left text-sm text-foreground/90 transition-colors hover:border-border hover:bg-elevated"
              >
                {s}
              </motion.button>
            ))}
            <div className="pt-2 text-[10px] text-muted-foreground/70">
              Or type any question below.
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const text = messageText(m);
                const isAssistant = m.role === "assistant";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex gap-3"
                  >
                    <div className="mt-0.5">
                      {isAssistant ? (
                        <span
                          className="grid h-6 w-6 place-items-center rounded-md"
                          style={{
                            background:
                              "color-mix(in oklab, var(--cyan-accent) 15%, transparent)",
                          }}
                        >
                          <Bot className="h-3 w-3 text-primary" />
                        </span>
                      ) : (
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-elevated text-muted-foreground">
                          <User className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {isAssistant ? "Assistant" : "You"}
                        </div>
                        {isAssistant && text.length > 0 && (
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => copy(m.id, text)}
                              className="rounded p-1 text-muted-foreground hover:bg-elevated hover:text-foreground"
                              aria-label="Copy"
                              title="Copy"
                            >
                              {copiedId === m.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            {m.id === lastAssistantId && !isBusy && (
                              <button
                                onClick={() => regenerate()}
                                className="rounded p-1 text-muted-foreground hover:bg-elevated hover:text-foreground"
                                aria-label="Regenerate"
                                title="Regenerate"
                              >
                                <RefreshCw className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {isAssistant ? (
                        <div className="prose prose-sm prose-invert max-w-none text-foreground/90 prose-p:my-2 prose-li:my-0.5 prose-pre:bg-elevated prose-code:text-primary">
                          <ReactMarkdown>{text}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm text-foreground/90">
                          {text}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  Thinking…
                </motion.span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border/60 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((qa) => (
            <button
              key={qa.label}
              type="button"
              onClick={() => send(qa.prompt)}
              className="rounded-full border border-border/70 bg-elevated/50 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:bg-elevated hover:text-foreground"
            >
              {qa.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = inputRef.current?.value ?? "";
            send(v);
          }}
          className="relative"
        >
          <textarea
            ref={inputRef}
            rows={2}
            placeholder={
              meta
                ? `Ask about ${meta.label}…`
                : "Ask about a project, research, or experience…"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e.currentTarget.value);
              }
            }}
            className="w-full resize-none rounded-lg border border-border/80 bg-elevated/60 px-3 py-2 pr-11 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          {isBusy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-md bg-elevated text-foreground transition-colors hover:bg-accent"
              aria-label="Stop"
              title="Stop generating"
            >
              <Square className="h-3 w-3" />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              aria-label="Send"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/70">
          <span>Enter to send · Shift + Enter for newline</span>
          <span>Grounded in portfolio</span>
        </div>
      </div>
    </aside>
  );
}
