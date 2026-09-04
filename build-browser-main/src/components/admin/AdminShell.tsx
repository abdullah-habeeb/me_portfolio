import {
  Award,
  Boxes,
  Braces,
  Briefcase,
  Contact as ContactIcon,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";

import { adminLogout, useContent } from "@/lib/useContent";

import { AboutEditor } from "./AboutEditor";
import { CollectionEditor } from "./CollectionEditor";
import { CERTIFICATIONS_CONFIG, COURSES_CONFIG, PROJECTS_CONFIG, RESEARCH_CONFIG, SKILL_GROUPS_CONFIG } from "./fields";
import { ContactEditor } from "./ContactEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { ResumeEditor } from "./ResumeEditor";

type NavKey = "about" | "projects" | "research" | "experience" | "skillGroups" | "certifications" | "courses" | "contact" | "resume";

const NAV: { key: NavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "about", label: "About", icon: User },
  { key: "projects", label: "Projects", icon: Boxes },
  { key: "research", label: "Research", icon: FlaskConical },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "skillGroups", label: "Skill Groups", icon: Braces },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "courses", label: "Courses", icon: GraduationCap },
  { key: "contact", label: "Contact", icon: ContactIcon },
  { key: "resume", label: "Resume", icon: FileText },
];

export function AdminShell({ onLoggedOut }: { onLoggedOut: () => void }) {
  const content = useContent();
  const [active, setActive] = useState<NavKey>("about");

  const logout = async () => {
    await adminLogout();
    onLoggedOut();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-border/60 bg-panel">
        <div className="border-b border-border/60 px-4 py-4">
          <div className="text-sm font-semibold text-foreground">Portfolio CMS</div>
          <div className="text-[11px] text-muted-foreground">Editing live content</div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                  isActive ? "bg-elevated text-foreground" : "text-muted-foreground hover:bg-elevated/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-border/60 p-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-elevated/60 hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View live site
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-elevated/60 hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        {active === "about" && <AboutEditor about={content.about} />}
        {active === "projects" && <CollectionEditor config={PROJECTS_CONFIG} items={content.projects} />}
        {active === "research" && <CollectionEditor config={RESEARCH_CONFIG} items={content.research} />}
        {active === "experience" && <ExperienceEditor experience={content.experience} />}
        {active === "skillGroups" && <CollectionEditor config={SKILL_GROUPS_CONFIG} items={content.skillGroups} />}
        {active === "certifications" && <CollectionEditor config={CERTIFICATIONS_CONFIG} items={content.certifications} />}
        {active === "courses" && <CollectionEditor config={COURSES_CONFIG} items={content.courses} />}
        {active === "contact" && <ContactEditor contact={content.contact} />}
        {active === "resume" && <ResumeEditor />}
      </main>
    </div>
  );
}
