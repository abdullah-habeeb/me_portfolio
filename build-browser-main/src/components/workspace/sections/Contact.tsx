import { Github, Linkedin, Mail, Code } from "lucide-react";

import { useContent } from "@/lib/useContent";

import { FadeIn, SectionHeader } from "../ui";

export function ContactSection() {
  const { contact } = useContent();
  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <FadeIn>
        <SectionHeader
          eyebrow="Get in touch"
          title="Contact"
          subtitle={`${contact.location}. Connect with me online.`}
        />
      </FadeIn>
      <FadeIn delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="text-xs font-medium">{contact.email}</span>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center gap-2">
            <Linkedin className="h-6 w-6" />
            <span className="text-xs font-medium">LinkedIn</span>
          </a>
          <a href={contact.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center gap-2">
            <Github className="h-6 w-6" />
            <span className="text-xs font-medium">GitHub</span>
          </a>
          <a href={contact.leetcode} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex flex-col items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="text-xs font-medium">LeetCode</span>
          </a>
        </div>
      </FadeIn>
    </div>
  );
}
