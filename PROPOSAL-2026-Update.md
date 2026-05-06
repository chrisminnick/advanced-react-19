# Advanced React — 2026 Course Update Proposal

**Prepared:** May 6, 2026
**Current course version:** 1.3.0 (March 2024)
**Target version:** 2.0.0 (May 2026)

---

## Why this needs a real overhaul, not a refresh

The 2024 course was built for a React 18 world. Two big shifts have happened since:

1. **The platform changed.** React 19 shipped with Server Components, Actions, and a new set of hooks (`use`, `useActionState`, `useFormStatus`, `useOptimistic`). The React Compiler removes most of the manual memoization the current course teaches. Create React App was officially deprecated. React Router v7 absorbed Remix. Redux's role has shrunk as TanStack Query, Zustand, and Server Actions take over the jobs Redux used to do.
2. **The audience changed.** Most students sitting in this class today are using Cursor, Claude Code, Copilot, or Windsurf every day. The skill they need is no longer "type out a `useReducer` from memory" — it's "spot when the AI generated a stale closure, a missing dependency, or a Server/Client boundary violation, and fix it."

A surface-level refresh (rename Redux Thunk → RTK Query, swap React Router 6 → 7) would leave roughly half the deck obsolete by content and most of it obsolete by *mindset*. The course needs to be rebuilt around what's actually advanced in 2026.

---

## What stays, what goes, what's new

### Cut entirely
- **Class component lifecycle module** — drop to a single "you may still see this in legacy code" slide. The current course spends ~10 slides on mounting/updating/unmounting/error phases.
- **`setState` in class components** as a teaching topic.
- **Manual `useMemo` / `useCallback` / `React.memo` as a primary performance strategy** — covered briefly, but framed correctly: the React Compiler does this now; manual memoization is for the cases the compiler can't reach.
- **Plain Redux with Thunk middleware** — the createStore/combineReducers/Thunk-by-hand path. RTK is the only Redux worth teaching.
- **Single-SPA-based micro frontends as a full module** — keep micro frontends as an optional half-day topic using Module Federation in Vite, not Single-SPA. Most teams don't ship micro frontends.
- **Generic security best-practices list** (HTTPS, escape input, npm audit) — replace with React-specific 2026 concerns.

### Keep but rewrite
- **Bootstrapping** — drop the "CRA is dead" framing; teach Vite as default, plus when to reach for a framework.
- **React Router** — update to v7 (framework + library mode), drop pre-6.4 examples.
- **Performance** — restructure around React Compiler, Suspense, streaming, and measurement, not manual memoization.
- **SSR** — replace with a real Server Components + Server Actions module.
- **Hooks deep dive** — refocus on the hooks that are actually advanced: `use`, `useActionState`, `useOptimistic`, `useSyncExternalStore`, `useDeferredValue`, `useTransition`.

### Add new
- **TypeScript with React** as a baseline assumption (typed props, generics in components, discriminated unions for state).
- **React 19 features** — Actions, the form story, asset preloading, document metadata.
- **The React Compiler** — what it eliminates, when it doesn't help, the eslint plugin.
- **Server Components and Server Actions** in depth, including the client/server boundary and common mistakes.
- **Modern data fetching** — TanStack Query as the headline, SWR as the alternative, Suspense + `use()` for the React-native path.
- **State management in 2026** — a comparison module: useState/useReducer → Zustand → Jotai → Redux Toolkit/RTK Query → server state via TanStack Query. Decision framework, not advocacy.
- **Testing** — Vitest, React Testing Library, MSW for API mocking, Playwright for e2e. The current course teaches none of this.
- **AI-assisted React development** — a thread that runs through every day, plus a focused module. See below.

---

## The AI-assistant thread

This is the differentiator. Rather than tacking on a "using Copilot" appendix, AI-assisted development should be woven through every module:

- **Day 1**: Use AI to scaffold the chat-app starter; review what it generated; identify three things it got wrong and why.
- **Day 2**: Use AI to write a Server Component + Server Action. Review for boundary leaks (e.g., importing server code into a `'use client'` file).
- **Day 3**: Use AI to generate Vitest + RTL tests; evaluate whether the tests are meaningful or just exercising the implementation.

