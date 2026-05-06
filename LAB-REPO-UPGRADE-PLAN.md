# Lab Repo Upgrade Plan — github.com/chrisminnick/advanced-react

**Target:** v2.0.0 (May 2026)
**Current:** v1.3.0 (August 2024 per repo README, March 2024 per courseware)

---

## Audit of current repo

The current `main` branch contains ten top-level directories. Here's how each maps to the v2.0 plan.

| Folder | Current state | Used by v2.0? | Action |
|---|---|---|---|
| `real-time-chat/` (client + server) | React 18 + CRA + RR 6 + Socket.io + Mongoose 7 | **Lab 1 starter** | Keep as starter; intentionally preserve class components so Lab 1 has something to modernize. Upgrade only the server side and tooling. |
| `social-media/` (server only) | Express + Mongoose. No client. | **Labs 2-7 backend** | Keep server. Upgrade Express, Mongoose, Node target. Add CORS config that lets RR v7 *and* Next.js dev servers both call it. |
| `solutions/real-time-chat/` | Lab 1 reference solution | **Lab 1 solution** | Rebuild as a modernized React 19 / function-component / hooks version. Add a `stretch/` variant with `useOptimistic`. |
| `solutions/social-media-redux/` | React 18 + CRA + RR 6 + RTK 1.x | **Reference for Lab 3 (RTK option)** | Rebuild as Vite + React 19 + RTK 2.x + RR v7. Becomes one of three solution branches. |
| `routing-demo/` | Vite + RR 6 (already on Vite, good base) | **Module 3 in-class demos** | Upgrade to RR v7 framework mode. Keep small. |
| `my-next-app/` | Next.js (~13/14 era), React 18 | **Module 1/3/6 demos** | Upgrade to Next.js 15 with App Router. Small landing demo. |
| `my-next-routing-demo/` | Next.js (~13/14 era) | **Module 3 routing demo** | Upgrade to Next.js 15 App Router routing demo. |
| `react_ssr_example/` | React 16 + custom Webpack SSR | None | **Retire.** Move to `archive/` branch or delete. SSR is now covered by Server Components. |
| `server-components-demo/` | Pre-release React 18 RSC channel + custom bundler | None | **Retire** — the experimental RSC-by-hand demo is obsolete. Replaced by new `server-components-dashboard/` (see below). |
| `setup-test/` | "Soliloquy" backend, used for setup-check | **Optional Day 0** | Keep but rename to `setup-check/`. Update to newer Node, simplify to a single `npm run check` script. |
| `solutions/microfrontend/` | Single-SPA + Webpack 5 | None | **Retire.** Micro frontends cut from v2.0. Move to `archive/` branch. |

### What the repo is missing for v2.0

These don't exist today and need to be built:

- `social-media-rr-v7/` — React Router v7 framework-mode client for the social-media backend. Used by Labs 2-4, 6, 7.
- `social-media-nextjs/` — Next.js 15 App Router client for the same backend. Used by Lab 2 port and as comparison demo throughout Days 2-3.
- `server-components-dashboard/` — NEW Next.js 15 starter for Lab 5 (Server Components + Server Actions).
- `solutions/social-media-zustand/`, `solutions/social-media-jotai/`, `solutions/social-media-rtk/` — three Lab 3 reference solutions.
- `solutions/social-media-tanstack-query/` — Lab 4 reference solution.
- `solutions/social-media-tested/` — Lab 7 reference (Vitest + RTL + MSW + a few Playwright tests).
- `lab-backlog/` — feature spec backlog for Lab 8 (markdown specs students pick from).

---

## Branch and tag strategy

The current `main` is a working v1.3.0 tree. I recommend:

1. **Tag the current tip** as `v1.3.0-final` so the 2024 course is permanently retrievable.
2. **Cut `v2-dev`** as the working branch for the rebuild.
3. Use **`v2-dev`** until the rewrite is done; then merge to `main` and tag `v2.0.0`.
4. **Solution branches** use a convention: `solution/lab-N-<variant>` (e.g., `solution/lab-3-zustand`). This keeps the directory tree tidy — students see only starters in `main` and check out a branch for solutions, or use `solutions/` directories if you prefer the existing convention. (The current repo uses `solutions/` directories; staying with that convention is fine and is what the table above assumes.)
5. Move `react_ssr_example`, `server-components-demo`, and `solutions/microfrontend` to a long-lived `archive/v1` branch and delete from `main` so students don't get distracted.

