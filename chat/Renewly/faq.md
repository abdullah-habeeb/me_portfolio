# Renewly FAQ

## What is Renewly?

A full-stack subscription tracker that reads your Gmail (read-only) to automatically detect recurring charges from bank alerts and receipts, tracks running monthly/yearly cost, and reminds you before renewals — built India-first.

---

## Why "India-first"?

Because the obvious US-style approach — bank-linking via Plaid — doesn't work here: Plaid has no coverage of Indian banks. Renewly's primary detection path (Gmail scanning) and its documented gaps (UPI payments generating no email) are both shaped around how Indian banks and UPI actually notify users of a charge.

---

## Why detect from Gmail instead of linking a bank account?

For an Indian user, Gmail is the closest thing to a real-time transaction feed available without a business registration — most banks email a receipt for nearly every card charge or mandate-based debit. Reading bank SMS directly would close the remaining gap, but Google Play has restricted the `READ_SMS` permission to default SMS/dialer apps since 2019, so that approach isn't shippable as a public app.

---

## Does bank linking actually work?

It's a real, working Plaid Link + consent flow — but it runs against Plaid's Sandbox, since Plaid doesn't cover Indian banks. It demonstrates the complete pattern end to end against test institutions (`user_good` / `pass_good`), ready to point at a production provider like Setu or OneMoney under India's Account Aggregator framework.

---

## What's the actual stack?

React 19 + Vite + TypeScript + Tailwind + shadcn/ui + TanStack Router on the frontend; Node/Express on the backend; Firebase Auth + Firestore for auth and data; Plaid and the Gmail API for integrations; Docker + Nginx + a real Jenkins CI/CD pipeline for deployment.

---

## Why Firestore instead of PostgreSQL?

Realtime `onSnapshot` listeners let the dashboard reflect new detections and reminders live without polling, and Firebase Auth plus per-user Firestore security rules handle authorization without standing up a separate auth service.

---

## What does the CI/CD pipeline actually do?

A real Jenkins pipeline: Checkout → Install Dependencies → Lint → Unit Tests → Build Docker Image → Trivy security scan (HIGH/CRITICAL) → Push Docker Image → Deploy to Firebase (functions + hosting) → Verify Deployment. The deploy stages are gated to `main`.

---

## Is the AI extraction real or just described?

It's implemented and tested (`backend/src/services/ai.js`) — a second detection pass that hands unparseable emails to Claude with a strict JSON schema. It's off by default because it needs an Anthropic API key and I didn't want it running against a personal budget indefinitely.

---

## What's the biggest limitation you're upfront about?

UPI-only payments. If a subscription is paid entirely through UPI and the merchant never sends a billing email — only an in-app notification — it's invisible to Gmail-based detection. Not a bug in the heuristics; there's nothing in the inbox to read.

---

## Can I actually try it?

Yes — [subscription-hub-19cf9.web.app](https://subscription-hub-19cf9.web.app). Sign up with any email; bank linking runs against Plaid Sandbox and Gmail scanning is limited to registered test users, but manual tracking, the calendar, reminders, and the cancellation guide all work exactly as they would in production.

---

## Did you build this alone?

Yes — solo, end to end: frontend, backend, integrations, CI/CD, and deployment.

---

## What would you improve today?

Per-inbox spending breakdowns, a real Setu Account Aggregator integration for India-native bank linking, and promoting the Claude extraction pass from optional to default.
