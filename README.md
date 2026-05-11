# Advanced React Development

**Version:** 2.0.0 (May 2026)
**Author:** Chris Minnick · WatzThis

Unified repo for the **3-day Advanced React Development course**. Holds both:

- The **courseware** (slides, lab manual, instructor notes, decisions docs)
- The **lab projects** (starters, demos, solutions) students clone

## Course materials

| What | Where |
|---|---|
| Course outline (v2.0) | `instructor/Advanced-React-Course-Outline-v2.docx` |
| Lab manual (consolidated 8 labs) | `instructor/advanced-react-labs-v2.docx` |
| Combined slide deck (279 slides) | `instructor/advanced_react_v2.pptx` |
| Per-module decks | `instructor/modules/Module01-* … Module10-*.pptx` |
| Per-lab markdown + instructor notes + solution exemplars | `labs/Lab01-* … Lab08-*.md` |
| Marketing course description | `Advanced-React-3-Day-CourseDescription-v2.docx` |
| Optional pre-work doc | `Advanced-React-Pre-Work-v2.docx` |
| Student setup guide | `instructor/Advanced-React-setup-v2.docx` |
| Locked design decisions | `PROPOSAL-2026-Update.md`, `LAB-REPO-UPGRADE-PLAN.md`, `DRY-RUN-FINDINGS.md` |

## Lab projects

Top-level project folders, in the order labs use them:

| Folder | Lab(s) | Status |
|---|---|---|
| `setup-check/` | Pre-Day-1 verification | NEW — scaffolded for v2.0 |
| `real-time-chat/` | Lab 1 (modernize) | Inherited from v1.3.0 — needs CRA→Vite migration; class components stay |
| `social-media/` | Backend for Labs 2-7 | Inherited — needs Express 5 / Mongoose 8 / dual CORS bump |
| `social-media-rr-v7/` | Labs 2, 3, 4, 6, 7 | NEW — RR v7 framework mode, pre-Lab-2 starter |
| `social-media-nextjs/` | Lab 2 (Part B port) | NEW — Next.js 15 App Router, pre-Lab-2 starter |
| `server-components-dashboard/` | Lab 5 | NEW — Next.js 15 + RSC stub with mock data |
| `routing-demo/` | Module 3 demos | Inherited — needs RR v7 upgrade |
| `my-next-app/` | Module 3 demos | Inherited — needs Next.js 15 upgrade |
| `my-next-routing-demo/` | Module 3 demos | Inherited — needs Next.js 15 upgrade |
| `solutions/` | Reference solutions | Inherited; will be reorganized — see "Solution branches" below |

## Solution branches (planned)

Per-lab solutions are tracked on dedicated git branches under the `solution/` prefix. Each branch starts from `main` and adds the deliberately-missing parts of its lab. As of v2.0:

| Branch | Status |
|---|---|
| `solution/lab-01-modernize` | Planned — modernized chat app + AI-review exemplar |
| `solution/lab-02-rr-v7` | Planned — auth flow in RR v7 |
| `solution/lab-02-nextjs` | Planned — auth flow in Next.js |
| `solution/lab-03-zustand` | Planned — state refactor with Zustand |
| `solution/lab-03-jotai` | Planned — state refactor with Jotai |
| `solution/lab-03-rtk` | Planned — state refactor with RTK |
| `solution/lab-04-tanstack-query` | Planned — TanStack Query migration |
| `solution/lab-04-stretch` | Planned — infinite-scroll feed |
| `solution/lab-05-dashboard` | Planned — Server Components dashboard |
| `solution/lab-05-streaming` | Planned — multi-Suspense streaming |
| `solution/lab-06-perf` | Planned — profile + optimize |
| `solution/lab-07-tests` | Planned — Vitest/RTL/MSW + AI-review |
| `solution/lab-07-stretch` | Planned — Playwright e2e |
| `solution/lab-08-exemplar` | Planned — Reactions feature (capstone exemplar) |

The directory `solutions/` (singular plural) is the v1.3.0 holdover. It contains older solution code we can mine when seeding the v2 solution branches.

## What was retired in v2.0 (vs v1.3.0)

- `react_ssr_example/` — old React 16 + Webpack SSR demo. Replaced by Server Components content in Module 6.
- `server-components-demo/` — used the pre-release RSC channel + custom bundler. Replaced by `server-components-dashboard/` (Next.js 15-based).
- `setup-test/` — the v1.3.0 setup verifier. Replaced by `setup-check/`.
- `solutions/microfrontend/` — Single-SPA. Micro frontends cut from v2.0 entirely.

If you need any of these for legacy reference, the v1.3.0 tip is permanent in git history (`git log --all` to find).

## Running the course

Day-of:

```bash
# Backend (Lab 2 onwards)
cd social-media/server && npm install && npm start

# RR v7 client (Labs 2-7)
cd social-media-rr-v7 && npm install && npm run dev

# Next.js client (Lab 2 Part B onwards)
cd social-media-nextjs && npm install && npm run dev

# Server Components dashboard (Lab 5)
cd server-components-dashboard && npm install && npm run dev
```

The labs walk students through each step. The student-facing instructions live in `labs/Lab0N-<feature>.md`.

## Conventions

- **React 19, JS-first, framework-neutral.** All starters use plain JavaScript, not TypeScript. Modules cover both Next.js 15 and React Router v7 in framework mode.
- **Exact version pinning.** All starters pin major + minor (e.g., `19.0.0`, not `^19.0.0`) for reproducibility across cohorts.
- **AI-friendly conventions.** Each starter has a README explaining what's intentionally there and what's intentionally missing. Module 9 covers project-context patterns (`AGENTS.md`).

## Revision history

| Version | Date | Notes |
|---|---|---|
| v1.0 — v1.3.0 | 2023–2024 | Original three-day course. React 18, CRA, plain Redux, Single-SPA. |
| v2.0 | May 2026 | Full overhaul. React 19, Server Components, the React Compiler, AI-assisted dev thread, Vitest/RTL/MSW testing module. Course rebalanced to 54% hands-on. |

See `PROPOSAL-2026-Update.md` for the full v1 → v2 design rationale.
