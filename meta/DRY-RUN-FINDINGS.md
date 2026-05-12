# Dry-run findings — Advanced React v2.0

**Audit date:** May 2026

**Method:** Independent fresh-eyes audit by a second pass over the proposal, lab repo upgrade plan, and all 8 student-facing labs. Cross-references and time math verified.

This is the punch-list of things to fix before the first delivery of the course. It's organized by severity. The "Critical" items will trip students or break promises. "Should fix" items will create small confusion. "Nice to fix" items are polish.

---

## Critical — fix before first delivery

### C1. Lab time totals overshoot the proposal's budget by ~1 hour

**Problem.** The eight labs sum to **675 minutes (11.25 hrs)** of hands-on time, but the proposal's at-a-glance table promises **10.25 hrs**. Per-day breakdown:

| Day | Labs | Actual | Promised |
|---|---|---|---|
| 1 | 90 + 105 | 195 min (3.25 hrs) | 3.25 hrs ✓ |
| 2 | 90 + 75 + 75 | 240 min (4.0 hrs) | 3.5 hrs ✗ |
| 3 | 75 + 75 + 90 | 240 min (4.0 hrs) | 3.5 hrs ✗ |

With 3.25 hrs lecture on Day 2 and 3.5 hrs lecture on Day 3, the days are now 7.25 and 7.5 hours of pure instruction — leaving zero room for breaks, lunch, transitions, or Q&A.

**Fix.** Either:
- **Option A:** Trim 30 min from Day 2 (drop Lab 4 from 75→60 OR Lab 5 from 75→60) and 30 min from Day 3 (drop Lab 6 from 75→60 OR Lab 8 from 90→75). Most realistic candidate: shorten Lab 6 to 60 min by removing one of the eight optimization options.
- **Option B:** Update the proposal's at-a-glance table to reflect actual lab time (4.0/4.0 hrs Day 2 + 3) and re-balance the lecture content downward to fit a 7-hour day.

Recommended: Option A. Trim labs, keep the 50%+ hands-on commitment, keep daily totals manageable.

### C2. The proposal's Day 1 header contradicts its at-a-glance table

**Problem.** `PROPOSAL-2026-Update.md` line 79 reads "Day 1 — Foundations for 2026 (~3.25 hrs lecture / ~3.5 hrs lab)" — but Day 1 labs total 195 min (3.25 hrs), and the table on line 211 correctly says 3.25 hrs.

**Fix.** Change line 79 to "(~3.25 hrs lecture / ~3.25 hrs lab)" to match the table.

### C3. Labs 3, 4, 6, 7 break continuity from prior lab work

**Problem.** Each lab tells students to `git checkout main && git pull` before branching off — but the prior lab's work is on a feature branch (`lab02/...`, `lab03/...`, etc.) that's never merged to main. Students lose all the work from the previous lab.

Specific instances:
- Lab 3, line 53: `git checkout main && git pull` after Lab 2
- Lab 4, line 50 (inferred): same pattern
- Lab 6, line 56: `git checkout main && git pull` after Lab 5
- Lab 7, line 40 (inferred): same pattern

**Fix.** Two options:
- **Option A:** Each lab branches off the prior lab's branch (e.g., `git checkout lab03/<your-name>-<tool> && git checkout -b lab04/<your-name>-tanstack-query`).
- **Option B:** Each lab tells students to start from a known clean reference branch (e.g., `solution/lab-03-zustand`).

The labs already mention Option B as a fallback ("or the `solution/lab-03-zustand` branch if you want a clean baseline"), but they make `git checkout main` the primary path, which is wrong. Make Option B (or A) the primary instruction.

---

## Should fix — small inconsistencies that will trip students

### S1. Slide-number references in labs are brittle

**Problem.** Several labs reference specific slide numbers in module decks. Slide numbers shift on every deck edit:

- Lab 1, line 123: "Module 2 to 'AI hook mistakes — your review checklist' (slide 33)"
- Lab 3, line 92: "slide 24 of Module 4"
- Lab 5, line 379: "the composition pattern from Module 6 (slide 11)"
- Lab 8, line 209: "Module 9's review checklist (slide 25)"

**Fix.** Replace slide numbers with named anchors. For example, "Module 2's 'AI hook mistakes — your review checklist' slide" — readers can find it by name.

### S2. Lab 7 setup uses `src/` paths but RR v7 framework mode uses `app/`

**Problem.** Lab 7 line 67 creates `src/test/setup.js` and similar `src/...` paths throughout. The `social-media-rr-v7/` project uses `app/` not `src/` (per RR v7 framework-mode convention). Lab 4 correctly uses `app/main.jsx`, `app/routes/home.jsx`.

**Fix.** Replace all `src/test/...` paths in Lab 7 with `app/test/...`.

### S3. Lab 7 Vitest setup overwrites the project's Vite config

**Problem.** Lab 7 line 60 instructs students to write a new `vite.config.js` with `vitest/config` defineConfig. This overwrites the existing RR v7 starter's plugin config and dev-server settings.

**Fix.** Either tell students to merge into the existing `vite.config.js`, OR use a separate `vitest.config.js` (Vitest will auto-detect it).

### S4. Lab 2 solution exemplar uses `.ts` files

