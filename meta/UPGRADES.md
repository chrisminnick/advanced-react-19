# Planned upgrades

Tracking doc for dependency / framework upgrades the course has
deliberately deferred. One file per cycle (this one covers **Q3 2026**);
new cycles get their own file.

The format below is the template — copy it forward into the next cycle's
file when the time comes.

---

## Q3 2026 upgrade cycle

**Trigger window:** after the August 2026 cohort, before the
November 2026 cohort. Roughly mid-September to mid-October 2026.

**Why a cycle, not "as features drop":** the course has 8 labs that
build on each other. A mid-stream upgrade can cascade into half a
dozen lab solutions and slide-deck rewrites. Batching upgrades into a
single cycle amortizes the testing cost across all of them.

**Owner:** Chris Minnick.

### Status: deferred (locked for May 2026 cohort)

The Next.js 16 release dropped in early May 2026 (current version
16.2.6 as of writing). The course pins Next 15.5.x because we
verified the dry-run on it and the May cohort is teaching off that
pin. Q3 cycle is the first safe window to bump.

---

### Item 1 — Next.js 15.5 → 16.x

**Files affected:**

- `lab-files/lab-02/social-media-nextjs/` (starter scaffold)
- `lab-files/lab-05/server-components-dashboard/` (Lab 5 starter)
- `demos/my-next-app/`
- `demos/my-next-routing-demo/`
- `solutions/lab-02-nextjs/`
- `solutions/lab-05-dashboard/`
- `solutions/lab-05-streaming/`

That's 4 starter copies + 3 solution copies. The `package.json` bump
itself is mechanical; the meaningful changes are the four points below.

**What changes:**

