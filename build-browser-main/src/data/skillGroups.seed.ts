import type { SkillGroup } from "./types";

export const SEED_SKILL_GROUPS: SkillGroup[] = [
  { id: "skillgroup-languages", category: "Languages", items: ["C++", "C", "Python", "Java", "JavaScript"], accent: "var(--cyan-accent)" },
  { id: "skillgroup-full-stack", category: "Full-Stack", items: ["React", "Express.js", "Node.js", "Flask", "REST APIs", "HTML", "CSS"], accent: "var(--violet-accent)" },
  { id: "skillgroup-databases", category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase Firestore"], accent: "var(--emerald-accent)" },
  { id: "skillgroup-devops", category: "DevOps", items: ["Docker", "Docker Compose", "Jenkins CI/CD", "Nginx", "Git", "GitHub", "Linux"], accent: "var(--amber-accent)" },
  { id: "skillgroup-ai-ml", category: "AI / ML", items: ["LLMs", "RAG", "AI Agents", "Prompt Engineering", "Computer Vision (YOLO, MiDaS)", "Federated Learning"], accent: "var(--rose-accent)" },
];
