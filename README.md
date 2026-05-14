# Advanced React Development

**Version:** 2.0.0 (May 2026)
**Author:** Chris Minnick · WatzThis

Unified repo for the **3-day Advanced React Development course**. Holds:

- The **courseware** (slides, lab manual, instructor notes, decisions docs)
- The **lab projects** (per-lab self-contained starters + reference solutions + Module 3 demos)
- The **VM provisioning guide** for the training company

## Repo layout at a glance

```
lab-files/          per-lab self-contained starters (lab-01/ … lab-08/)
demos/              Module 3 in-class demos (routing-demo + my-next-app + my-next-routing-demo)
solutions/          per-lab reference solutions (lab-01-modernize/, lab-02-rr-v7/, …)
setup-check/        pre-Day-1 environment check (npm run check)
instructor/         decks + speaker notes + setup docx
labs/               lab handouts (Lab0N-*.md) + instructor notes + exemplars
student/            consolidated student manual
scripts/            repo-maintenance scripts (e.g., restructure-cleanup.{sh,ps1})
AGENTS.md / CLAUDE.md  project context for AI assistants
LAB-VM-SETUP.md     training-company VM provisioning guide
```

There are no feature branches in this version of the course.
Per-lab folders trade disk space for "no debugging anyone's git."

## Course materials