**Problem.** The locked decision (per `decisions.md` and `LAB-REPO-UPGRADE-PLAN.md`) is **JS-first throughout**. But Lab 2's solution exemplar (`Lab02-Solution-Exemplar.md`) shows files like `routes.ts` and `session.server.ts`. RR v7 framework mode defaults to TS, but our convention says JS.

**Fix.** Rename `.ts` files to `.js` in the solution exemplar. Adjust the type imports accordingly.

### S5. Version pinning is unstated in lab install commands

**Problem.** The upgrade plan locks **exact versions** (`19.0.0`, not `^19.0.0`) for reproducibility. Labs install with commands like `npm install @tanstack/react-query` (no version), risking drift to a future incompatible release.

**Fix.** Either pin versions in install commands (`npm install @tanstack/react-query@5.x`) or commit a `package-lock.json` per starter and tell students to rely on it.

---

## Nice to fix — polish

### N1. Lab 5's `FilterToggle` snippet uses an undefined `FilterContext`

**Problem.** Lab 5 lines 369-371 reference `<FilterContext.Provider value={completedOnly}>` but the snippet never creates `FilterContext`. Students who copy verbatim will get a `ReferenceError`.

**Fix.** Add `import { createContext } from 'react';` and `const FilterContext = createContext(false);` to the snippet, OR remove the `<FilterContext.Provider>` wrapper since the lab text already says filtering doesn't actually happen in this version.

### N2. Lab 6 cites the wrong Vite plugin name

**Problem.** Lab 6 line 96: "If you have `vite-plugin-visualizer` or similar installed". The actual package is `rollup-plugin-visualizer` (it has a Vite preset).

**Fix.** Rename to `rollup-plugin-visualizer`.

### N3. Lab 8 backlog redundant with `lab-backlog/` folder

**Problem.** The lab repo upgrade plan (Phase H4) promises a `lab-backlog/` folder with feature specs for Lab 8. Lab 8 then inlines its own A-H backlog (lines 60-79) rather than pointing students at the folder.

**Fix.** Pick one source of truth. Either move the inline backlog into the `lab-backlog/` folder and have Lab 8 link to it, or remove the `lab-backlog/` folder from Phase H4 since it's not needed.

### N4. Lab 1 `useOptimistic` snippet doesn't show transition wrapping

**Problem.** Lab 1 lines 173-188: the stretch task shows `useOptimistic` used inside an `async function handleSend`. The snippet implies it'll be the form's `action={handleSend}` — but doesn't show that explicitly. Students who try `<button onClick={() => handleSend(...)}>` will see the optimistic value flicker because it's not inside a transition or action context.

**Fix.** Add a one-line note: "Wire this as `<form action={handleSend}>` so React treats it as a transition."

### N5. Lab 1 wording precision

**Problem.** Lab 1 line 99: "broke socket event handler cleanup, leading to multiple subscriptions per render." Effects don't run on every render — they run on initial render and on re-renders when deps change.

**Fix.** Replace "per render" with "per re-render" or "across re-renders."

### N6. Lab 5 Server Action import path may be wrong for the starter

**Problem.** Lab 5 line 265 imports `from '@/app/actions/tasks'`. Whether this resolves correctly depends on `tsconfig`/`jsconfig` paths in `server-components-dashboard/`. Conventional Next.js setup uses `@/actions/tasks` (the `@/` alias maps to the project root or `src/`).

**Fix.** Verify against the actual `server-components-dashboard/` starter when the lab repo upgrade is executed. Adjust import paths once paths config is locked.

---

## Verified clean

These were checked and found consistent:

- **Tool/library version drift.** All labs reference React 19, RR v7 framework mode, Next.js 15, TanStack Query v5, Vitest, MSW v2 syntax consistently. No leftover RR v6 / Next.js Pages Router / Jest references.
- **Folder naming consistency.** Five canonical starter folders (`real-time-chat`, `social-media-rr-v7`, `social-media-nextjs`, `server-components-dashboard`, `social-media/server`) used identically across all labs and the upgrade plan.
- **Solution branch naming.** All labs use the `solution/lab-NN-<variant>` convention.
- **Module numbering.** Labs reference Module N consistently with the deck file naming (Module 1=Welcome, 2=Hooks, 3=Routing, 4=State, 5=Data Fetching, 6=Server Components, 7=Performance, 8=Testing, 9=AI, 10=Production).
- **Narrative continuity.** Each lab builds plausibly on the prior — once the C3 branching issue is fixed.
- **Daily lecture totals.** Lecture math is correct: 3 hrs + 3.25 hrs + 3.5 hrs = 9.75 hrs (matches the proposal table).

---

## Summary

- **3 critical issues** to fix before delivery (lab budget, header inconsistency, branch continuity)
- **5 should-fix issues** (slide refs, Lab 7 paths, Vitest config, .ts files, version pinning)
- **6 nice-to-fix issues** (FilterContext, plugin name, backlog redundancy, useOptimistic note, wording, import path)

Effort to address all critical + should-fix: ~2-3 hours. Recommended sequence:

1. Decide on the lab-budget approach (Option A trim vs Option B re-budget).
2. Fix C1, C2, C3 across the proposal and labs.
3. Sweep S1–S5 (mostly find-and-replace).
4. Polish the N items as time permits.

Once fixed, the course is shippable.
