# Resume Knowledge Base

## Summary

Abdullah is a final-year Computer Science student focused on full-stack engineering, DevOps, privacy-preserving machine learning, and applied AI.

He combines hands-on industry experience with self-directed engineering through solo-shipped, production-grade projects and a research publication on adversarial robustness in deep learning.

---

# Education

B.E. Computer Science & Engineering

BMS Institute of Technology & Management, Bengaluru

CGPA: 9.00 / 10

Sept 2023 – Present

---

# Experience

## Software Engineering Extern — Unisys

Dec 2025 – May 2026, Remote

Highlights:

- Built a Python (Flask) + PowerShell system that autonomously monitored Windows OS events and applied rules-based corrections — designed end-to-end, from rule engine logic to deployment, with no existing framework to extend
- Shipped a real-time event-tracking dashboard with severity classification and remediation scheduling — owned the full stack from backend logic to the operator-facing UI
- Engineered an automated logging pipeline processing 10,000+ system events with metadata enrichment, applying structured data modelling for scalable downstream analytics

---

# Major Projects

## Renewly — Automatic Subscription Detection & Renewal Tracker

Highlights:

- Built a full-stack subscription tracker that connects to Gmail (read-only OAuth) and reconstructs recurring charges automatically from bank-alert and receipt emails, rather than manual entry — built India-first for how Indian banks and UPI actually notify users of a charge
- Shipped real Plaid Sandbox bank linking, a renewal calendar with `.ics` export, curated cancellation guides, and configurable email reminders, with an optional Claude-based extraction fallback for emails regex heuristics can't parse
- Designed a real Jenkins CI/CD pipeline (lint → unit tests → Docker build → Trivy security scan → push → deploy to Firebase → verify) and a Docker Compose stack with an Nginx-served frontend — 113 tests passing (Jest + Vitest)

Stack: React 19, Vite, TypeScript, Tailwind, Node.js/Express, Firebase Auth + Firestore, Plaid, Gmail API, Docker, Jenkins CI/CD

Live: https://subscription-hub-19cf9.web.app · GitHub: https://github.com/abdullah-habeeb/renewly-subscription-tracker

---

## CipherCare — Privacy-Preserving Federated Learning Platform for Healthcare AI

Highlights:

- Built a federated learning platform (Flower framework) simulating 5 hospitals — ECG, vitals, X-ray, geriatric ECG, and multimodal — collaboratively training diagnostic models without sharing raw patient data
- Designed a custom `FedProxFairness` aggregation strategy combining FedProx (µ=0.01), fairness weighting (`0.6·AUROC² + 0.3·samples + 0.1·domain_relevance`), and domain relevance scoring across hospitals
- Applied differential privacy (ε=5.0, δ=1e-5) with per-hospital adaptive noise, and a blockchain-style audit trail (SHA-256 round hashing, Keccak256-hashed model deltas) for compliance traceability

Stack: Python, PyTorch, Flower, FastAPI, React/Vite/Tailwind dashboard

GitHub: https://github.com/abdullah-habeeb/ciphercare

---

## Pothole Detection Platform — Full-Stack Pothole Detection & Monitoring

Highlights:

- Built a full-stack platform for detecting and managing potholes from uploaded dashcam video: React dashboard, Node/Express/MongoDB backend, and a dedicated FastAPI ML microservice
- The ML microservice samples every 5th frame with OpenCV and calls a Roboflow-hosted YOLOv11 model, returning severity (high/medium/none) plus per-detection confidence, bounding box, and preview image
- Surfaced results on an interactive map (React Leaflet) and an admin dashboard (Recharts), behind JWT-authenticated, role-gated routes

Stack: React 18, TypeScript, Vite, Node.js, Express, MongoDB, FastAPI, Roboflow YOLOv11, OpenCV

GitHub: https://github.com/abdullah-habeeb/pothole

---

## Bengaluru Auto Fare Calculator — Official Auto-Rickshaw Fare Calculator

Highlights:

- Built a web app that calculates the official Bengaluru auto-rickshaw fare using the Google Maps Distance Matrix API for real road distance, not straight-line distance
- Applied the official fare structure (₹35 minimum for the first 2 km, ₹17/km after, 1.5x night surcharge 10 PM–5 AM)
- Scoped and shipped as a one-week project in vanilla JavaScript to practice direct API integration and DOM manipulation

Stack: HTML5, CSS3, Vanilla JavaScript, Google Maps API

GitHub: https://github.com/abdullah-habeeb/bengaluru-auto-fare-calculator

---

# Research Publications

## Adversarial Regularization via Stackelberg Equilibria

Under Review, Elsevier Future Generation Computer Systems (FGCS)

Highlights:

- Architected a Stackelberg game-theoretic pipeline from scratch in PyTorch to simulate and defend deep neural networks against high-severity clean-label data poisoning attacks
- Engineered an iterative Min-Max retraining algorithm with anticipatory warm-starting — proving both mathematically and empirically that existing anomaly filters fail under semantic data corruption
- Discovered a novel Adversarial Regularization effect, suppressing backdoor Attack Success Rates to just 3.53% while forcing the defended model to outperform a pristine, unpoisoned baseline by +4.54%
- Benchmarked on CIFAR-10 (ResNet-18) against Spectral Signatures, SEVER, and Confusion Training under a constrained 5% poisoning budget; proved via cold-start vs. warm-start ablation that the gain is attributable to game-theoretic anticipation, not extra compute

Stack: Python, PyTorch, ResNet-18, Game Theory, Min-Max Optimization

Full paper: /Adversarial_Regularization_Stackelberg.pdf

---

# Technical Skills

Languages

C++, C, Python, Java, JavaScript

Full-Stack

React, Express.js, Node.js, Flask, REST APIs, HTML, CSS

AI / ML

LLMs, RAG, AI Agents, Prompt Engineering, Computer Vision (YOLO, MiDaS), Federated Learning

Databases

PostgreSQL, MySQL, MongoDB, Firebase Firestore

DevOps

Docker, Docker Compose, Jenkins CI/CD, Nginx, Git, GitHub, Linux

---

# Leadership

Social Media & Design Head, AWS Student Builder Group, BMSITM (Nov 2025 – Present)

---

# Certifications

SAP Backend Developer (CAP) — 2026: Hands-on backend dev with OData services & REST APIs on SAP BTP

SAP Business Data Cloud — 2026: Certified in enterprise data architecture, cloud-based analytics pipelines, and data governance frameworks

---

# Courses

Python Essentials 1 — Cisco Networking Academy, 2024

Introduction to Cybersecurity — Cisco Networking Academy, 2024

Operating System Basics — Cisco Networking Academy, 2025

---

# Achievements

3rd Place, UI/UX Design Ideathon (May 2025) — Designed and built a high-fidelity Figma prototype replicating the IKS Health platform

---

# Interests

Full-Stack Engineering

Backend Systems

DevOps & CI/CD

Computer Vision

AI Agents

Applied Machine Learning

Adversarial Robustness

---

# Career Goals

Build reliable, production-grade software end-to-end — from infrastructure and backend to UI — and combine strong software engineering with applied AI/ML.

Interested in Software Engineering, Full-Stack Engineering, Backend Engineering, and Applied AI roles.
