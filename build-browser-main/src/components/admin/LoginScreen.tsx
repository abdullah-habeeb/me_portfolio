import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useState } from "react";

import { adminLogin } from "@/lib/useContent";

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-2xl border border-border/70 bg-panel p-8 shadow-2xl shadow-black/20"
      >
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl bg-elevated">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-center text-lg font-semibold text-foreground">Portfolio CMS</h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">Sign in to edit your portfolio.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-md border border-border/80 bg-elevated/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
        />
        {error && <p className="mt-2 text-xs text-[var(--rose-accent)]">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </motion.form>
    </div>
  );
}
