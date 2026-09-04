import { useState } from "react";
import { Trash2 } from "lucide-react";

import type { AchievementItem, ExperienceContent, ExperienceItem } from "@/data/types";
import { useAdminMutate } from "@/lib/useContent";

import { AddButton, ColorField, Field, SaveBar, TextArea, TextInput, ToastStack, useDraft, useToasts } from "./ui";
import { Card as WorkspaceCard } from "../workspace/ui";

export function ExperienceEditor({ experience }: { experience: ExperienceContent }) {
  const [draft, setDraft, dirty, discard] = useDraft(experience);
  const [saving, setSaving] = useState(false);
  const mutate = useAdminMutate();
  const { toasts, pushSuccess, pushError } = useToasts();

  const save = async () => {
    setSaving(true);
    try {
      await mutate({ action: "updateSingleton", section: "experience", data: draft });
      pushSuccess("Experience updated.");
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const addRole = () =>
    setDraft((d) => ({
      ...d,
      roles: [...d.roles, { id: `role-new-${Date.now()}`, role: "", org: "", period: "", accent: "var(--cyan-accent)", details: "" }],
    }));
  const updateRole = (i: number, patch: Partial<ExperienceItem>) =>
    setDraft((d) => ({ ...d, roles: d.roles.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }));
  const removeRole = (i: number) => setDraft((d) => ({ ...d, roles: d.roles.filter((_, idx) => idx !== i) }));

  const addAchievement = () =>
    setDraft((d) => ({ ...d, achievements: [...d.achievements, { id: `achievement-new-${Date.now()}`, text: "", link: "" }] }));
  const updateAchievement = (i: number, patch: Partial<AchievementItem>) =>
    setDraft((d) => ({ ...d, achievements: d.achievements.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) }));
  const removeAchievement = (i: number) => setDraft((d) => ({ ...d, achievements: d.achievements.filter((_, idx) => idx !== i) }));

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <ToastStack toasts={toasts} />
      <h2 className="mb-6 text-xl font-semibold text-foreground">Experience & Leadership</h2>

      <div className="space-y-6">
        <Field label="Roles">
          <div className="space-y-3">
            {draft.roles.map((r, i) => (
              <WorkspaceCard key={r.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextInput value={r.role} onChange={(e) => updateRole(i, { role: e.target.value })} placeholder="Role" />
                      <TextInput value={r.org} onChange={(e) => updateRole(i, { org: e.target.value })} placeholder="Organization" />
                    </div>
                    <TextInput value={r.period} onChange={(e) => updateRole(i, { period: e.target.value })} placeholder="Period, e.g. Dec 2025 – May 2026" />
                    <TextArea rows={3} value={r.details} onChange={(e) => updateRole(i, { details: e.target.value })} placeholder="Details" />
                    <ColorField value={r.accent} onChange={(v) => updateRole(i, { accent: v })} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRole(i)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-elevated hover:text-[var(--rose-accent)]"
                    aria-label="Remove role"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </WorkspaceCard>
            ))}
            <AddButton label="Add role" onClick={addRole} />
          </div>
        </Field>

        <Field label="Achievements">
          <div className="space-y-2">
            {draft.achievements.length > 0 && (
              <div className="flex items-center gap-2 px-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <span className="flex-1">Achievement</span>
                <span style={{ width: 160 }} className="shrink-0">
                  Link (optional)
                </span>
                <span style={{ width: 32 }} className="shrink-0" />
              </div>
            )}
            {draft.achievements.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <TextInput value={a.text} onChange={(e) => updateAchievement(i, { text: e.target.value })} placeholder="e.g. SAP Backend Developer (CAP) — 2026" />
                </div>
                <div style={{ width: 160 }} className="shrink-0">
                  <TextInput value={a.link ?? ""} onChange={(e) => updateAchievement(i, { link: e.target.value })} placeholder="https://…" />
                </div>
                <button
                  type="button"
                  onClick={() => removeAchievement(i)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-elevated hover:text-[var(--rose-accent)]"
                  aria-label="Remove achievement"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <AddButton label="Add achievement" onClick={addAchievement} />
          </div>
        </Field>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
