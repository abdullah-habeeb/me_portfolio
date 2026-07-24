// Structured portfolio content that powers the context-aware AI assistant.
// Every fact here is grounded in Abdullah's resume — no fabricated metrics.

export type ContextKey =
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
  | "contact";

export const PORTFOLIO_DOCS: Record<ContextKey, { title: string; body: string }> = {
  about: {
    title: "About Abdullah",
    body: `Abdullah — B.E. Computer Science & Engineering, BMS Institute of Technology & Management, Bengaluru (2023–Present). CGPA 9.00/10.
Full-stack and systems engineer who likes owning a project end-to-end — infra, backend, and UI — rather than one layer of the stack.
Interests: Full-Stack Engineering, Backend Systems, DevOps & CI/CD, Federated & Privacy-Preserving ML, AI Agents, Applied Machine Learning, Adversarial Robustness.
Based in Bengaluru, India.`,
  },
  "projects-index": {
    title: "Projects overview",
    body: `Featured: Renewly (Gmail-based automatic subscription tracker for India) and CipherCare (privacy-preserving federated learning platform for healthcare AI).
Also: Pothole Detection Platform (full-stack dashcam pothole detection with a Roboflow YOLOv11 ML microservice) and Bengaluru Auto Fare Calculator (Google Maps-based official auto-rickshaw fare calculator).`,
  },
  "project-renewly": {
    title: "Renewly — Every subscription. One quiet place.",
    body: `Stack: React 19, Vite, TypeScript, Tailwind, Node.js/Express, Firebase Auth + Firestore, Plaid, Gmail API, Docker, Jenkins CI/CD.
What it does: A full-stack subscription tracker that reads Gmail (read-only OAuth) to automatically detect recurring charges from bank-alert and receipt emails, tracks running monthly/yearly cost, and reminds users before renewals — built India-first since Plaid has no coverage of Indian banks.
Architecture: React SPA talks to Firestore directly for realtime CRUD; an Express API handles Gmail OAuth scanning, Plaid Sandbox bank linking, and a daily reminder cron.
CI/CD: real Jenkins pipeline — lint, unit tests, Docker build, Trivy security scan, push, deploy to Firebase, verify. 113 tests passing (Jest + Vitest).
Live: https://subscription-hub-19cf9.web.app · GitHub: https://github.com/abdullah-habeeb/renewly-subscription-tracker`,
  },
  "project-ciphercare": {
    title: "CipherCare — Privacy-Preserving Federated Learning for Healthcare AI",
    body: `Stack: Python, PyTorch, Flower (flwr), FastAPI, React/Vite dashboard.
What it does: Simulates 5 hospital nodes (ECG, vitals, X-ray, geriatric ECG, multimodal) collaboratively training a shared diagnostic model without sharing raw patient data.
Architecture: A custom FedProxFairness Strategy on top of Flower combines FedProx (µ=0.01), fairness-weighted aggregation (0.6·AUROC² + 0.3·samples + 0.1·domain_relevance), differential privacy (ε=5.0, δ=1e-5, adaptive per-hospital noise), and domain relevance scoring (0.7·modality_similarity + 0.3·label_overlap). Every round is hash-chained (SHA-256 + Keccak256) into a blockchain-style audit log.
GitHub: https://github.com/abdullah-habeeb/ciphercare`,
  },
  "project-pothole": {
    title: "Pothole Detection Platform",
    body: `Stack: React 18/TypeScript/Vite frontend, Node.js/Express/MongoDB backend, FastAPI ML microservice.
What it does: Full-stack platform for detecting and managing potholes from uploaded dashcam video. Users upload footage; a dedicated FastAPI "ml-server" samples every 5th frame with OpenCV and sends frames to a Roboflow-hosted YOLOv11 model, returning a severity rating (high/medium/none) plus up to 5 detections with confidence, bounding box, and preview image. Results surface on an interactive map (React Leaflet) and an admin dashboard (Recharts), behind JWT-authenticated, role-gated routes.
Architecture: three independently-run services — frontend (3000), Express backend (5000), FastAPI ml-server (8000) — deliberately decoupled so the Python/ML stack can scale or redeploy independently of the Node API.
Why every 5th frame: a speed/coverage tradeoff — full-frame inference is expensive and mostly redundant since pothole framing barely changes between adjacent frames.
GitHub: https://github.com/abdullah-habeeb/pothole`,
  },
  "project-fare-calculator": {
    title: "Bengaluru Auto Fare Calculator",
    body: `Stack: HTML5, CSS3, vanilla JavaScript, Google Maps JavaScript API (Places API for autocomplete, Distance Matrix API for road distance).
What it does: Calculates the official Bengaluru auto-rickshaw fare for a trip — ₹35 minimum fare for the first 2 km, then ₹17/km after, with a 1.5x surcharge automatically applied for trips between 10 PM and 5 AM. Uses real road distance via the Distance Matrix API rather than straight-line distance, so the fare matches what a rider would actually be charged.
Why vanilla JS: scoped as a one-week project specifically to practice direct API integration and DOM manipulation — a framework would have been overhead for a single-page calculator.
GitHub: https://github.com/abdullah-habeeb/bengaluru-auto-fare-calculator`,
  },
  "research-index": {
    title: "Research overview",
    body: `RESEARCH OVERVIEW
Abdullah's research paper "Adversarial Regularization via Stackelberg Equilibria" is under review at Elsevier Future Generation Computer Systems (FGCS), focused on defending deep neural networks against clean-label data poisoning attacks.`,
  },
  "research-stackelberg": {
    title: "Research: Adversarial Regularization via Stackelberg Equilibria",
    body: `Status: Under Review, Elsevier FGCS
Problem: Clean-label data poisoning attacks craft correctly-labeled samples that implant hidden backdoors, evading standard anomaly filters.
Work: Architected a Stackelberg game-theoretic pipeline from scratch in PyTorch to simulate and defend against these attacks, using an iterative Min-Max retraining algorithm with anticipatory warm-starting.
Key Results: Suppressed backdoor Attack Success Rate to 3.53% while the defended model outperformed a pristine, unpoisoned baseline by +4.54%. Discovered a novel Adversarial Regularization effect.`,
  },
  experience: {
    title: "Experience & Leadership",
    body: `- Software Engineering Extern, Unisys (Dec 2025 – May 2026, Remote) — autonomous Windows event monitoring system, real-time dashboard, automated logging pipeline (10,000+ events).
- Social Media & Design Head, AWS Student Builder Group, BMSITM (Nov 2025 – Present).
Achievements: SAP Backend Developer (CAP) 2026, SAP Business Data Cloud 2026, 3rd Place UI/UX Design Ideathon (May 2025).`,
  },
  skills: {
    title: "Skills & Certifications",
    body: `Languages: C++, C, Python, Java, JavaScript.
Full-Stack: React, Express.js, Node.js, Flask, REST APIs, HTML, CSS.
Databases: PostgreSQL, MySQL, MongoDB, Firebase Firestore.
DevOps: Docker, Docker Compose, Jenkins CI/CD, Nginx, Git, GitHub, Linux.
AI/ML: LLMs, RAG, AI Agents, Prompt Engineering, Computer Vision (YOLO, MiDaS), Federated Learning.

Certifications:
- SAP Backend Developer (CAP) — 2026
- SAP Business Data Cloud — 2026`,
  },
  resume: {
    title: "Resume",
    body: `Full resume PDF is available in the Resume tab. Contains Education, Experience (Unisys), Projects (Renewly, CipherCare), Research Publications, Certifications & Achievements, and Technical Skills.`,
  },
  contact: {
    title: "Contact",
    body: `Email: abdullahhh1426@gmail.com
Phone: +91 9663953337
Location: Bengaluru, India
LinkedIn and GitHub links are available in the Contact section.`,
  },
};

