import type { ResearchDef } from "./types";

// Built-in seed research entries. Admin-added ones live in content-store.json
// and are merged at read time — see src/lib/content-server.ts.
export const SEED_RESEARCH: ResearchDef[] = [
  {
    id: "research-stackelberg",
    name: "Adversarial Regularization",
    summary: "Defending Deep Neural Networks via Stackelberg Equilibria",
    role: "Research Publication • Under Review, Elsevier FGCS",
    status: "🟣 Under Review",
    problem:
      "Clean-label data poisoning attacks craft correctly-labeled training samples that implant hidden, high-severity backdoors — the adversary reassigns labels on strategically chosen source-class samples without touching the feature vectors at all. Because the data looks statistically and visually clean, spectral/gradient anomaly filters like Spectral Signatures and SEVER can't separate poison from legitimate data, and under a constrained 5% poisoning budget they end up removing high-value clean samples instead — accelerating the exact collapse they were meant to prevent.",
    work:
      "Architected a Stackelberg game-theoretic pipeline from scratch in PyTorch to simulate and defend against clean-label poisoning attacks on CIFAR-10 (ResNet-18 backbone). The attacker moves first as a strategic leader, selecting the highest loss-margin samples in a source class to flip toward a target class; the defender moves second as a rational follower, running an iterative alternating Min-Max retraining loop that warm-starts each round from the prior round's weights so it retains structural memory of the attacker's strategy rather than re-learning from scratch. Ran a matched cold-start (amnesiac, re-initialized every round) ablation to isolate whether the defense's gains come from the game-theoretic anticipation itself or just extra training compute.",
    architectureFlow: [
      "Clean-Label Poisoning Attack Simulation (loss-margin sample selection, 5% budget)",
      "Stackelberg Game Formulation (Attacker–Defender, zero-sum)",
      "Iterative Alternating Min-Max Retraining (Anticipatory Warm-Starting, 5 rounds)",
      "Defended Model at Stackelberg Equilibrium",
      "Evaluation vs. Spectral Signatures, SEVER, Confusion Training, Clean Baseline",
    ],
    highlights: [
      "Undefended attack collapses accuracy from 86.60% to 78.65% while raw ASR stays low (0.53%) — a 'Shattered Model' effect where the attack degrades general discriminative capability rather than installing a clean backdoor",
      "Spectral Signatures and SEVER cap accuracy at ~80% because they strip high-entropy clean samples instead of the semantically indistinguishable poison",
      "Min-Max defense reaches 91.14% accuracy — the only method to beat the clean baseline — while suppressing targeted Attack Success Rate to 3.53%, below the 10% random-guessing bound",
      "Cold-start ablation (88.36% acc, 4.34% ASR) vs. warm-start (91.14% acc, 3.53% ASR) proves the gain is structurally attributable to defender anticipation, not extra compute",
      "Discovered a novel Adversarial Regularization effect: repeated exposure to the attacker's hardest loss-margin samples acts as an unplanned curriculum that generalizes better than random-batch training",
    ],
    contributions: [
      "Architected the full Stackelberg attacker/defender pipeline from scratch in PyTorch, including the loss-margin sample-selection attacker and the iterative Min-Max defender",
      "Engineered the anticipatory warm-starting mechanism and designed the cold-start ablation that isolates its contribution",
      "Ran and benchmarked all experiments on CIFAR-10/ResNet-18 against Spectral Signatures, SEVER, and Confusion Training baselines",
      "Discovered, isolated, and formally analyzed the Adversarial Regularization effect",
    ],
    resultsTable: [
      { method: "Clean Baseline", acc: "86.60%", asr: "0.13%", delta: "–" },
      { method: "Poisoned (Undefended)", acc: "78.65%", asr: "0.53%", delta: "−7.95%" },
      { method: "Spectral Signatures", acc: "79.73%", asr: "0.73%", delta: "−6.87%" },
      { method: "SEVER", acc: "80.18%", asr: "0.53%", delta: "−6.43%" },
      { method: "Confusion Training", acc: "89.20%", asr: "0.10%", delta: "+2.60%" },
      { method: "Min-Max (Ours)", acc: "91.14%", asr: "3.53%", delta: "+4.54%" },
    ],
    stack: ["Python", "PyTorch", "ResNet-18", "Game Theory", "Min-Max Optimization"],
    accent: "var(--rose-accent)",
    links: { report: "/Adversarial_Regularization_Stackelberg.pdf" },
  },
];