| What                                                     | Where                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Course outline (v2.0)                                    | `instructor/Advanced-React-Course-Outline-v2.docx`                           |
| Lab manual (consolidated 8 labs)                         | `instructor/advanced-react-labs-v2.docx`                                     |
| Combined slide deck                                      | `instructor/advanced_react_v2.pptx`                                          |
| Per-module decks                                         | `instructor/modules/Module01-* … Module10-*.pptx`                            |
| Per-lab markdown + instructor notes + solution exemplars | `labs/Lab01-* … Lab08-*.md`                                                  |
| Marketing course description                             | `Advanced-React-3-Day-CourseDescription-v2.docx`                             |
| Optional pre-work doc                                    | `Advanced-React-Pre-Work-v2.docx`                                            |
| Student setup guide (covers what's installed on the VM)  | `instructor/Advanced-React-setup-v2.docx`                                    |
| Training-company VM provisioning guide                   | `LAB-VM-SETUP.md`                                                            |
| Locked design decisions                                  | `PROPOSAL-2026-Update.md`, `LAB-REPO-UPGRADE-PLAN.md`, `DRY-RUN-FINDINGS.md` |
| AI-assistant conventions for the codebase                | `AGENTS.md`                                                                  |

## Lab files

| Lab | Folder              | What's in it                                                                                  |
| --- | ------------------- | --------------------------------------------------------------------------------------------- |
| 1   | `lab-files/lab-01/` | `real-time-chat/` (legacy CRA chat) + `social-media/server` (auth)                            |
| 2   | `lab-files/lab-02/` | `social-media-rr-v7/` + `social-media-nextjs/` + `social-media/server`                        |
| 3   | `lab-files/lab-03/` | `social-media-rr-v7/` (with bloated AppContext to refactor) + `social-media/server`           |
| 4   | `lab-files/lab-04/` | `social-media-rr-v7/` (Lab 3 Zustand state) + `social-media/server`                           |
| 5   | `lab-files/lab-05/` | `server-components-dashboard/` (standalone)                                                   |
| 6   | `lab-files/lab-06/` | `social-media-rr-v7/` (with seeded perf problems) + `social-media/server` (with tag stamping) |
| 7   | `lab-files/lab-07/` | `social-media-rr-v7/` (Lab 4 TanStack Query) + `social-media/server`                          |
| 8   | `lab-files/lab-08/` | `social-media-rr-v7/` (Lab 7 tests) + `social-media/server`                                   |

Each lab folder is **self-contained** — its own copy of every project
the lab needs, with whatever modifications the lab assumes (e.g., the
Lab 6 backend stamps mock tags onto every post). Cost: disk space.
Benefit: no branch-and-merge debugging during class.

## Solutions

Per-lab reference solutions live under `solutions/`:

| Lab | Solution folder(s)                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `solutions/lab-01-modernize/`                                                                                                                   |
| 2   | `solutions/lab-02-rr-v7/`, `solutions/lab-02-nextjs/`                                                                                           |
| 3   | `solutions/lab-03-zustand/`, `solutions/lab-03-jotai/`, `solutions/lab-03-rtk/`, `solutions/lab-03-baseline/` (the seeded "bad" starting state) |
| 4   | `solutions/lab-04-tanstack-query/`, `solutions/lab-04-stretch/` (infinite scroll)                                                               |
| 5   | `solutions/lab-05-dashboard/`, `solutions/lab-05-streaming/`                                                                                    |
| 6   | `solutions/lab-06-perf/`, `solutions/lab-06-baseline/`                                                                                          |
| 7   | `solutions/lab-07-tests/`, `solutions/lab-07-stretch/` (Playwright e2e)                                                                         |
| 8   | `solutions/lab-08-exemplar/` (Reactions feature, capstone reference)                                                                            |

Each solution folder has a `README.md` explaining what it changes from
the matching lab's starter.

## Demos

Module 3 in-class demos live under `demos/`:

- `demos/routing-demo/` — RR v7 data router (loaders, actions, error boundaries)
- `demos/my-next-app/` — Next 15 basics (Server Components + Client islands + Server Actions)
- `demos/my-next-routing-demo/` — Next 15 routing primitives (nested layouts, dynamic segments, loading.js, error.js)

Each demo's README has a 5–7 minute instructor tour.

## Running the course

Each lab is self-contained — open `lab-files/lab-NN/` and follow the
handout in `labs/Lab0N-*.md`. The handouts include the exact terminal
commands to start the backend, the client, and (where relevant) the
chat server.

Pre-Day-1 environment check (everyone runs this before they touch
anything else):

```bash
cd setup-check
npm run check
```

## Conventions

- **React 19, JS-first, framework-neutral.** All starters use plain
  JavaScript, not TypeScript. Modules cover both Next.js 15 and
  React Router v7 framework mode.
- **Exact version pinning.** Lab project `package.json`s pin major +
  minor (e.g., `19.0.0`, not `^19.0.0`) for reproducibility across
  cohorts.
- **AI-friendly conventions.** `AGENTS.md` (and the Claude-specific
  `CLAUDE.md` pointer) at the repo root describes the stack, the do's
  and don'ts, and where new code goes. Module 9 + Lab 8 explicitly
  reference this file.
- **No feature branches.** Per-lab folders, per-lab solutions. If a
  student falls behind, the next lab's folder is a clean restart.

## What was retired in v2.0 (vs v1.3.0)

- Original top-level project folders moved into `lab-files/lab-NN/`
  and `demos/`. The old top-level copies are gone — see
  `scripts/restructure-cleanup.sh`.
- Feature branches and branch-materialization scripts. Replaced by
  per-lab folders.
- `react_ssr_example/` — React 16 + Webpack SSR demo. Replaced by
  Server Components content in Module 6.
- `server-components-demo/` — pre-release RSC channel + custom
  bundler. Replaced by `lab-files/lab-05/server-components-dashboard/`.
- `setup-test/` — v1 setup verifier. Replaced by `setup-check/`.
- `solutions/microfrontend/` — Single-SPA. Micro-frontends cut from
  v2.0 entirely.

If you need any of these for legacy reference, the v1.3.0 tip lives in
git history.

## Revision history

| Version       | Date      | Notes                                                                                                                                                                                                                 |
| ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0 – v1.3.0 | 2023–2024 | Original three-day course. React 18, CRA, plain Redux, Single-SPA.                                                                                                                                                    |
| v2.0          | May 2026  | Full overhaul. React 19, Server Components, the React Compiler, AI-assisted dev thread, Vitest/RTL/MSW testing module. Course rebalanced to 54% hands-on. Repo restructured to per-lab folders (no feature branches). |

See `PROPOSAL-2026-Update.md` for the full v1 → v2 design rationale.