const ALL_DOCS = Object.values(PORTFOLIO_DOCS)
  .map((d) => `## ${d.title}\n${d.body}`)
  .join("\n\n");

export function buildSystemPrompt(context?: ContextKey | null): string {
  const scoped = context ? PORTFOLIO_DOCS[context] : null;
  const scopeHeader = scoped
    ? `The user is currently viewing: **${scoped.title}**. Prefer answering from this section first, but you may draw on the rest of the portfolio when helpful.`
    : `No specific section is focused. Answer from the entire portfolio.`;

  return `You are the AI assistant embedded inside Abdullah's engineering workspace portfolio. Answer questions about his work concisely, warmly, and accurately.

${scopeHeader}

# Rules
- Ground every answer in the portfolio content below. Do not invent metrics, dates, or achievements.
- Keep answers under ~150 words unless the user explicitly asks for depth.
- Use markdown: short paragraphs, bullet lists, and code blocks when relevant.
- When you cite a specific project or section, mention it inline like [Renewly] or [Research].
- If asked something not in the portfolio, say you're not sure and suggest the Contact section.
- Never fabricate. If a detail isn't present, say "not documented yet" or "currently under development."

${scoped ? `# Focused section\n## ${scoped.title}\n${scoped.body}\n\n` : ""}
# Full portfolio
${ALL_DOCS}`;
}

// Legacy export retained for compatibility.
export const PORTFOLIO_CONTEXT = buildSystemPrompt(null);
