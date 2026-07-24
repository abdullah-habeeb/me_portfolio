# CipherCare FAQ

## What is CipherCare?

A research-oriented federated learning platform that lets five simulated hospitals collaboratively train diagnostic models without sharing raw patient data, combining differential privacy, fairness-weighted aggregation, and a blockchain-style audit trail.

---

## What framework is the federated learning built on?

Flower (`flwr`). The federated client/server orchestration is Flower; the research contribution is a custom `FedProxFairness` strategy layered on top that adds FedProx, fairness weighting, differential privacy, and domain relevance scoring.

---

## What are the five hospitals?

Hospital A (ECG, general cardiology, 17,418 samples), B (Vitals, 800 samples), C (X-Ray/radiology, 160 samples), D (ECG, geriatric ≥60, 2,400 samples), and E (Multimodal, 2,400 samples) — all simulated from PTB-XL and related data, deliberately non-IID across modality and size.

---

## Why FedProx instead of plain FedAvg?

The hospitals are deliberately heterogeneous — different modalities, sample sizes, and label distributions. FedProx's proximal term (µ=0.01) keeps local updates from drifting too far from the global model under that non-IID setting, which plain FedAvg doesn't handle well.

---

## How does the fairness weighting work?

`0.6 × AUROC² + 0.3 × samples + 0.1 × domain_relevance`. It's designed so a small hospital with strong local performance — like Hospital B, 800 samples but AUROC=0.96 — still meaningfully shapes the global model instead of being drowned out by Hospital A's 17,418 samples.

---

## What's the actual privacy guarantee?

Differential privacy with ε=5.0, δ=1e-5 after 5 FL rounds, via gradient clipping plus adaptive Gaussian noise. The noise scale is inversely tied to each hospital's sample count — smaller datasets get proportionally more noise to protect the same privacy budget.

---

## What is domain relevance scoring?

`0.7 × modality_similarity + 0.3 × label_overlap`, computed automatically between every hospital pair. Two ECG hospitals (A and D) score 1.00 — a perfect match — while A and B (ECG vs. Vitals) score just 0.04.

---

## What does the blockchain audit trail actually do?

Every training round's metadata is hashed into a SHA-256 chain, and DP-processed model deltas are separately hashed with Keccak256 before being recorded — giving an immutable, verifiable log for compliance analysis, not just a plaintext log file.

---

## Why aren't the datasets or trained models in the repo?

Privacy, compliance, and size. The project follows a code-first reproducibility model — experiments are recreated via code and configuration, results are derived rather than stored, mirroring how real-world ML research and production systems handle sensitive data.

---

## What's the tech stack?

Python, PyTorch (S4-based ECG classifier), Flower for federated learning, FastAPI for per-hospital inference endpoints, grad-cam for explainability, and a React/Vite/Tailwind monitoring dashboard.

---

## Biggest engineering challenge?

Calibrating fairness weighting and differential privacy noise together — so a small hospital's data stays protected without letting a large hospital dominate aggregation, across genuinely different modalities.

---

## What kind of project is this — research, hackathon, or production?

Built as part of an applied research and hackathon initiative on secure, distributed machine learning systems. It's research-and-demonstration oriented rather than a deployed clinical product.
