import { useState } from "react";

import type { ContactContent } from "@/data/types";
import { useAdminMutate } from "@/lib/useContent";

import { Field, SaveBar, TextInput, ToastStack, useDraft, useToasts } from "./ui";

export function ContactEditor({ contact }: { contact: ContactContent }) {
  const [draft, setDraft, dirty, discard] = useDraft(contact);
  const [saving, setSaving] = useState(false);
  const mutate = useAdminMutate();
  const { toasts, pushSuccess, pushError } = useToasts();

  const save = async () => {
    setSaving(true);
    try {
      await mutate({ action: "updateSingleton", section: "contact", data: draft });
      pushSuccess("Contact info updated.");
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof ContactContent) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <ToastStack toasts={toasts} />
      <h2 className="mb-6 text-xl font-semibold text-foreground">Contact</h2>

      <div className="space-y-5">
        <Field label="Email" required>
          <TextInput type="email" value={draft.email} onChange={set("email")} />
        </Field>
        <Field label="Phone" required>
          <TextInput value={draft.phone} onChange={set("phone")} />
        </Field>
        <Field label="Location" required>
          <TextInput value={draft.location} onChange={set("location")} placeholder="e.g. Bengaluru, India" />
        </Field>
        <Field label="GitHub URL">
          <TextInput type="url" value={draft.github} onChange={set("github")} />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput type="url" value={draft.linkedin} onChange={set("linkedin")} />
        </Field>
        <Field label="LeetCode URL">
          <TextInput type="url" value={draft.leetcode} onChange={set("leetcode")} />
        </Field>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
