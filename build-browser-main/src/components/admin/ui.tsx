import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ACCENT_PALETTE } from "@/data/types";

// JSON.stringify is key-order-sensitive, and the server reconstructs
// objects (zod parsing, spreads) with different key order than the client's
// draft even when they're semantically identical — a naive stringify
// comparison would then report "dirty" forever after a perfectly successful
// save. Sort keys recursively before comparing.
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return Object.keys(v)
        .sort()
        .reduce((acc: Record<string, unknown>, k) => {
          acc[k] = (v as Record<string, unknown>)[k];
          return acc;
        }, {});
    }
    return v;
  });
}

// Local-draft + dirty-tracking for a singleton form (About/Experience/
// Contact): edits live in `draft` until Save; the draft resets to match
// `source` whenever the underlying content changes (e.g. right after a
// successful save re-fetches it), which is also what clears `dirty`.
export function useDraft<T>(source: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean, () => void] {
  const [draft, setDraft] = useState(source);
  const [baseline, setBaseline] = useState(source);
  const sourceKey = canonicalJson(source);
  useEffect(() => {
    setDraft(source);
    setBaseline(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);
  const dirty = canonicalJson(draft) !== canonicalJson(baseline);
  const discard = () => setDraft(baseline);
  return [draft, setDraft, dirty, discard];
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-foreground/90">
        {label}
        {required && <span className="text-[var(--rose-accent)]">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-border/80 bg-elevated/60 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${inputClass} resize-y leading-relaxed ${props.className ?? ""}`} />;
}

export function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim();
    if (v) onChange([...value, v]);
    setDraft("");
  };

  return (
    <div className={`${inputClass} flex flex-wrap items-center gap-1.5 py-1.5`}>
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2 py-0.5 text-xs text-foreground/90"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length ? "" : placeholder}
        className="min-w-[8ch] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

export function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      {ACCENT_PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-label={c}
          className="grid h-7 w-7 place-items-center rounded-full border-2 transition-transform hover:scale-110"
          style={{ background: c, borderColor: value === c ? "var(--foreground)" : "transparent" }}
        >
          {value === c && <Check className="h-3.5 w-3.5 text-background" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}

const TOGGLE_TRACK_WIDTH = 36;
const TOGGLE_TRACK_HEIGHT = 20;
const TOGGLE_THUMB_SIZE = 16;
const TOGGLE_INSET = 2;

export function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-sm text-foreground/90"
    >
      {/* Fully inline-sized/positioned (not Tailwind width/transform utilities)
          so there's no risk of a base class elsewhere winning the cascade and
          silently resizing the track or moving the thumb out of bounds. */}
      <span
        className="relative shrink-0 rounded-full transition-colors"
        style={{
          width: TOGGLE_TRACK_WIDTH,
          height: TOGGLE_TRACK_HEIGHT,
          background: checked ? "var(--primary)" : "var(--elevated)",
          border: checked ? "none" : "1px solid var(--border)",
          boxSizing: "border-box",
        }}
      >
        <span
          className="absolute rounded-full bg-white shadow transition-transform"
          style={{
            width: TOGGLE_THUMB_SIZE,
            height: TOGGLE_THUMB_SIZE,
            top: TOGGLE_INSET,
            left: TOGGLE_INSET,
            transform: checked ? `translateX(${TOGGLE_TRACK_WIDTH - TOGGLE_THUMB_SIZE - TOGGLE_INSET * 2}px)` : "translateX(0)",
          }}
        />
      </span>
      {label}
    </button>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "border border-border/80 bg-elevated text-foreground hover:bg-accent",
    danger: "border border-[var(--rose-accent)]/40 bg-[var(--rose-accent)]/10 text-[var(--rose-accent)] hover:bg-[var(--rose-accent)]/20",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-elevated/60",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
    />
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border/80 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
    >
      <Plus className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

type ToastState = { id: number; kind: "success" | "error"; text: string };
let toastId = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const push = (kind: ToastState["kind"], text: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };
  return { toasts, pushSuccess: (t: string) => push("success", t), pushError: (t: string) => push("error", t) };
}

export function ToastStack({ toasts }: { toasts: ToastState[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`rounded-md border px-4 py-2.5 text-sm shadow-lg backdrop-blur-sm ${
              t.kind === "success"
                ? "border-[var(--emerald-accent)]/40 bg-[var(--emerald-accent)]/15 text-foreground"
                : "border-[var(--rose-accent)]/40 bg-[var(--rose-accent)]/15 text-foreground"
            }`}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="sticky bottom-0 z-10 -mx-8 mt-8 flex items-center justify-between gap-3 border-t border-border/60 bg-panel/95 px-8 py-3 backdrop-blur-sm"
        >
          <span className="text-xs text-muted-foreground">You have unsaved changes.</span>
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={onDiscard} disabled={saving}>
              Discard
            </Button>
            <Button type="button" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-[150] bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed left-1/2 top-1/2 z-[151] w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/70 bg-panel p-5 shadow-2xl"
          >
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
