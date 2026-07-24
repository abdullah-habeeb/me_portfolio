# Renewly

**Every subscription. One quiet place.**

Full-Stack • Fintech • DevOps

GitHub: https://github.com/abdullah-habeeb/renewly-subscription-tracker
Live: https://subscription-hub-19cf9.web.app

---

# Overview

Renewly is a full-stack subscription tracker that reconstructs your recurring charges automatically instead of asking you to enter them by hand. It connects to Gmail read-only, reads the payment receipts and bank-alert emails already sitting in your inbox, works out what you're actually paying for, tracks the running monthly and yearly cost, and emails you before the next renewal lands.

It's a complete system built end to end for this project: a React SPA, an Express detection engine, real Gmail and bank integrations, a scheduled reminder system, and a deployment that costs nothing to keep running. It's also built India-first — currency, locale, and the entire detection strategy are shaped around how Indian banks and UPI actually notify you of a charge, not retrofitted from a product built for someone else's banking system.

---

# The Problem

A subscription is ₹499 here, ₹1,950 there, an annual plan agreed to eleven months ago and forgotten the moment the tab closed. Each one is too small to notice on its own, until a bank statement adds them all up in a number you didn't see coming. Renewly does that adding-up first, so cancelling becomes a decision made on purpose, not a charge discovered by accident three months later.

---

# Solution

Renewly scans linked Gmail inboxes (read-only OAuth) for bank alerts and payment receipts, parses MIME/HTML and filters out marketing mail so a promotion is never mistaken for a real charge, then merges duplicate detections across multiple linked inboxes into a single subscription entry. A weekly background re-scan picks up anything new and emails a digest. Bank linking through Plaid Sandbox demonstrates the same consent-based Link flow used by apps like Mint. A renewal calendar, `.ics` export, curated cancellation guides (including the UPI Autopay mandate reminder most guides miss), and configurable email reminders round out the product surface. An optional second detection pass hands emails the regex heuristics can't parse to Claude with a strict JSON schema — implemented and tested, but disabled by default rather than run against a personal API budget.

---

# Architecture

React 19 SPA (TanStack Router, Tailwind 4, shadcn/ui)

↓ realtime `onSnapshot`

Cloud Firestore

↓ Bearer Firebase ID token

Express REST API

↓

Detection Engine (heuristics + optional Claude) · Gmail API (read-only OAuth) · Plaid (Link + recurring-transactions)

↓

Reminder Cron Job (daily 08:00 IST) → Nodemailer / Gmail SMTP

The frontend talks to Firestore directly for realtime CRUD; the Express engine owns everything that needs server-side secrets — OAuth flows, inbox scanning, Plaid token exchange, and the reminder mailer. Firebase ID tokens authenticate every API call.

---

# Core Capabilities

- Automatic detection from Gmail — read-only OAuth scan of bank alerts and receipts, with MIME parsing, HTML stripping, and marketing-mail filtering
- Multiple linked inboxes, deduped into one subscription entry per charge
- Weekly incremental background re-scan with an email digest of anything new
- Price-change alerts — a scan sees a different billed amount, dashboard flags it, tracked figure only changes with explicit approval
- Bank linking via Plaid Sandbox (Link + consent flow)
- Renewal calendar with one-click `.ics` export
- Curated cancellation guides for 12+ major services
- Configurable email reminders before each renewal
- "Till date" — set an end date on a subscription; Renewly asks permission before retiring it rather than deleting silently
- Optional AI extraction pass (Claude, structured outputs) for emails regex can't parse
- Full auth: email/password + Google sign-in, password reset, per-user Firestore security rules enforced server-side

---

# Technology Stack

Frontend

- React 19, Vite 8, TypeScript
- Tailwind CSS 4, shadcn/ui
- TanStack Router (file-based SPA)
- Recharts

Backend

- Node.js, Express
- Firebase Admin SDK

Auth & Database

- Firebase Authentication
- Cloud Firestore (realtime)

Integrations

- Plaid (Link + recurring-transactions API)
- Gmail API (OAuth 2.0, `gmail.readonly`)
- Anthropic Claude API (optional, structured outputs)
- Nodemailer over Gmail SMTP, node-cron

Testing

- Jest (backend), Vitest (frontend) — 113 tests passing (68 + 45)

Infrastructure

- Docker, Docker Compose (Nginx-served frontend proxying `/api` to the backend)
- Jenkins CI/CD
- Firebase Hosting (frontend) + Render (backend) + cron-job.org (scheduled triggers)

---

# CI/CD Pipeline

A real Jenkins pipeline, not a demo one: Checkout → Install Dependencies → Lint (ESLint) → Unit Tests → Build Docker Image → Security Scan (Trivy, HIGH/CRITICAL) → Push Docker Image → Deploy to Firebase (functions + hosting) → Verify Deployment. The build/push/deploy/verify stages only run on `main`.

---

# Engineering Decisions

Why Gmail instead of reading bank SMS directly?

For an Indian user, Gmail is the closest thing to a real-time transaction feed available without a business registration — most Indian banks email a receipt for nearly every card charge. A native app reading bank SMS would close the UPI gap, but Google Play has restricted the `READ_SMS` permission to default SMS/dialer apps since 2019, making that approach unshippable as a public app.

Why does bank linking stay in Plaid Sandbox?

Plaid has no coverage in India — it's built for US/EU banks — so every connection here runs against Sandbox with test institutions. India's real equivalent is the RBI-regulated Account Aggregator framework (a licensed intermediary like Setu or OneMoney). Going live on either rail requires a registered business entity and formal compliance review, out of scope for a project built and maintained by one person. What ships instead is the complete pattern end to end — Link modal, consent flow, recurring-transaction detection — proven against real Sandbox data and ready to point at a production provider.

Why is AI extraction built but off by default?

The Claude fallback pass is fully implemented and tested (`backend/src/services/ai.js`) but requires an API key and stays dormant rather than running against a personal budget indefinitely.

Why Firebase over a self-hosted database?

Realtime Firestore listeners let the SPA reflect scan results and reminders live without polling, and Firebase Auth plus per-user security rules handle authorization without a separate auth service.

---

# Challenges

- Deduping the same subscription detected across multiple linked Gmail inboxes
- Filtering marketing/promotional email out of the same inbox real receipts live in
- Reconstructing recurring charges from unstructured bank-alert emails, not a structured ledger
- Keeping Plaid Sandbox and Gmail Testing-mode constraints honest in the product rather than hidden
- Running a scheduled reminder job reliably on a free-tier backend that sleeps when idle

---

# Limitations (documented, not accidental)

- UPI-only payments often generate no email at all, so they're invisible to Gmail-based detection — a real gap, not a detection-quality issue
- Gmail OAuth app runs in Google's Testing mode: capped at 100 external users, each linked account needs reconnecting roughly every 7 days, because passing Google's verification for restricted scopes requires a multi-week review plus an annual paid security assessment
- Render's free-tier backend sleeps after ~15 minutes idle; a keep-alive cron job largely mitigates this but a cold start is still possible on first visit

---

# Future Work

- Per-inbox spending breakdown across linked Gmail accounts
- Setu Account Aggregator integration — India-native bank linking through the RBI-regulated AA network
- Promote Claude-based extraction from optional to default once there's an API budget
