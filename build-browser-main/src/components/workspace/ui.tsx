import { motion } from "framer-motion";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Chip({
  children,
  accent = "var(--cyan-accent)",
}: {
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium text-foreground/90"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 25%, transparent)`,
        background: `color-mix(in oklab, ${accent} 8%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StatusBadge({
  status,
}: {
  status: "active" | "research-complete" | "beta";
}) {
  const map = {
    active: { label: "Active Development", color: "var(--emerald-accent)", dot: true },
    "research-complete": {
      label: "Research Complete",
      color: "var(--cyan-accent)",
      dot: false,
    },
    beta: { label: "Beta", color: "var(--amber-accent)", dot: true },
  } as const;
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{
        borderColor: `color-mix(in oklab, ${s.color} 35%, transparent)`,
        background: `color-mix(in oklab, ${s.color} 10%, transparent)`,
        color: s.color,
      }}
    >
      {s.dot && (
        <span
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: s.color }}
        />
      )}
      {s.label}
    </span>
  );
}