Plus one dedicated **half-module on Day 3** covering:
- What current LLMs reliably get wrong in React: stale closures, effect dependency lists, hydration mismatches, key prop misuse, server/client boundary violations, `useEffect` overuse where derived state would do.
- How to give an AI assistant useful project context (`AGENTS.md`, `CLAUDE.md`, repo conventions, lint rules).
- AI-assisted migrations (e.g., a CRA → Vite codemod, a class → function component conversion) and how to verify them.
- Reviewing AI-generated React code as a skill: a checklist students can take back to work.

---

## Course time budget — 50%+ hands-on

Across three 7-hour days (~21 hrs total, accounting for breaks and lunch), lab time must equal or exceed lecture/demo time. Target split:

- **Lecture + live demo:** ~10 hrs (≈48%)
- **Hands-on labs:** ~10.5 hrs (≈50%)
- **Wrap-up, Q&A, transitions:** ~0.5 hrs (≈2%)

To make this work, lectures stay tight and use a **"concept → 5-min live demo → substantial lab"** rhythm. Reference material that doesn't earn its time on screen moves into the slide-deck appendix and the pre-work doc.

## Proposed 3-day outline (v2.0)

Each lab below is sized to be substantial (most are 60–90 min) and includes optional "stretch" tasks for the seniors-in-the-room half of the audience.

### Day 1 — Foundations for 2026 (~3.25 hrs lecture / ~3.5 hrs lab)

**Welcome + The 2026 React Landscape (45 min, lecture)**
- React 19 in production: what changed and why it matters
- The React Compiler: what it does, what it doesn't
- Vite as default; when you actually need a framework
- Framework picks: Next.js 15, React Router v7 (framework mode), TanStack Start, Astro
- Where AI assistants fit in the modern React workflow
- TS appears inline throughout the deck — covered in pre-work, not a standalone module

**Hooks That Matter in 2026 (75 min, lecture + demos)**
- The hooks rulebook (AI assistants violate it constantly)
- `useState`, `useReducer`, `useEffect` — and when *not* to reach for `useEffect`
- The new arrivals: `use()`, `useActionState`, `useFormStatus`, `useOptimistic`
- `useSyncExternalStore`, `useDeferredValue`, `useTransition`, `useLayoutEffect`

**Lab 1: Modernize a Legacy Chat App (90 min)**
- Start: the existing class-component real-time chat app
- Convert to function components and modern hooks
- Have an AI assistant do a first pass; review, identify three things it got wrong, fix
- Stretch: add an optimistic-update message send using `useOptimistic`

**Routing with React Router v7 + Next.js Comparison (60 min, lecture + demos)**
- RR v7 library mode vs framework mode
- Next.js App Router side-by-side comparison for the same routing tasks
- Loaders, actions, layouts, nested routes
- Protected routes and auth patterns
- When TanStack Router fits better

**Lab 2: Routing + Auth in Two Frameworks (105 min)**
- Implement the same authenticated routing in RR v7 framework mode
- Then port the same feature to Next.js App Router
- Compare developer ergonomics, write a one-paragraph reflection
- Stretch: add a protected nested route with a layout that streams

### Day 2 — Data, State, and the Server (~3.25 hrs lecture / ~3.5 hrs lab)

**State Management Decision Framework (60 min, lecture + demos)**
- The decision tree: local → derived → lifted → context → store → server state
- `useState` / `useReducer` patterns and traps
- Zustand: the minimal store
- Jotai: the atomic alternative
- Redux Toolkit + RTK Query — what it's still good for
- Why "global state for everything" is no longer the default

**Lab 3: Pick-Your-Tool State Refactor (90 min)**
- Start: the social-media app with messy prop-drilling and ad-hoc context
- Pick *one* of Zustand, Jotai, or RTK and refactor
- Each student presents a 60-second "why I picked this" at the end
- Stretch: implement the same refactor with a second tool and compare

**Modern Data Fetching (60 min, lecture + demos)**
- The four flavors: client fetch, TanStack Query, Suspense + `use()`, server-side
- TanStack Query in depth: queries, mutations, invalidation, optimistic updates
- Error boundaries and retry strategies

**Lab 4: TanStack Query Migration (75 min)**
- Convert the social-media app's ad-hoc `fetch` calls to TanStack Query
- Add an optimistic update for "create post"
- Add proper loading/error UI with Suspense + ErrorBoundary
- Stretch: implement an infinite-scroll posts feed

