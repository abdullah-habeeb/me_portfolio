# Adversarial Regularization via Stackelberg Equilibria — FAQ

## What is this research about?

Defending deep neural networks against clean-label data poisoning attacks, using a Stackelberg game-theoretic framework built from scratch in PyTorch.

---

## What is clean-label data poisoning?

An attack where poisoned training samples keep their correct labels but are crafted to implant a hidden backdoor — making them much harder to catch than mislabeled or obviously anomalous data.

---

## Why a Stackelberg game formulation?

It lets the defender anticipate the attacker's optimal strategy and retrain against that anticipated best response, rather than just reacting to a fixed, already-known attack.

---

## What is anticipatory warm-starting?

Part of the iterative Min-Max retraining algorithm — the defender's model is warm-started using its anticipation of the attacker's next move, rather than retraining from scratch each round.

---

## What were the results?

Backdoor Attack Success Rate suppressed to 3.53%, while the defended model outperformed a pristine, unpoisoned baseline by +4.54%.

---

## What is the "Adversarial Regularization" effect?

An unexpected finding: the defense process itself acts like a regularizer, improving the model's generalization beyond just neutralizing the poisoning attack.

---

## Why do existing anomaly filters fail here?

They typically look for statistical outliers or mislabeled data. Clean-label poisoning is semantically consistent — the labels are correct — so those filters don't have a signal to catch it on.

---

## What's the publication status?

Under review at Elsevier Future Generation Computer Systems (FGCS).

---

## What did you personally build?

I architected the full Stackelberg game-theoretic pipeline from scratch in PyTorch — both the attack simulation and the iterative Min-Max defense — and ran the experiments that surfaced the Adversarial Regularization effect.

---

## What would you improve or explore next?

Testing whether the Adversarial Regularization effect holds across other model architectures, datasets, and attack types beyond clean-label poisoning.
