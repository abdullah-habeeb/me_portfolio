# CipherCare

**Privacy-Preserving Federated Learning Platform for Healthcare AI**

Federated Learning • Differential Privacy • Healthcare AI

GitHub: https://github.com/abdullah-habeeb/ciphercare

---

# Overview

CipherCare is a research-oriented, full-stack platform demonstrating privacy-preserving federated learning across five simulated hospitals, built as part of an applied research and hackathon initiative on secure, distributed machine learning systems. It lets multiple hospitals collaboratively train diagnostic models without sharing raw patient data, combining differential privacy, domain-relevance-aware aggregation, and a blockchain-style audit trail into one transparent, secure federated learning workflow.

The repository emphasizes system architecture, orchestration logic, and reproducible experimentation over storing large datasets or trained artifacts — datasets and model weights are intentionally excluded and reproduced via code and configuration instead, mirroring real-world ML research and production workflows.

---

# The Problem

Healthcare AI models are typically trained on centralized datasets, requiring hospitals to transfer sensitive patient records into a single repository — a privacy, compliance, and interoperability problem. Smaller hospitals with limited data end up with weaker diagnostic models, and healthcare organizations can't easily improve AI performance without compromising patient confidentiality.

---

# Solution

CipherCare simulates five specialized hospital nodes — general cardiology (ECG), vitals, radiology (chest X-ray), geriatric cardiology (ECG), and multimodal diagnostics — that collaboratively train a shared model via the Flower federated learning framework using a custom FedProx strategy (proximal term µ=0.01) to handle non-IID data across hospitals. Each round aggregates client updates with fairness weighting so small, high-performing hospitals aren't drowned out by large ones, applies differential privacy to every gradient update, and logs an immutable, hash-chained audit record of the round for compliance traceability.

---

# Architecture

Federated Server (FedProxFairness strategy, Flower)

↓ coordinates training rounds, aggregates updates

Hospital A (ECG, general) · Hospital B (Vitals) · Hospital C (X-Ray) · Hospital D (ECG, geriatric ≥60) · Hospital E (Multimodal)

↓ each trains locally, applies differential privacy, never exposes raw data

DP Update Processor → Blockchain Audit Log (SHA-256 chain, Keccak256-hashed model deltas)

↓

Monitoring Dashboard (React/Vite/Tailwind frontend + backend)

**Federated Server** coordinates rounds, aggregates client updates, and maintains audit records. **Hospital Clients** train locally, apply privacy mechanisms, and never expose raw patient data. The **Audit Layer** records immutable metadata per round for traceability and compliance analysis. The **Monitoring Dashboard** visualizes training progress, performance metrics, and fairness indicators.

---

# Hospital Nodes

| Hospital | Modality | Samples | Notes |
|---|---|---|---|
| A | ECG (general cardiology) | 17,418 | PTB-XL, all ages; S4 classifier, 36 layers, 256 channels, ~70M params |
| B | Vitals | 800 | High AUROC (0.96) despite small sample size |
| C | X-Ray (radiology) | 160 | Smallest node |
| D | ECG (geriatric, age ≥ 60) | 2,400 | PTB-XL filtered; lighter S4 model, 12 layers, 128 channels, ~18M params |
| E | Multimodal | 2,400 | Combines modalities across the other nodes |

Hospital A's standalone baseline (S4-based ECGClassifier on PTB-XL, 5 disease classes — NORM, MI, STTC, CD, HYP) reaches Macro AUROC ~0.70–0.80.

---

# Privacy & Fairness Mechanisms

**Differential Privacy** — gradient clipping + adaptive Gaussian noise, privacy budget ε=5.0, δ=1e-5 after 5 FL rounds. Noise scale is inversely tied to sample count, e.g. Hospital A (17,418 samples) σ=0.000081 vs. Hospital C (160 samples) σ=0.008819 — smaller hospitals get proportionally more noise to protect the same privacy budget.

**Domain Relevance Scoring** — `0.7 × modality_similarity + 0.3 × label_overlap`, computed automatically and validated across all 5 hospitals. Example: Hospital A↔D = 1.00 (both ECG cardiology, perfect match), A↔E = 0.70, B↔E = 0.44, C↔E = 0.40, A↔B = 0.04 (minimal overlap).

**Fairness-Weighted Aggregation** — `0.6 × AUROC² + 0.3 × samples + 0.1 × domain_relevance`, so a hospital with a small dataset but strong local performance still contributes meaningfully. Example round: A=26.2% (17,418 samples, AUROC=0.72), B=26.0% (800 samples, AUROC=0.96 — high accuracy compensates for low volume), E=18.9%, D=16.0%, C=12.8%.

**Blockchain-Style Audit Trail** — SHA-256 hash chain over training-round metadata, with Keccak256 hashing of DP-processed model deltas before they're recorded, giving an immutable, verifiable log for compliance analysis.

---

# Technology Stack

- Python, PyTorch (S4-based ECGClassifier)
- Flower (`flwr`) — federated learning framework, custom `FedProxFairness` strategy
- FastAPI (per-hospital inference APIs)
- grad-cam (explainability)
- scikit-learn, NumPy, Pandas
- React, Vite, Tailwind CSS (monitoring dashboard frontend + backend)

---

# Engineering Decisions

Why Flower instead of building federated orchestration from scratch?

Flower handles the client/server communication and round orchestration; the actual research contribution — FedProx + fairness weighting + differential privacy + domain relevance + blockchain audit — is a custom `Strategy` (`FedProxFairness`) built on top of it, keeping the reusable FL plumbing separate from the novel aggregation logic.

Why FedProx over plain FedAvg?

The five hospitals are deliberately non-IID — different modalities, different sample sizes, different label distributions — and FedProx's proximal term keeps local updates from drifting too far from the global model under that heterogeneity.

Why fairness-weighted aggregation instead of sample-count weighting alone?

Pure sample-count weighting would let Hospital A's 17,418 ECG samples dominate every round and drown out Hospital C's 160 X-ray samples, even when C's local model is performing well. Weighting by AUROC² alongside sample count and domain relevance lets a small, accurate hospital still shape the global model.

Why exclude datasets and trained weights from the repository?

Privacy, compliance, and size — the project follows a code-first reproducibility model where experiments are recreated via code and configuration rather than shipped as stored artifacts, the same approach real-world ML research and production systems use.

---

# Challenges

- Designing fairness weighting that doesn't let large hospitals dominate aggregation
- Calibrating differential privacy noise per hospital so smaller datasets aren't disproportionately degraded
- Building a domain relevance metric that's meaningful across genuinely different modalities (ECG vs. vitals vs. X-ray vs. multimodal)
- Keeping an audit trail that's actually verifiable (hash-chained) rather than just a log file
- Reproducing results without checking in datasets or trained model weights

---

# Reproducibility Philosophy

CipherCare follows a code-first reproducibility model: experiments are recreated via code and configuration files, results are derived rather than stored, and large artifacts are intentionally excluded from version control — mirroring real-world ML research and production workflows rather than a one-off hackathon demo.

---

# Use Cases

Privacy-preserving healthcare AI research, federated learning system prototyping, academic demonstrations and hackathons, and compliance-aware machine learning system design.
