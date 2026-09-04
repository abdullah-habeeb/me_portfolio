import { useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";

import { useAdminUpload, useContent } from "@/lib/useContent";

import { Button, Field, ToastStack, useToasts } from "./ui";

export function ResumeEditor() {
  const { resume } = useContent();
  const upload = useAdminUpload();
  const { toasts, pushSuccess, pushError } = useToasts();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [bust, setBust] = useState(0);

  const onPick = async (file: File) => {
    setUploading(true);
    try {
      await upload("resume", file);
      setBust(Date.now());
      pushSuccess("Resume replaced.");
    } catch (err) {
      pushError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <ToastStack toasts={toasts} />
      <h2 className="mb-6 text-xl font-semibold text-foreground">Resume</h2>

      <Field label="Resume PDF" hint="Replacing this updates the file everyone downloads from the Resume tab.">
        <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card/50 p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-elevated">
            <FileText className="h-5 w-5 text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground">Abdullah_Resume.pdf</div>
            <a
              href={`${resume.url}${bust ? `${resume.url.includes("?") ? "&" : "?"}t=${bust}` : ""}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary underline underline-offset-2"
            >
              View current file
            </a>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPick(f);
              e.target.value = "";
            }}
          />
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Replace PDF"}
          </Button>
        </div>
      </Field>
    </div>
  );
}
