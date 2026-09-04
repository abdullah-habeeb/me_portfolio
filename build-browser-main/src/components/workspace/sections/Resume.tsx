import { Download, FileText } from "lucide-react";

import { useContent } from "@/lib/useContent";

export function ResumeSection() {
  const { resume } = useContent();
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-panel px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" />
          Resume.pdf
        </div>
        <div className="flex items-center gap-2">
          <a
            href={resume.url}
            download="Abdullah_Resume.pdf"
            className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-elevated"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </div>
      </div>

      {/* Document surface */}
      <div className="flex-1 bg-[color:var(--muted)]/40">
        <object
          data={`${resume.url}#toolbar=0&navpanes=0`}
          type="application/pdf"
          className="h-full w-full"
          aria-label="Abdullah — Resume"
        >
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Your browser can't display embedded PDFs.{" "}
            <a href={resume.url} className="ml-1 text-primary underline">
              Download the resume
            </a>
            .
          </div>
        </object>
      </div>
    </div>
  );
}
