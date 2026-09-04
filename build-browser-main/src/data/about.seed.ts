import type { AboutContent } from "./types";

export const SEED_ABOUT: AboutContent = {
  bio: "I'm Abdullah, a Computer Science student at BMS Institute of Technology & Management, Bengaluru. I like owning systems end-to-end — infra, backend, and UI together — rather than just one layer of the stack. My work spans full-stack fintech platforms, privacy-preserving federated learning, DevOps pipelines, and adversarial ML research, with a strong focus on building things from scratch when no existing framework fits.",
  photo: "/abdullah.jpg",
  stats: [
    { label: "CGPA", value: "9.00" },
    { label: "Research Publications", value: "1" },
    { label: "Projects Shipped", value: "2" },
    { label: "Design Ideathon", value: "3rd Place" },
    { label: "AWS", value: "SBG Design Head" },
  ],
  interests: [
    "Full-Stack Engineering",
    "Backend Systems",
    "DevOps & CI/CD",
    "Federated Learning",
    "AI Agents",
    "Applied Machine Learning",
    "Adversarial Robustness",
  ],
  highlights: [
    {
      id: "highlight-unisys",
      title: "Software Engineering Extern — Unisys",
      detail: "Autonomous Windows event monitoring system (Python/Flask + PowerShell), built end-to-end with no existing framework to extend.",
      accent: "var(--rose-accent)",
    },
    {
      id: "highlight-research",
      title: "Research — Under Review, Elsevier FGCS",
      detail: "Stackelberg game-theoretic defense against clean-label data poisoning, from scratch in PyTorch.",
      accent: "var(--violet-accent)",
    },
    {
      id: "highlight-community",
      title: "☁️ Community & Leadership",
      detail: "Social Media & Design Head — AWS Student Builder Group, BMSITM",
      accent: "var(--amber-accent)",
    },
    {
      id: "highlight-builder",
      title: "🛠 Builder Mindset",
      detail: "End-to-end ownership • Built from scratch when no framework fits • Independently testable modules • Engineering-first thinking",
      accent: "var(--emerald-accent)",
      featured: true,
    },
  ],
};