---

## Ordered execution plan

These are sized so each is a discrete commit (or small PR). Order matters: backend first, then shared starters, then client variants, then solutions.

### Phase A — Foundation (≈1 day)

A1. Tag `v1.3.0-final` on current `main`.
A2. Cut `v2-dev` branch.
A3. Update top-level `README.md` to v2.0: new course title, new lab list, new starters/solutions table.
A4. Delete obsolete folders on `v2-dev`: `react_ssr_example/`, `server-components-demo/`, `solutions/microfrontend/`.
A5. Bump root Node target to Node 22 LTS in `.nvmrc` (or add one). Add a `.editorconfig`.
A6. Add an `AGENTS.md` at the repo root documenting conventions for AI-assisted student work — this becomes a teaching artifact in Module 9.

### Phase B — Backend prep (≈0.5 day)

B1. `social-media/server/`: upgrade to Express 5, Mongoose 8, modern bcrypt, modern jsonwebtoken. Replace `.babelrc` with native ESM if practical (target Node 22).
B2. Add CORS middleware that accepts both `http://localhost:5173` (Vite default) and `http://localhost:3000` (Next.js default) so the same backend serves both clients in Lab 2.
B3. Add a `setup-check` HTTP route to the backend so students on Day 0 can verify connectivity.
B4. Document in the server README that this is the backend for Labs 2-7; list endpoints.

### Phase C — Real-time chat (Lab 1) (≈0.5 day)

C1. `real-time-chat/server/`: upgrade socket.io, mongoose, jsonwebtoken. Smoke-test.
C2. `real-time-chat/client/`: **deliberately keep the class-component code** but migrate the build off CRA. Move to Vite while preserving the class components. This is the modernization target for Lab 1 — students need legacy React-18-on-CRA-with-class-components as the starting point.
C3. Pin React to `^18.2.0` in the `real-time-chat/client` so it deliberately *isn't* React 19 yet — the lab includes upgrading to React 19 as one of the modernization steps.
C4. Add a clear `STARTER-NOTES.md` in `real-time-chat/client` that says "this is intentionally legacy — that's the point of Lab 1."
C5. `solutions/real-time-chat/`: rebuild as the post-lab modernized version (React 19 + Vite + function components + hooks + stretch branch with `useOptimistic`).

### Phase D — Social-media RR v7 client (≈1 day)

D1. Create `social-media-rr-v7/` from a fresh `npx create-react-router@latest` (framework mode).
D2. Wire it to the social-media backend (login, signup, posts list, single post, create post).
D3. Use **plain JS** per the locked decision, with TS comments inline where they would add value.
D4. Implement only the baseline state of the app — no Redux, no TanStack Query yet, intentionally messy state for Labs 3 and 4 to clean up.
D5. Add a `LAB-MAP.md` documenting which lab does what to this codebase.

### Phase E — Social-media Next.js client (≈1 day)

E1. Create `social-media-nextjs/` from a fresh `create-next-app@latest` (App Router, JS, no TS, ESLint on).
E2. Implement the same feature set as the RR v7 client — login, signup, posts, create post.
E3. Use Next.js Middleware for the auth-protection pattern.
E4. Mirror `LAB-MAP.md` for parity with the RR v7 client.

### Phase F — Server Components dashboard (Lab 5) (≈0.5 day)

F1. Create `server-components-dashboard/` from `create-next-app@latest` (App Router).
F2. Add a small mock data layer (in-memory or SQLite — keep it lab-friendly).
F3. Pre-build one Server Component fetching data, ready for students to extend.
F4. Pre-build one Client Component for an interactive widget so students can see the boundary.
F5. Provide a stub Server Action that students will replace using `useActionState`.

### Phase G — Solutions (≈2 days)

