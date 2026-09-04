import { useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";

import type { AboutContent, HighlightItem, StatItem } from "@/data/types";
import { useAdminMutate, useAdminUpload } from "@/lib/useContent";

import { AddButton, Button, ColorField, Field, SaveBar, TagsInput, TextArea, TextInput, ToggleField, ToastStack, useDraft, useToasts } from "./ui";
import { Card as WorkspaceCard } from "../workspace/ui";

export function AboutEditor({ about }: { about: AboutContent }) {
  const [draft, setDraft, dirty, discard] = useDraft(about);
  const [saving, setSaving] = useState(false);
  const mutate = useAdminMutate();
  const upload = useAdminUpload();
  const { toasts, pushSuccess, pushError } = useToasts();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoBust, setPhotoBust] = useState(0);

  const save = async () => {
    setSaving(true);
    try {
      await mutate({ action: "updateSingleton", section: "about", data: draft });
      pushSuccess("About page updated.");
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const onPickPhoto = async (file: File) => {
    try {
      await upload("photo", file);
      setPhotoBust(Date.now());
      pushSuccess("Photo replaced.");
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const addStat = () => setDraft((d) => ({ ...d, stats: [...d.stats, { label: "", value: "" }] }));
  const updateStat = (i: number, patch: Partial<StatItem>) =>
    setDraft((d) => ({ ...d, stats: d.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
  const removeStat = (i: number) => setDraft((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));

  const addHighlight = () =>
    setDraft((d) => ({
      ...d,
      highlights: [...d.highlights, { id: `highlight-new-${Date.now()}`, title: "", detail: "", accent: "var(--cyan-accent)" }],
    }));
  const updateHighlight = (i: number, patch: Partial<HighlightItem>) =>
    setDraft((d) => ({ ...d, highlights: d.highlights.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) }));
  const removeHighlight = (i: number) => setDraft((d) => ({ ...d, highlights: d.highlights.filter((_, idx) => idx !== i) }));

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <ToastStack toasts={toasts} />
      <h2 className="mb-6 text-xl font-semibold text-foreground">About</h2>

      <div className="space-y-6">
        <Field label="Bio" required>
          <TextArea rows={5} value={draft.bio} onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))} />
        </Field>

        <Field label="Photo">
          <div className="flex items-center gap-4">
            <img
              src={`${draft.photo}${photoBust ? `${draft.photo.includes("?") ? "&" : "?"}t=${photoBust}` : ""}`}
              alt="Current"
              className="h-16 w-16 rounded-xl border border-border/70 object-cover"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onPickPhoto(f);
                e.target.value = "";
              }}
            />
            <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Replace photo
            </Button>
          </div>
        </Field>

        <Field label="Quick stats" hint="The row of metric tiles near the top of the About page — e.g. Label 'CGPA', Value '9.00'.">
          <div className="space-y-2">
            {draft.stats.length > 0 && (
              <div className="flex items-center gap-2 px-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <span style={{ width: 160 }} className="shrink-0">
                  Label
                </span>
                <span className="flex-1">Value</span>
                <span style={{ width: 32 }} className="shrink-0" />
              </div>
            )}
            {draft.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div style={{ width: 160 }} className="shrink-0">
                  <TextInput value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="e.g. CGPA" />
                </div>
                <div className="flex-1">
                  <TextInput value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="e.g. 9.00" />
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-elevated hover:text-[var(--rose-accent)]"
                  aria-label="Remove stat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <AddButton label="Add stat" onClick={addStat} />
          </div>
        </Field>

        <Field label="Technical interests">
          <TagsInput value={draft.interests} onChange={(v) => setDraft((d) => ({ ...d, interests: v }))} placeholder="Add an interest…" />
        </Field>

        <Field label="Highlights">
          <div className="space-y-3">
            {draft.highlights.map((h, i) => (
              <WorkspaceCard key={h.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <TextInput value={h.title} onChange={(e) => updateHighlight(i, { title: e.target.value })} placeholder="Title" />
                    <TextArea rows={2} value={h.detail} onChange={(e) => updateHighlight(i, { detail: e.target.value })} placeholder="Detail" />
                    <div className="flex items-center justify-between">
                      <ColorField value={h.accent} onChange={(v) => updateHighlight(i, { accent: v })} />
                      <ToggleField label="Featured (full width)" checked={!!h.featured} onChange={(v) => updateHighlight(i, { featured: v })} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-elevated hover:text-[var(--rose-accent)]"
                    aria-label="Remove highlight"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </WorkspaceCard>
            ))}
            <AddButton label="Add highlight" onClick={addHighlight} />
          </div>
        </Field>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
