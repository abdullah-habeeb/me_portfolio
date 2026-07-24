import {
  Boxes,
  Braces,
  Briefcase,
  Calculator,
  Construction,
  Contact as ContactIcon,
  FileText,
  FlaskConical,
  Github,
  LineChart,
  Linkedin,
  Mail,
  RefreshCw,
  ShieldCheck,
  TerminalSquare,
  User,
  type LucideIcon,
} from "lucide-react";

export type TabKind =
  | "about"
  | "projects-index"
  | "project-renewly"
  | "project-ciphercare"
  | "project-pothole"
  | "project-fare-calculator"
  | "research-index"
  | "research-stackelberg"
  | "experience"
  | "skills"
  | "resume"
  | "contact"
  | "terminal";

export type TabDef = {
  id: TabKind;
  label: string;
  filename: string;
  icon: LucideIcon;
  accent: string;
  breadcrumb: string[];
};

export const TABS: Record<TabKind, TabDef> = {
  about: {
    id: "about",
    label: "About",
    filename: "about.md",
    icon: User,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "About"],
  },
  "projects-index": {
    id: "projects-index",
    label: "Projects",
    filename: "projects.md",
    icon: Boxes,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Projects"],
  },
  "project-renewly": {
    id: "project-renewly",
    label: "Renewly",
    filename: "renewly.md",
    icon: RefreshCw,
    accent: "var(--emerald-accent)",
    breadcrumb: ["Workspace", "Projects", "Renewly"],
  },
  "project-ciphercare": {
    id: "project-ciphercare",
    label: "CipherCare",
    filename: "ciphercare.md",
    icon: ShieldCheck,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Projects", "CipherCare"],
  },
  "project-pothole": {
    id: "project-pothole",
    label: "Pothole Detection",
    filename: "pothole.md",
    icon: Construction,
    accent: "var(--amber-accent)",
    breadcrumb: ["Workspace", "Projects", "Pothole Detection"],
  },
  "project-fare-calculator": {
    id: "project-fare-calculator",
    label: "Auto Fare Calculator",
    filename: "fare-calculator.md",
    icon: Calculator,
    accent: "var(--violet-accent)",
    breadcrumb: ["Workspace", "Projects", "Auto Fare Calculator"],
  },
  "research-index": {
    id: "research-index",
    label: "Research",
    filename: "research.md",
    icon: FlaskConical,
    accent: "var(--violet-accent)",
    breadcrumb: ["Workspace", "Research"],
  },
  "research-stackelberg": {
    id: "research-stackelberg",
    label: "Adversarial Regularization",
    filename: "stackelberg.md",
    icon: LineChart,
    accent: "var(--rose-accent)",
    breadcrumb: ["Workspace", "Research", "Adversarial Regularization"],
  },
  experience: {
    id: "experience",
    label: "Experience",
    filename: "experience.md",
    icon: Briefcase,
    accent: "var(--amber-accent)",
    breadcrumb: ["Workspace", "Experience"],
  },
  skills: {
    id: "skills",
    label: "Skills",
    filename: "skills.md",
    icon: Braces,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Skills"],
  },
  resume: {
    id: "resume",
    label: "Resume",
    filename: "Resume.pdf",
    icon: FileText,
    accent: "var(--rose-accent)",
    breadcrumb: ["Workspace", "Resume.pdf"],
  },
  contact: {
    id: "contact",
    label: "Contact",
    filename: "contact.md",
    icon: ContactIcon,
    accent: "var(--cyan-accent)",
    breadcrumb: ["Workspace", "Contact"],
  },
  terminal: {
    id: "terminal",
    label: "Terminal",
    filename: "terminal",
    icon: TerminalSquare,
    accent: "var(--emerald-accent)",
    breadcrumb: ["Workspace", "Terminal"],
  },
};

export const SOCIAL = {
  github: "https://github.com/abdullah-habeeb",
  linkedin: "https://www.linkedin.com/in/abdullahhabeeb/",
  leetcode: "https://leetcode.com/u/abdullahhabeeb/",
  email: "mailto:abdullahhh1426@gmail.com",
  phone: "+91 9663953337",
};

export const SOCIAL_LINKS = [
  { label: "GitHub", href: SOCIAL.github, icon: Github },
  { label: "LinkedIn", href: SOCIAL.linkedin, icon: Linkedin },
  { label: "Email", href: SOCIAL.email, icon: Mail },
];
