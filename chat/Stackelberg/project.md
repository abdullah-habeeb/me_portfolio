# Adversarial Regularization via Stackelberg Equilibria

**Defending Deep Neural Networks Against Clean-Label Data Poisoning**

Research Publication • Under Review, Elsevier Future Generation Computer Systems (FGCS)

---

# Overview

This research project addresses clean-label data poisoning attacks against deep neural networks — attacks where poisoned training samples look correctly labeled but are crafted to implant hidden, high-severity backdoors. I architected a Stackelberg game-theoretic pipeline from scratch in PyTorch to simulate and defend against these attacks, and discovered a novel side effect along the way: the defense doesn't just neutralize the attack, it makes the model outperform an unpoisoned baseline.

---

# The Problem

Clean-label data poisoning is dangerous precisely because the poisoned samples don't look wrong — they carry correct labels, so standard anomaly filters that look for mislabeled or out-of-distribution data often fail to catch them. A model trained on a poisoned dataset can behave normally on clean inputs while responding to a hidden trigger with attacker-controlled behavior. Existing anomaly filters struggle against this because the corruption is semantic, not statistical.

---

# Solution

I modeled the interaction between an attacker and a defender as a Stackelberg game — the defender moves second, anticipating the attacker's optimal poisoning strategy, and retrains against it. This is implemented as an iterative Min-Max retraining algorithm with anticipatory warm-starting, where the defender's model is updated to be robust against the attacker's best response rather than a fixed, static attack.

The framework is used to both simulate high-severity clean-label poisoning attacks and defend against them within the same pipeline, allowing direct, controlled comparison between poisoned, defended, and clean-baseline models.

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

# Key Results

- Suppressed backdoor Attack Success Rate to just 3.53%
- Defended model outperformed a pristine, unpoisoned baseline by +4.54%
- Demonstrated, mathematically and empirically, that existing anomaly filters fail under semantic (clean-label) data corruption
- Discovered a novel "Adversarial Regularization" effect — the defense process itself acts as a regularizer, improving generalization beyond just neutralizing the attack

---

# Technology Stack

- Python
- PyTorch
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