**Server Components and Server Actions (75 min, lecture + demos)**
- The mental model: where code runs, what crosses the boundary
- `'use client'` and `'use server'` — what they actually do
- Composing Server and Client Components correctly
- Server Actions with progressive enhancement
- Streaming and Suspense boundaries
- The pitfalls — including what AI assistants get wrong at the boundary
- Side-by-side: Next.js App Router vs RR v7 framework mode

**Lab 5: Server Components Dashboard (75 min)**
- Build a small dashboard with Server Components fetching data
- Add a Server Action form with `useActionState`
- Identify which components must be `'use client'` and why
- Stretch: add streaming with multiple Suspense boundaries

### Day 3 — Performance, Quality, and AI (~3.5 hrs lecture / ~3.5 hrs lab)

**Performance in the Compiler Era (60 min, lecture + demos)**
- Measuring first: React DevTools profiler, Lighthouse, Core Web Vitals
- What the React Compiler optimizes — and what it doesn't
- When manual `useMemo` / `useCallback` / `React.memo` still earn their keep
- Code splitting and lazy loading with `React.lazy` + Suspense
- Virtualization (TanStack Virtual)
- Web Workers, throttling, debouncing — when and why

**Lab 6: Profile and Optimize (75 min)**
- Use the profiler and Lighthouse to identify bottlenecks in the social-media app
- Apply at least three different optimization techniques
- Measure before/after for each and report numbers
- Stretch: add a virtualized list for the posts feed

**Testing React Apps in 2026 (60 min, lecture + demos)**
- Vitest as the test runner
- React Testing Library: query priorities, user-event, async patterns
- MSW for API mocking
- Playwright for end-to-end (overview)
- Testing Server Components
- AI-generated tests: behavior vs. implementation

**Lab 7: Test Suite from Scratch (75 min)**
- Write Vitest + RTL tests for a feature in the social-media app
- Have an AI assistant extend the suite; review every test it generated
- Mark each AI-generated test as "keep / refactor / delete" with a reason
- Stretch: add one Playwright e2e test for the auth flow

**Advanced React with AI Assistants (75 min, lecture + demos)**
- Tool-agnostic patterns: principles that apply across Cursor, Claude Code, Copilot, Windsurf
- A taxonomy of React mistakes current LLMs make: stale closures, effect deps, hydration mismatches, key issues, server/client boundary violations, `useEffect` overuse
- Project context for AI: `AGENTS.md` / `CLAUDE.md`, lint rules, repo conventions
- AI-assisted refactors and migrations — and how to verify them
- Spec-driven feature development with an AI pair
- A code-review checklist for AI-generated React

**Lab 8: AI-Assisted Feature, End to End (90 min)**
- Pick one feature from a backlog; spec it briefly
- Build it with heavy AI assistance
- Submit a short written code review of the AI-generated portions, calling out at least three issues caught and fixed
- Stretch: contribute one entry back to the class's shared "AI-mistakes-we-saw" doc

**Production Concerns + Wrap-up (45 min, lecture + Q&A)**
- React-specific security: sanitization, CSP for streaming SSR, secrets in Server Actions, hydration safety
- Accessibility — what AI assistants miss
- Internationalization briefly
- Where to go next; Q&A; course feedback

### At-a-glance time totals

| Day | Lecture/demo | Lab | Lab share |
|---|---|---|---|
| Day 1 | 3 hrs | 3.25 hrs | 52% |
| Day 2 | 3.25 hrs | 3.5 hrs | 52% |
| Day 3 | 3.5 hrs | 3.5 hrs | 50% |
| **Total** | **9.75 hrs** | **10.25 hrs** | **51%** |

(Remaining ~1 hr/day is breaks, transitions, and the wrap-up Q&A.)

---

## Update plan and sequencing

### Phase 1 — Outline and lab repo (1–2 weeks)
- Lock the new outline (this document, after your edits)
- Update `github.com/chrisminnick/advanced-react` to React 19, RR v7, latest tooling
- Decide which existing labs survive (chat app and social-media app likely do; Single-SPA lab gets retired or moved to optional)
- Write a new starter for the Server Components lab — likely a Next.js 15 mini-app

