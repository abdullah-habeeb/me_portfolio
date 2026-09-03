# Abdullah's Portfolio

**Live: [me-portfolio-flax.vercel.app](https://me-portfolio-flax.vercel.app)**

A portfolio designed as an engineering workspace, not a scrolling page — because that's a more honest medium for a software engineer's work than a slideshow.

## Design

The whole site is a single-page IDE: a file explorer on the left, tabbed content in the center, and an AI assistant panel on the right. Every section — About, Projects, Research, Skills, Resume, Contact — is a "file" you open, browsed exactly like a codebase.

- **Explorer + tabs + breadcrumbs** — real IDE chrome, not a metaphor bolted onto a normal layout
- **Command palette** (`Ctrl/Cmd + K`) — fuzzy-search and jump to any section instantly
- **"Ask Abdullah" AI panel** — a Gemini-backed assistant grounded only in this site's actual content, with per-section context and quick-action prompts
- **Terminal tab** — a simulated shell (`cat`, `ls`, `whoami`, etc.) as an easter egg into the same content
- **Live GitHub stats** — project cards pull real star/fork counts and last-updated dates from the GitHub API
- **Light/dark theme toggle** with a distinct indigo-based palette and Space Grotesk type — built to look like nothing else, not a reskinned template

## Stack

React 19 · TanStack Start (SSR) + TanStack Router · Tailwind CSS v4 · Framer Motion · Vercel AI SDK (Google Gemini) · TypeScript · Vercel

## Structure

```
build-browser-main/   the site (TanStack Start app)
chat/                 markdown knowledge base the AI assistant is grounded in
backend/              standalone FastAPI reference implementation (unused in production)
```

## Run locally

```bash
cd build-browser-main
npm install
npm run dev
```