G1. `solutions/social-media-zustand/` — Lab 3 solution with Zustand.
G2. `solutions/social-media-jotai/` — Lab 3 solution with Jotai.
G3. `solutions/social-media-rtk/` — Lab 3 solution with RTK 2.x + RTK Query.
G4. `solutions/social-media-tanstack-query/` — Lab 4 solution.
G5. `solutions/social-media-perf/` — Lab 6 solution with the three baseline optimizations applied + virtualization stretch.
G6. `solutions/social-media-tested/` — Lab 7 solution with Vitest + RTL + MSW + one Playwright e2e.
G7. `solutions/server-components-dashboard/` — Lab 5 reference, including streaming-stretch variant.

### Phase H — Demos and supporting pieces (≈0.5 day)

H1. `routing-demo/` — upgrade to RR v7 (library mode demo + framework mode demo).
H2. `my-next-app/` and `my-next-routing-demo/` — upgrade to Next.js 15.
H3. `setup-check/` — rename, upgrade, single-script verification.
H4. `lab-backlog/` — write 6-8 feature specs for Lab 8 students to pick from. Each spec is a short markdown file: title, motivation, acceptance criteria.

### Phase I — Repo-wide polish (≈0.5 day)

I1. Top-level `README.md` rewrite with the v2.0 lab map.
I2. Per-folder `README.md` files for every starter and solution.
I3. CI: a simple GitHub Action that runs `npm install` and `npm run build` on every starter/solution to catch dependency rot. (Optional but recommended — saves debugging during course delivery.)
I4. CONTRIBUTING.md or repo conventions doc.
I5. Tag `v2.0.0` on `main` after merge.

**Total estimate:** ~7-8 working days, fits inside the proposal's Phase 1+3 budget.

---

## Key technical decisions

### React 19 across the board, with one exception
Every starter and solution uses React 19 *except* `real-time-chat/client/` (the Lab 1 starter), which stays on React 18 so the upgrade-to-19 step is part of the modernization exercise. The `solutions/real-time-chat/` post-lab version uses React 19.

### Vite as the bundler default
Every non-framework starter uses Vite. Drop CRA from the entire repo. The deprecation of CRA is itself a Module 1 talking point.

### JS, not TS
Per the locked decision, all starters and solutions are plain JS. TS examples appear in the slide deck and pre-work doc, but lab code stays JS so the on-ramp is gentle for the mid-level audience.

### Single backend for two clients
The `social-media/server` backend is shared by both `social-media-rr-v7/` and `social-media-nextjs/` clients. CORS lets both dev servers connect simultaneously. Lab 2 students run all three (server + RR v7 + Next.js) at once.

### React Compiler enabled by default
Every starter has the React Compiler eslint plugin enabled. Module 7 references this directly: students see in their own labs which manual memoizations the compiler eliminates.

### Tooling pinned, not floating
Use exact versions in `package.json` (`19.0.0`, not `^19.0.0`) for starters and solutions to prevent dependency drift between cohorts. Document in CONTRIBUTING.md how to bump versions before each course delivery.

### AI-friendly repo conventions
Add `AGENTS.md` at the root and per-project. These document:
- Conventions: file naming, where state goes, how routes are structured.
- "Do not" rules: don't use `useEffect` for derived state, don't add new dependencies without asking, etc.
- Test commands and how to run them.

This is itself teachable content for Module 9.

---

## What I can do next

Pick any of these and I'll execute it locally — the workspace folder makes it easy to scaffold new starters that you can then `git add` and push. Recommended order:

1. **Scaffold `server-components-dashboard/` locally** so we have something concrete to wire Lab 5 against. Lowest blast radius — totally new code, no merge conflicts.
2. **Scaffold `social-media-rr-v7/` locally** with the baseline feature set. Becomes the workhorse client for Labs 3-4-6-7.
3. **Scaffold `social-media-nextjs/` locally** as the parallel.
4. **Write the v2.0 root `README.md` and `AGENTS.md`** so the repo's front door is correct before any commits land.

If you'd rather execute the GitHub-side mechanics first (tagging v1.3.0-final, cutting v2-dev, deleting obsolete folders), that's a 10-minute terminal session you can do directly — I'll outline the exact git commands when you're ready.
