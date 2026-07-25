# Adversarial Regularization via Stackelberg Equilibria

**Securing Deep Neural Networks Against Clean-Label Data Poisoning**

Research Publication • Under Review, Elsevier Future Generation Computer Systems (FGCS)

Full paper: /Adversarial_Regularization_Stackelberg.pdf

---

# Overview

This research project addresses clean-label data poisoning attacks against deep neural networks — attacks where poisoned training samples look correctly labeled but are crafted to implant hidden, high-severity backdoors. I architected a Stackelberg game-theoretic pipeline from scratch in PyTorch to simulate and defend against these attacks on CIFAR-10 (ResNet-18 backbone), and discovered a novel side effect along the way: the defense doesn't just neutralize the attack, it makes the model outperform an unpoisoned baseline.

---

# The Problem

Clean-label data poisoning is dangerous precisely because the poisoned samples don't look wrong — the adversary reassigns labels on strategically chosen source-class samples without touching the feature vectors at all, so the dataset is visually and statistically indistinguishable from a clean one. Existing defenses like Spectral Signatures and SEVER assume poisoned samples are statistically separable from clean ones (true for trigger-based attacks) — but under constrained, semantic label-flipping that assumption collapses, and these filters start stripping high-value clean samples instead of the poison, accelerating the very degradation they're meant to prevent.

---

# Solution

I modeled the interaction between an attacker and a defender as a two-player, zero-sum Stackelberg game. The attacker moves first as the strategic leader, selecting the highest loss-margin samples in a source class (the ones that induce the largest gradient spike when flipped) and corrupting up to a constrained 5% budget. The defender moves second as the rational follower, running an iterative alternating Min-Max retraining loop: each round, it warm-starts from the previous round's weights, giving it structural memory of the attacker's prior strategy instead of relearning from scratch.

To prove the gains come from this anticipatory structure and not just extra training, I ran a matched cold-start ablation where the defender re-initializes its weights every round ("amnesiac") — isolating the game-theoretic adaptation advantage from raw compute.

The framework simulates high-severity clean-label poisoning attacks and defends against them within the same pipeline, allowing direct, controlled comparison against Spectral Signatures, SEVER, Confusion Training, and a clean, unpoisoned baseline.

---

# Architecture

Clean-Label Poisoning Attack Simulation

↓

Stackelberg Game Formulation (Attacker–Defender)

↓

Iterative Min-Max Retraining (Anticipatory Warm-Starting)

↓

Defended Model

↓

Evaluation: Attack Success Rate vs. Clean-Baseline Accuracy

---

# Experimental Setup

- Dataset: CIFAR-10 (60,000 32×32 RGB images, 10 classes)
- Architecture: ResNet-18, modified with a 3×3 initial convolution stride for CIFAR-10's resolution
- Attack: class 1 ("automobile") as source → class 7 ("horse") as target, constrained 5% poisoning budget (ε = 0.05)
- Training: SGD with Nesterov momentum (μ=0.9), weight decay (λ=5×10⁻⁴), cosine annealing, 15 epochs/round across 5 game rounds

---

# Key Results

| Method | Accuracy | ASR | Δ vs. Clean |
|---|---|---|---|
| Clean Baseline | 86.60% | 0.13% | – |
| Poisoned (Undefended) | 78.65% | 0.53% | −7.95% |
| Spectral Signatures | 79.73% | 0.73% | −6.87% |
| SEVER | 80.18% | 0.53% | −6.43% |
| Confusion Training | 89.20% | 0.10% | +2.60% |
| **Min-Max (Ours)** | **91.14%** | **3.53%** | **+4.54%** |

- The undefended attack causes a "Shattered Model" effect — accuracy collapses to 78.65% even though raw ASR stays low (0.53%), because the poisoning destroys general discriminative capability rather than installing a clean backdoor
- Spectral filter defenses (Spectral Signatures, SEVER) cap accuracy at ~80% because they remove legitimate high-entropy clean samples instead of the semantically indistinguishable poison
- The Min-Max defense is the only method that surpasses the clean baseline, while suppressing Attack Success Rate to 3.53% — below the 10% random-guessing bound for CIFAR-10's 10 classes
- Cold-start (amnesiac) ablation: 88.36% accuracy / 4.34% ASR, vs. warm-start (adaptive): 91.14% accuracy / 3.53% ASR — a 2.78-point accuracy gap and 0.81-point ASR reduction attributable specifically to defender anticipation, not extra compute
- Discovered a novel "Adversarial Regularization" effect — being forced to repeatedly reconcile the attacker's hardest loss-margin samples acts as an unplanned curriculum that generalizes better than standard random-batch training

---

# Technology Stack

- Python
- PyTorch
- ResNet-18
- Game Theory (Stackelberg equilibria)
- Min-Max Optimization

---

# Engineering Decisions

Why frame this as a Stackelberg game instead of a standard adversarial training loop?

A Stackelberg formulation lets the defender explicitly anticipate the attacker's best response rather than just training against a fixed, already-observed attack. That anticipatory structure is what the warm-starting in the retraining algorithm exploits.

Why clean-label poisoning specifically?

It's the harder, more realistic threat model — poisoned samples that pass a human or simple statistical sanity check are far more dangerous than obviously mislabeled ones, and it's exactly where existing anomaly filters break down.

Why build the pipeline from scratch in PyTorch?

There wasn't an existing framework that implemented this specific attacker/defender Stackelberg loop with anticipatory warm-starting, so I built the simulation and defense pipeline together to keep them tightly coupled and directly comparable.

---

# Challenges

- Proving, not just empirically but mathematically, why existing anomaly filters fail against semantic corruption
- Designing a Min-Max retraining loop that converges without collapsing model performance on clean data
- Isolating and explaining the unexpected "Adversarial Regularization" effect rather than dismissing it as noise

---

# Status

Under Review, Elsevier Future Generation Computer Systems (FGCS).

---

# Future Work

- Extend evaluation across additional model architectures and datasets
- Explore whether the Adversarial Regularization effect generalizes to other attack types beyond clean-label poisoning
- Investigate computational cost tradeoffs of the iterative Min-Max retraining at larger scale
