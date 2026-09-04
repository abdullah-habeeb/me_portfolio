import type { ProjectDef } from "./types";

// Built-in seed projects, compiled into the app. Admin-added projects live
// in content-store.json and are merged with this list at read time — see
// src/lib/content-server.ts. Never edit this file to add a project; use the
// admin terminal instead (`admin` -> `add project`).
export const SEED_PROJECTS: ProjectDef[] = [
  {
    id: "project-renewly",
    name: "Renewly",
    summary: "Every subscription. One quiet place.",
    topTags: ["Full-Stack", "Fintech", "DevOps"],
    problem:
      "A subscription is ₹499 here, ₹1,950 there — an annual plan agreed to eleven months ago and forgotten the moment the tab closed. Each one is too small to notice alone, until a bank statement adds them all up in a number you didn't see coming.",
    solution:
      "Renewly connects to Gmail read-only, reads the payment receipts and bank-alert emails already sitting in the inbox, reconstructs recurring charges automatically, tracks running monthly/yearly cost, and emails a reminder before the next renewal — built India-first around how Indian banks and UPI actually notify a charge, not retrofitted from a US-style bank-linking product.",
    architecture:
      "React 19 SPA (TanStack Router, Tailwind, shadcn/ui) ↔ realtime Firestore for CRUD, and → Express REST API (Bearer Firebase ID token) for anything needing server secrets: Gmail OAuth scanning, Plaid Sandbox bank linking, and a daily reminder cron over Nodemailer/Gmail SMTP.",
    stack: ["React 19", "Express.js", "Firebase", "Plaid", "Docker", "Jenkins CI/CD"],
    stackCategorized: [
      { category: "Frontend", items: ["React 19", "Vite", "TypeScript", "Tailwind CSS 4", "TanStack Router"] },
      { category: "Backend", items: ["Node.js", "Express", "Firebase Admin SDK"] },
      { category: "Integrations", items: ["Firebase Auth + Firestore", "Plaid (bank linking)", "Gmail API (OAuth)", "Claude (optional extraction)"] },
      { category: "Infra & CI/CD", items: ["Docker + Nginx", "Jenkins (lint → test → build → Trivy scan → deploy)", "Firebase Hosting + Render"] },
    ],
    engineeringDecisions: [
      { name: "Why Gmail instead of bank-linking?", reason: "Plaid has no coverage of Indian banks; Gmail is the closest thing to a real-time transaction feed available without a business registration." },
      { name: "Why Firestore over PostgreSQL?", reason: "Realtime onSnapshot listeners let the dashboard reflect new detections live, and per-user security rules handle authorization without a separate auth service." },
      { name: "Why keep AI extraction off by default?", reason: "The Claude fallback pass is built and tested, but it needs an API key and I didn't want it running against a personal budget indefinitely." },
    ],
    challenges: [
      "Deduping the same subscription across multiple linked Gmail inboxes",
      "Filtering marketing email out of the same inbox real receipts live in",
      "Reconstructing recurring charges from unstructured bank-alert emails",
      "Keeping a reminder cron reliable on a free-tier backend that sleeps when idle",
    ],
    accent: "var(--emerald-accent)",
    links: { github: "https://github.com/abdullah-habeeb/renewly-subscription-tracker", demo: "https://subscription-hub-19cf9.web.app" },
    featured: true,
  },
  {
    id: "project-ciphercare",
    name: "CipherCare",
    summary: "Privacy-Preserving Federated Learning Platform for Healthcare AI",
    topTags: ["Federated Learning", "Differential Privacy", "Healthcare AI"],
    problem:
      "Healthcare AI models are typically trained on centralized datasets, requiring hospitals to transfer sensitive patient records into a single repository — a privacy, compliance, and interoperability problem that leaves smaller hospitals with limited data producing weaker diagnostic models.",
    solution:
      "CipherCare simulates five hospital nodes — ECG, vitals, X-ray, geriatric ECG, and multimodal — collaboratively training a shared model via Flower, using a custom FedProxFairness strategy that layers FedProx, fairness-weighted aggregation, differential privacy, and domain-relevance scoring on top, with a blockchain-style hash-chained audit trail for compliance traceability.",
    architecture:
      "Federated Server (Flower + custom FedProxFairness strategy) coordinates training rounds across 5 hospital clients, each training locally and applying differential privacy before sending updates. A DP Update Processor hashes and chains each round into a blockchain-style audit log, surfaced on a React/Vite monitoring dashboard.",
    stack: ["Python", "PyTorch", "Flower", "FastAPI", "React"],
    stackCategorized: [
      { category: "ML / FL", items: ["PyTorch (S4 ECG classifier)", "Flower (flwr)", "Custom FedProxFairness strategy"] },
      { category: "Privacy & Audit", items: ["Differential Privacy (ε=5.0, δ=1e-5)", "Domain relevance scoring", "SHA-256 / Keccak256 audit chain"] },
      { category: "Serving & Dashboard", items: ["FastAPI", "React", "Vite", "Tailwind"] },
    ],
    engineeringDecisions: [
      { name: "Why Flower + a custom strategy?", reason: "Flower handles client/server orchestration; the research contribution — FedProx + fairness weighting + DP + domain relevance + audit — is a custom Strategy on top." },
      { name: "Why fairness-weighted aggregation?", reason: "Pure sample-count weighting would let Hospital A's 17,418 ECG samples drown out Hospital C's 160 X-ray samples even when C performs well locally." },
      { name: "Why exclude datasets/weights from the repo?", reason: "Privacy, compliance, and size — the project follows a code-first reproducibility model, mirroring real-world ML research and production workflows." },
    ],
    challenges: [
      "Weighting aggregation without letting large hospitals dominate",
      "Calibrating DP noise per hospital without over-degrading small datasets",
      "Building a domain relevance metric meaningful across ECG, vitals, and X-ray",
      "Making the audit trail actually verifiable, not just a log file",
    ],
    accent: "var(--cyan-accent)",
    links: { github: "https://github.com/abdullah-habeeb/ciphercare" },
    featured: true,
  },
  {
    id: "project-pothole",
    name: "Pothole Detection Platform",
    summary: "Full-Stack Pothole Detection & Monitoring Platform",
    topTags: ["Full-Stack", "Computer Vision", "Smart City"],
    problem:
      "Identifying and tracking road hazards like potholes is normally manual and reactive, with no unified system to detect, verify, and visualize them at scale.",
    solution:
      "Users upload dashcam footage through a React frontend. A dedicated FastAPI ML microservice samples every 5th frame with OpenCV, sends frames to a Roboflow-hosted YOLOv11 model, and returns a severity rating plus up to 5 detections with bounding boxes and preview images. Results surface on an interactive map and admin dashboard behind JWT-authenticated routes.",
    architecture:
      "React 18 + TypeScript frontend (upload, map, dashboard) → Node.js + Express + MongoDB backend (JWT auth, orchestration) → FastAPI ml-server (OpenCV frame sampling → Roboflow YOLOv11 via InferenceHTTPClient). Three independent services: frontend (3000), backend (5000), ml-server (8000).",
    stack: ["React 18", "Node.js", "MongoDB", "FastAPI", "Roboflow YOLOv11"],
    stackCategorized: [
      { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "TanStack Query", "React Leaflet", "Recharts"] },
      { category: "Backend", items: ["Node.js", "Express", "MongoDB (Mongoose)", "JWT auth"] },
      { category: "ML Service", items: ["FastAPI", "OpenCV", "Roboflow Inference SDK (YOLOv11)"] },
    ],
    engineeringDecisions: [
      { name: "Why a separate FastAPI microservice?", reason: "Keeps the Python ML ecosystem (OpenCV, Roboflow SDK) decoupled from the Node API layer — it can be scaled or redeployed independently." },
      { name: "Why a Roboflow-hosted model?", reason: "Avoids managing GPU infrastructure at this stage while still getting real YOLOv11 detections." },
      { name: "Why sample every 5th frame?", reason: "Running inference on every frame is expensive and mostly redundant — pothole framing barely changes between adjacent frames." },
    ],
    challenges: [
      "Keeping the detection response shape consistent across three independently developed services",
      "Coordinating three separate dev servers during development",
      "Balancing frame-sampling rate against detection coverage and latency",
    ],
    accent: "var(--amber-accent)",
    links: { github: "https://github.com/abdullah-habeeb/pothole" },
  },
  {
    id: "project-fare-calculator",
    name: "Bengaluru Auto Fare Calculator",
    summary: "Official Auto-Rickshaw Fare Calculator for Bengaluru",
    topTags: ["Web", "Google Maps API", "Vanilla JS"],
    problem:
      "Auto-rickshaw fares in Bengaluru are often inconsistent in practice, leading to confusion and overcharging, with no quick official way to check what a trip should cost.",
    solution:
      "A focused web app using Google Places Autocomplete and the Distance Matrix API to get real road distance, then applies the official fare structure — ₹35 minimum for the first 2 km, ₹17/km after, with an automatic 1.5x night surcharge between 10 PM and 5 AM. Built as a one-week project to practice API integration and DOM manipulation without framework overhead.",
    architecture:
      "Single-page vanilla JS app: Google Places Autocomplete for location input → Distance Matrix API for road distance → client-side fare logic (minimum fare + per-km rate + night surcharge window) rendered directly to the DOM.",
    stack: ["HTML5", "CSS3", "Vanilla JavaScript", "Google Maps API"],
    stackCategorized: [
      { category: "Frontend", items: ["HTML5", "CSS3 (Flexbox)", "Vanilla JavaScript"] },
      { category: "APIs", items: ["Google Places API", "Google Distance Matrix API"] },
    ],
    engineeringDecisions: [
      { name: "Why vanilla JS instead of a framework?", reason: "Scoped as a one-week project to practice core API integration and DOM manipulation — a framework would have been overhead for a single-page calculator." },
      { name: "Why Distance Matrix over straight-line distance?", reason: "Fare depends on real road distance, not as-the-crow-flies distance, so the calculated fare stays accurate to what a rider is actually charged." },
    ],
    challenges: [
      "Getting road-accurate distance instead of straight-line distance",
      "Implementing the night-surcharge window correctly across the 10 PM–5 AM boundary",
      "Keeping the UI clean and mobile-friendly with plain CSS and no framework",
    ],
    accent: "var(--violet-accent)",
    links: { github: "https://github.com/abdullah-habeeb/bengaluru-auto-fare-calculator" },
  },
];
