# sec-labs
A gamified, hands-on self-study platform for **CompTIA Security+ (SY0-701)**.

sec-labs doesn't host VMs or run anything for you. It gives you clear lab
directives, curated free resources, and exam-mapped reflection prompts — then
tracks your progress with a tool-like dark interface and a little bit of game
feedback. You build the labs yourself; sec-labs is the guide and the scoreboard.

## What's inside

- **5 domains, 30 hands-on labs** — every SY0-701 domain, 6 exercises each,
  each mapped to a specific exam objective.
- **90-question practice exam** — full SY0-701-weighted mock exam with a 90-minute
  countdown timer. Questions are randomized on every load to prevent pattern
  memorization. Auto-submits on timeout. Includes per-domain score breakdown,
  pass/fail result, and a full review mode with explanations. Practice Mode lets
  you skip the timer and see explanations immediately after each answer.
- **Domain progress rings** — thin SVG arcs that fill as you complete labs,
  visible on the dashboard at all times.
- **Sequential unlocks** — finish a lab to open the next one in its domain.
- **XP + readiness** — 50 XP per lab, 200 XP for your first exam pass, an overall
  exam-readiness percentage, and a "continue where you left off" jump to your
  next lab.
- **Exam attempt history** — your last 3 practice exam attempts (score + date)
  are persisted locally so you can track improvement over time.
- **Local-first** — progress lives in `localStorage`. No accounts, no backend.
  Reset anytime from Settings.

## Stack

- React + Vite
- React Router v6
- Tailwind CSS
- `localStorage` for persistence

## A note on ethics

Every lab is for **authorized, educational use only**. Only ever test systems
and accounts you own or have explicit written permission to test. The offensive
exercises (scanning, phishing simulation, malware triage) deliberately use
isolated VMs, host-only networks, the EICAR test string, and addresses you
control.
