import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import { useAdminMutate } from "@/lib/useContent";

import { buildSubmitPayload, isDraftValid, type CollectionConfig, type FieldDef } from "./fields";
import { AddButton, Button, ColorField, ConfirmDialog, Field, TagsInput, TextArea, TextInput, ToastStack, ToggleField, useToasts } from "./ui";

function getField(draft: Record<string, unknown>, key: string): unknown {
  if (key.includes(".")) {
    const [a, b] = key.split(".");
    return (draft[a] as Record<string, unknown> | undefined)?.[b];
  }
  return draft[key];
}

function setField(draft: Record<string, unknown>, key: string, value: unknown): Record<string, unknown> {
  if (key.includes(".")) {
    const [a, b] = key.split(".");
    return { ...draft, [a]: { ...((draft[a] as Record<string, unknown>) ?? {}), [b]: value } };
  }
  return { ...draft, [key]: value };
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.kind) {
    case "text":
    case "url":
      return (
        <TextInput
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          type={field.kind === "url" ? "url" : "text"}
        />
      );
    case "textarea":
      return <TextArea value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "list":
      return <TagsInput value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
    case "bool":
      return <ToggleField label="Yes" checked={!!value} onChange={onChange} />;
  }
}

export function CollectionEditor<T extends { id: string }>({ config, items }: { config: CollectionConfig<T>; items: T[] }) {
  const mutate = useAdminMutate();
  const { toasts, pushSuccess, pushError } = useToasts();
  const [editing, setEditing] = useState<{ mode: "create" } | { mode: "edit"; item: T } | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setDraft(config.blank());
    setEditing({ mode: "create" });
  };
  const openEdit = (item: T) => {
    setDraft(config.fromItem(item));
    setEditing({ mode: "edit", item });
  };
  const close = () => setEditing(null);

  const submit = async () => {
    if (!isDraftValid(config, draft)) {
      pushError("Fill in the required fields first.");
      return;
    }
    setSaving(true);
    try {
      const payload = buildSubmitPayload(config, draft);
      if (editing?.mode === "create") {
        await mutate({ action: "create", section: config.section, data: payload });
        pushSuccess(`${config.singularLabel} added.`);
      } else if (editing?.mode === "edit") {
        await mutate({ action: "update", section: config.section, id: editing.item.id, data: payload });
        pushSuccess(`${config.singularLabel} updated.`);
      }
      close();
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await mutate({ action: "delete", section: config.section, id: deleteTarget.id });
      pushSuccess(`${config.singularLabel} deleted.`);
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <ToastStack toasts={toasts} />
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget ? config.getTitle(config.fromItem(deleteTarget)) : ""}?`}
        description="This can't be undone from here."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="form" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            <button
              onClick={close}
              className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to {config.pluralLabel.toLowerCase()}
            </button>
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              {editing.mode === "create" ? `New ${config.singularLabel}` : `Edit ${config.getTitle(draft)}`}
            </h2>
            <div className="space-y-5">
              {config.hasAccent && (
                <Field label="Accent color">
                  <ColorField value={(draft.accent as string) ?? ""} onChange={(v) => setDraft((d) => setField(d, "accent", v))} />
                </Field>
              )}
              {config.fields.map((f) => (
                <Field key={f.key} label={f.label} required={f.required}>
                  <FieldInput field={f} value={getField(draft, f.key)} onChange={(v) => setDraft((d) => setField(d, f.key, v))} />
                </Field>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
              {editing.mode === "edit" ? (
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => {
                    setDeleteTarget(editing.item);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="ghost" type="button" onClick={close} disabled={saving}>
                  Cancel
                </Button>
                <Button type="button" onClick={submit} disabled={saving}>
                  {saving ? "Saving…" : editing.mode === "create" ? "Add" : "Save changes"}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">{config.pluralLabel}</h2>
              <AddButton label={`Add ${config.singularLabel.toLowerCase()}`} onClick={openCreate} />
            </div>
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 px-5 py-10 text-center text-sm text-muted-foreground">
                Nothing here yet.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openEdit(item)}
                    className="group flex w-full items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/50 px-4 py-3 text-left transition-colors hover:border-border hover:bg-card/80"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {(item as unknown as { featured?: boolean }).featured && (
                          <Star className="h-3 w-3 shrink-0 fill-current text-[var(--amber-accent)]" />
                        )}
                        <div className="truncate text-sm font-medium text-foreground">{config.getTitle(config.fromItem(item))}</div>
                      </div>
                      {config.getSubtitle && <div className="mt-0.5 truncate text-xs text-muted-foreground">{config.getSubtitle(item)}</div>}
                    </div>
                    <Pencil className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