### Phase 2 — Slide deck rewrite (3–4 weeks)
Rebuild module by module rather than editing in place. Suggested order:
1. Module 3 (Hooks) and Module 4 (Routing) — content is most evolved, biggest student win
2. Module 7 (RSC/Server Actions) — newest content, needs the most original work
3. Module 5 (State) and Module 6 (Data Fetching) — heavy rewrites of existing material
4. Module 8 (Performance) and Module 9 (Testing)
5. Module 10 (AI) — write last so it can reference concrete examples from the other modules
6. Modules 1, 2, 11 — connective tissue

### Phase 3 — Lab rewrites (2 weeks, in parallel with Phase 2)
- Lab 1: chat app modernization (keep the starter, retarget the exercise)
- Lab 2: routing/auth (refresh to RR v7)
- Lab 3: state management (rewrite — pick-your-tool)
- Lab 4: data fetching (new — TanStack Query)
- Lab 5: Server Components (new)
- Lab 6: performance (refresh)
- Lab 7: testing (new)
- Lab 8: AI-assisted feature (new)

### Phase 4 — Dry run and polish (1 week)
- Self-paced run-through of all labs, fresh-clone, on a clean machine
- Time each module against the 3-day budget; trim or shift to optional
- Capture instructor notes alongside slides

### Total estimated effort
~7–8 weeks of focused work, less if labs 1–2 and 6 carry over largely intact.

---

## Locked decisions (2026-05-06)

| Question | Decision | Implication |
|---|---|---|
| Audience | **Mixed** — senior catching up + mid-level leveling up | Build scaffolding for mid-level into core path; flag deeper material as optional depth for seniors. Each module needs a clear "core" track and an "extra mile" pointer. |
| TypeScript | **JS-first; TS only where it matters** | Labs stay in plain JS. No dedicated TS module on Day 1. TS appears inline where it adds clear value (typed props, discriminated unions for state, generics in custom hooks). Frees the Day-1 morning slot. |
| Framework | **Framework-neutral with comparisons** | Teach concepts framework-free, then show each in both Next.js 15 and React Router v7 (framework mode). Adds setup overhead per module but ages better. |
| Redux | **Demoted to one option inside Module 5** | ~20–30 min on RTK + RTK Query as one entry in the state-management decision framework, alongside `useState`/`useReducer`, Zustand, Jotai, and TanStack Query. No standalone Redux module. |
| Micro frontends | **Cut entirely** | Frees ~45–60 min on Day 3 — reallocated to Testing and AI modules. Retire Lab 04 (Single-SPA). |
| AI tools | **Tool-agnostic patterns** | Teach principles that work across Cursor, Claude Code, Copilot, Windsurf. Use one or two in screenshots without picking favorites. AI thread runs through every day plus the focused Day-3 module. |
| Pre-work | **Optional pre-work doc** | Ship a short pre-work piece: TS-in-React essentials (so JS-first labs don't surprise anyone), React 19 release-notes summary, lab repo setup links. No Day-0 environment-check script. |

## What changes in the outline because of these decisions

- **Day 1 Module 2 (TypeScript) is removed as a standalone module.** Its content gets folded inline where it pays off: typed-props examples in the hooks module, discriminated-union state in the state module, etc. The freed ~60 min goes into Module 3 (Hooks) and a new Module 1 expansion.
- **Day 1 has more breathing room.** With TS gone as a module, Day 1 looks like: Landscape (60 min) → Hooks That Matter (120 min) → Routing with RR v7 + Next.js comparison (90 min) → Lab 1 + Lab 2 (rest of day).
- **Module 5 (State) now leads with a decision framework, not Redux.** The order: local state patterns → Zustand → Jotai → RTK + RTK Query → TanStack Query for server state. Each tool gets a "when to reach for this" framing.
- **Every framework-specific topic** (routing, RSC, Server Actions, streaming, data loading) gets a side-by-side Next.js vs RR v7 comparison slide so students can map the concept to whichever they use.
- **Day 3 reclaims the micro-frontends slot.** That ~60 min splits between Module 9 (Testing) and Module 10 (AI) — both benefit from the extra time.
- **Pre-work doc** becomes a Phase 1 deliverable alongside the outline.

## Updated phase plan

Phase 1 now produces three artifacts: the locked outline, the lab-repo upgrade plan, and the pre-work doc draft. Phases 2–4 unchanged.
