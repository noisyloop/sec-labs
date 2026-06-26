# sec-labs

A gamified, hands-on self-study platform for **CompTIA Security+ (SY0-701)**.

sec-labs doesn't host VMs or run anything for you. It gives you clear lab
directives, curated free resources, and exam-mapped reflection prompts — then
tracks your progress with a tool-like dark interface and a little bit of game
feedback. You build the labs yourself; sec-labs is the guide and the scoreboard.

## What's inside

- **5 domains, 15 hands-on labs** — every SY0-701 domain, 3 exercises each, each
  mapped to a specific exam objective.
- **Domain progress rings** — thin SVG arcs that fill as you complete labs,
  visible on the dashboard at all times.
- **Sequential unlocks** — finish a lab to open the next one in its domain.
- **XP + readiness** — 50 XP per lab, an overall exam-readiness percentage, and a
  "continue where you left off" jump to your next lab.
- **Local-first** — progress lives in `localStorage`. No accounts, no backend.
  Reset anytime from Settings.

## Stack

- React + Vite
- React Router v6
- Tailwind CSS
- `localStorage` for persistence
- Deployed on Vercel

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Deploy to Vercel

This repo is Vercel-ready:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- `vercel.json` rewrites all routes to `index.html` so client-side routing works
  on deep links and refreshes.

From the Vercel dashboard, import the repository and accept the detected Vite
settings — no extra configuration needed. Or with the CLI:

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

## A note on ethics

Every lab is for **authorized, educational use only**. Only ever test systems
and accounts you own or have explicit written permission to test. The offensive
exercises (scanning, phishing simulation, malware triage) deliberately use
isolated VMs, host-only networks, the EICAR test string, and addresses you
control.