1. **`middleware.js` → `proxy.js`** (rename + function export rename).
   The named export `middleware` becomes `proxy`. Config flags renamed
   too: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`.
   - Lab 2 Part B specifically calls out `middleware.js` — Step 1, Step 2.
   - The `solutions/lab-02-nextjs/middleware.js` file gets renamed and
     its inner function renamed.
   - Lab 2 handout (`labs/Lab02-Routing-Auth-Two-Frameworks.md`) needs
     "middleware" → "proxy" in body text.
   - Slide deck Module 3 has a Lab 2 description slide — check
     `outputs/build_module3.js` for the word "middleware" and patch.
   - **Pedagogical note:** the rename is actually a teaching upgrade.
     Frame it as "Vercel renamed this in v16 because *middleware* was
     too generic; the file's actual role is network-layer routing, so
     they called it *proxy*." That's a Module 3 talking point that
     didn't exist in May 2026.

2. **`cookies()` / `headers()` / `draftMode()` / `params` /
   `searchParams` are fully async.** No sync fallback remains.
   - Every `cookies().get(...)` becomes `(await cookies()).get(...)`.
   - Every `cookies().set(...)` becomes `(await cookies()).set(...)`.
   - Same for `headers()` and `draftMode()`.
   - Our route files already use `await params` in
     `demos/my-next-routing-demo/app/blog/[slug]/page.js` (we did this
     pre-emptively for Next 15), so dynamic params should be fine.
   - Files to audit:
     - `solutions/lab-02-nextjs/app/(auth)/login/page.jsx`
     - `solutions/lab-02-nextjs/app/(auth)/signup/page.jsx`
     - `solutions/lab-02-nextjs/app/lib/session.js`
     - `solutions/lab-02-nextjs/app/lib/api.server.js`
     - `solutions/lab-02-nextjs/app/home/page.jsx`
     - `solutions/lab-02-nextjs/app/logout/route.js`
     - `lab-files/lab-02/social-media-nextjs/` (whatever's there;
       starter currently has the (auth) scaffold only)
   - Lab 2 handout Step 3 has `cookies().set('session', token, ...)` —
     update to `(await cookies()).set(...)`.

3. **React Compiler graduated to stable.** Move
   `experimental: { reactCompiler: true }` to top-level
   `reactCompiler: true` in `next.config.mjs`.
   - File: `lab-files/lab-05/server-components-dashboard/next.config.mjs`
   - Also any solutions/ Next configs that opt into the compiler.

4. **Turbopack is the default** for both `next dev` and `next build`.
   - No code change needed (our `package.json` scripts already use plain
     `next dev` / `next build` — Turbopack just kicks in).
   - Worth a Module 3 mention that Vercel finally shipped Turbopack as
     default for builds, not just dev.

**Codemod (run this first, then hand-fix):**

```bash
npx @next/codemod@canary upgrade latest
```

The codemod handles: middleware → proxy rename in config flags, sync
→ async transforms on the request APIs, the `experimental.turbopack`
→ top-level `turbopack` move. It does NOT handle: lab handout prose,
slide deck content, the Lab 2 / Lab 5 README files we wrote ourselves.

**Estimated effort:** 1.5 hours, mostly mechanical. Most time goes into
re-running the slide-deck builders and verifying nothing rendered
wrong.

**Smoke test after:**

- Lab 2 Part B end-to-end (sign up → log in → see posts → log out) in `social-media-nextjs`
- Lab 5 end-to-end (open the dashboard, submit a task via the Server Action)

---

### Item 2 — React 19.0 → 19.2 (or current)

**Files affected:** every `package.json` that pins React.

```
lab-files/lab-01/real-time-chat/client/package.json   (still React 18 — intentionally legacy; SKIP)
lab-files/lab-02/social-media-rr-v7/package.json
lab-files/lab-02/social-media-nextjs/package.json
lab-files/lab-03/social-media-rr-v7/package.json
lab-files/lab-04/social-media-rr-v7/package.json
lab-files/lab-05/server-components-dashboard/package.json
lab-files/lab-06/social-media-rr-v7/package.json
lab-files/lab-07/social-media-rr-v7/package.json
lab-files/lab-08/social-media-rr-v7/package.json
demos/routing-demo/package.json
demos/my-next-app/package.json
demos/my-next-routing-demo/package.json
solutions/*/...                                       (sweep)
```

**What changes:**

- New hooks worth mentioning in Module 2: `useEffectEvent`
  (non-reactive Effect logic — addresses a stale-closure category we
  spend slides on), `<Activity>` (state-preserving hidden UI),
  `<ViewTransition>` (animated transitions).
- Module 2 has a "what's new in React 19" slide — extend it to "what's
  new in React 19.0 → 19.2" with a 3-bullet recap of the additions.
- Lab 1's stretch task (`useOptimistic` for instant messages) is
  unchanged. Could optionally add a `useEffectEvent`-flavored
  alternative once we teach it.

**Estimated effort:** 30 minutes. Mostly find-replace on `package.json`
files + one slide rewrite.

---

### Item 3 — React Router v7.x → current

**Files affected:** every `package.json` in `lab-files/lab-02..08` and
`solutions/lab-02-rr-v7`, `solutions/lab-03-*`, `solutions/lab-04-*`,
`solutions/lab-06-perf`, `solutions/lab-07-*`, plus `demos/routing-demo`.

**Status:** not yet evaluated. Check RR v7's CHANGELOG before the cycle:
<https://github.com/remix-run/react-router/releases>

**Likely concern:** RR v7 is converging with Remix; any framework-mode
API renames would cascade into the Lab 2 RR v7 solution.

---

### Item 4 — TanStack Query v5 → current

**Files affected:**
- `solutions/lab-04-tanstack-query/`
- `solutions/lab-04-stretch/`
- `lab-files/lab-06/`, `lab-files/lab-07/`, `lab-files/lab-08/`
- `lab-files/lab-07/social-media-rr-v7/app/test/handlers.js` (MSW handlers — no TanStack version dep, but exercise them)

**Status:** not yet evaluated. v5 was current as of May 2026. Check
TanStack Query's release notes; the v4 → v5 migration was significant
(renamed `isLoading` → `isPending`, `cacheTime` → `gcTime`, etc.) and
we don't want a v5 → v6 migration to slip in unnoticed.

---

### Item 5 — Vite 6 → current

**Files affected:** every `vite.config.js` in `lab-files/` and `demos/`.

**Status:** Vite has been doing major versions roughly every 4-6
months. Check whether Vite 7 has dropped by Q3 2026, and whether any
of our config syntax broke.

---

### Item 6 — Mongoose 8 → current; Express 5 → current

**Files affected:** `lab-files/lab-NN/social-media/server/package.json`
(7 copies).

**Status:** Mongoose dropped useNewUrlParser/etc. in 8.0; future minor
versions should be safe to bump. Express 5 went stable in late 2024;
unlikely to have a v6 by Q3 2026, but check.

---

### Item 7 — Node LTS line

**Current pin floor:** Node 22+ (`setup-check/check.js` enforces).
**Current recommended:** Node 24.x (LAB-VM-SETUP §3.2).

**By Q3 2026:** Node 24 will be ~12 months old and still active LTS;
Node 26 should be in active development. Don't move the floor above
Node 22 until Node 22 hits maintenance (April 2027). Update
LAB-VM-SETUP's "as of May 2026" note to whatever the current LTS is.

---

### Item 8 — VS Code extensions

**File:** `LAB-VM-SETUP.md` §3.3.

**Status:** check whether any of the recommended extensions have been
deprecated or replaced. Specific candidates to verify:

- `dsznajder.es7-react-js-snippets` — last updated?
- `ms-playwright.playwright` — still the right extension ID?
- `anthropic.claude-code` — is the recommended distribution model still
  CLI + VS Code extension, or has Anthropic shipped something different?

---

### Item 9 — npm dep deprecation warnings

The May 2026 install of `real-time-chat/client` (intentionally legacy
CRA) produced a wall of deprecation warnings (`inflight`, `glob@7`,
`rimraf@3`, `npmlog`, etc.). Those come from CRA's aged transitive
tree. Lab 1 modernizes AWAY from CRA, so this is "broken on purpose"
and shouldn't be fixed. Note in case someone tries to "help."

---

## Cycle workflow

When the cycle window opens:

1. Branch the course repo (`upgrade/q3-2026`).
2. Work through items 1-8 in order. Each lands as its own commit so the
   diff stays reviewable.
3. After each item, run:
   - `npm install` in the affected projects
   - `npm run build` where applicable
   - `setup-check/npm run check`
4. Smoke-test the most affected lab end-to-end (start backend, start
   client, sign up, log in, exercise the lab's distinguishing feature).
5. If the slide deck or lab manual references a thing that changed,
   patch the relevant `outputs/build_module*.js` or
   `outputs/build_lab_manual.py`, then re-run the builders, then copy
   the regenerated `.pptx` / `.docx` into `instructor/`.
6. Run `scripts/restructure-cleanup.sh` (or its successor) on the
   branch if anything moved.
7. Merge to main; tag `v2.1.0` (or whatever cycle bumps to).

Update `meta/UPGRADES-Q3-2026.md` (this file's eventual successor) at
the end of the cycle with what shipped, what got deferred, and any new
items found mid-upgrade.
