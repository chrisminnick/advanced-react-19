# Lab 8 — AI-Assisted Feature, End to End

**Time:** 90 minutes

**Format:** Hands-on. Work alone.

**Goal:** Pick a feature from the backlog. Write a one-paragraph spec.
Build it with heavy AI assistance. Self-review using the checklist
from Module 9.

This is the capstone. Everything from this week comes together: hooks,
routing, state, data, RSC, performance, testing, AI review.

---

## What you'll have at the end

1. A `lab08-spec.md` — your one-paragraph spec for the feature.
2. Working feature code in `lab-files/lab-08/`.
3. A `lab08-self-review.md` listing at least three issues you caught
   and fixed in the AI's output, citing Module 9's review checklist.

Both `.md` files go at the root of `lab-files/lab-08/`.

Optional: one entry contributed to the class's shared
`ai-mistakes-we-saw.md` doc.

---

## Time budget

| Phase | Minutes |
|---|---|
| Pick a feature + write the spec | 15 |
| Set up project context for AI | 10 |
| Build with AI — small batches | 45 |
| Self-review against the checklist | 20 |

If you finish early, contribute to the class's `ai-mistakes-we-saw.md`
doc with a pattern you noticed.

---

## Setup

You're working in `lab-files/lab-08/`. The starter is the post-Lab-7
state of `social-media-rr-v7/` (TanStack Query + tests in place) plus
the shared backend.

```bash
# Terminal 1 — backend
cd lab-files/lab-08/social-media/server
npm install
npm run dev

# Terminal 2 — client
cd lab-files/lab-08/social-media-rr-v7
npm install
npm run dev
```

If you'd rather extend the Next.js client, switch to
`lab-files/lab-02/social-media-nextjs/` (it's the only Next client we
ship). The lab is framework-neutral.

### Make a backup

```bash
cp -R lab-files/lab-08 lab-files/lab-08-backup

# Windows PowerShell:
Copy-Item -Recurse lab-files/lab-08 lab-files/lab-08-backup
```

---

## Phase 1 — Pick a feature + write the spec (15 min)

### Backlog

Pick one. They're roughly ordered by complexity — the lower ones are
bigger.

**A. Comments on posts.** Each post has a thread of replies. Show
count on the post card; expand on click. Server Action to add a
comment. Optimistic update.

**B. Reactions on posts.** Heart, laugh, surprise. Each reaction is a
Server Action. The post card shows aggregate counts and which
reactions the current user has applied. Toggle via click.

**C. Tags + tag filtering.** Posts can have up to 5 tags. The home
feed filters by clicked tag. Tags are URL-driven. Show a tag cloud in
the sidebar.

**D. User profile edit.** A `/profile/edit` route with a form for
name, bio, avatar URL. Uses a Server Action with validation. Shows
the form pre-filled from the current user.

**E. Saved drafts.** Compose a post but don't send it; it goes to
drafts. List of drafts in the sidebar; click to resume composing.
Drafts persist in localStorage AND sync to the server when online.

**F. Notifications panel.** A bell icon in the header. Clicking opens
a panel with recent notifications (someone replied, someone reacted).
Mark-as-read state syncs to the server.

**G. Direct messages.** A `/messages` route. List of conversations on
the left; thread on the right. Send messages via Server Action.
Optimistic updates.

**H. Search with suggestions.** Search box with as-you-type
suggestions. Debounced. Results page at `/search?q=...`. Highlight
match in results.

If none of these fit, propose your own — but get the instructor's nod
before you start.

### Write the spec

Save as `lab-files/lab-08/lab08-spec.md`. One paragraph. Answer all of
these:

1. **What does the feature do?** One sentence.
2. **What are the acceptance criteria?** Three to five bulleted
   user-facing behaviors.
3. **Where in the codebase does it live?** File paths or directory paths.
4. **What's explicitly out of scope?** Anything you'd be tempted to
   scope-creep into.

Example for option B (Reactions):

```markdown
# Lab 8 spec — Reactions on posts

## What it does
Each post supports three reactions (heart, laugh, surprise). Users can toggle each independently.
The post card shows aggregate counts per reaction and highlights ones the current user applied.

## Acceptance criteria
- Clicking a reaction icon adds it for the current user (optimistic).
- Clicking again removes it.
- Counts update in the UI immediately and persist to the server.
- Other users' reactions appear without a manual refresh (TanStack Query refetch on focus is fine).
- Server rejects invalid reaction types with a 400 status.

## Where it lives
- Frontend: app/components/PostCard.jsx (extend), app/components/ReactionBar.jsx (new)
- Server Actions: app/actions/reactions.js (new)
- API: server/routes/reactions.js (new)

## Out of scope
- Custom reaction emoji
- Reaction history / who-reacted modal
- Notifications when someone reacts to your post (that's option F)
- Animations beyond simple state changes
```

A spec that doesn't fit on one screen is too big. Trim or split.

---

## Phase 2 — Set up project context for AI (10 min)

The AI will produce dramatically better code if it knows your
codebase's conventions. Spend ten minutes priming it.

### Step 1 — Verify AGENTS.md / CLAUDE.md exists

Read `AGENTS.md` (or `CLAUDE.md`) at the repo root. Confirm it
accurately describes the current stack: React 19, RR v7 framework
mode, TanStack Query, Zustand, Vitest + RTL + MSW.

If it doesn't exist or is stale, update it now. The reference
"Example AGENTS.md" slide from Module 9 is a good template — and
yes, you can have the AI write it for you (it just read the same
codebase).

### Step 2 — Open the lint config

Confirm `react-hooks/exhaustive-deps`,
`react-compiler/react-compiler`, and the Testing Library plugin are
all set to `error`. AI tools listen to lint errors and self-correct
when they see them.

### Step 3 — Drop the spec into the AI's context

Either paste it into the chat panel, or tell the AI to read
`lab-files/lab-08/lab08-spec.md` from disk. Add: "Don't start coding
yet. First, propose a file list and function signatures. Wait for me
to approve."

The AI should produce a structure proposal. **Read it carefully.**
This is your chance to redirect before any code is written.

If the AI proposes class components, `getByTestId`, `useEffect` for
fetching, or `'use client'` on a page that doesn't need it — push
back. "We use [tool], not that. See AGENTS.md."

### Step 4 — Approve or revise the structure

Once the AI's proposed structure matches your codebase's conventions,
tell it to proceed. Keep the iterations small from here.

---

## Phase 3 — Build with AI — small batches (45 min)

### The rhythm

For each piece of the feature:

1. Tell the AI which file to write and what it should do
2. Read the diff before accepting
3. Run `npm run dev` to confirm it works
4. Run `npm test` (if there are tests for the area)
5. Move to the next file

### Order

Approximately:

1. The data layer first (Server Action, API route, mocks)
2. The lowest-level component (e.g., the icon bar before the card that uses it)
3. The integration component (the post card, the page)
4. Tests for the new component
5. Manual smoke test in the browser

### What to push back on

If the AI:

- Adds `'use client'` to a page that doesn't need it — push back, extract the interactive bit
- Uses `useEffect + fetch` instead of a Server Action or TanStack Query — push back
- Adds `getByTestId` or `fireEvent` in tests — push back
- Imports a server-only module into a `'use client'` file — push back, refactor
- Suggests `localStorage` for anything sensitive — push back, use server state

### What to accept

If the AI:

- Names files consistently with your repo
- Uses your existing helpers (api.js, queryKeys.js, etc.)
- Writes tests using `getByRole` and `userEvent`
- Asks clarifying questions before assuming

You're building the right working relationship — keep going.

---

## Phase 4 — Self-review against the checklist (20 min)

Open Module 9's "AI-generated React review checklist" slide and walk
every file you and the AI produced through it.

### The checklist (copy from Module 9)

**Hooks**
- Stale closures in useEffect?
- Missing dep array entries?
- Hooks inside conditionals or loops?
- useEffect for derived state or events?

**Boundaries**
- 'use client' at the right level?
- Server-only imports staying server-side?
- Functions across boundary marked 'use server'?
- Non-serializable props eliminated?

**Patterns**
- Modern Router APIs (RR v7 / Next.js App Router)?
- Modern state (Zustand/Jotai/RTK or just useState)?
- Server data through TanStack Query, not useEffect+fetch?
- Functional setState where it matters?

**Tests**
- Role-based queries, not getByTestId?
- user-event, not fireEvent?
- MSW for network mocks, not vi.fn on api?
- No spies on React internals?

### Write `lab08-self-review.md`

Save at `lab-files/lab-08/lab08-self-review.md`. Format:

```markdown
# Lab 8 self-review

Reviewed against Module 9's checklist. Found and fixed N issues.

## Issue 1 — <short description>

**Where:** path/to/file.jsx, lines NN-NN
**Category:** hooks / boundaries / patterns / tests
**What the AI produced:**
```js
// the bad code, copy-pasted
```
**What I changed it to:**
```js
// the corrected code
```
**Why:** one or two sentences.

## Issue 2 — ...
## Issue 3 — ...
```

You need at least three real issues. If your AI produced perfect code
on the first try (rare), explain what about your spec or context made
that possible — that's a finding too.

---

## Optional — contribute to `ai-mistakes-we-saw.md`

If you noticed a pattern this week that's not in Module 9's taxonomy,
add an entry to the class's shared `ai-mistakes-we-saw.md` doc.
Format:

```markdown
## <pattern name>

**What you'll see:** <description of the mistake>
**Why AI does it:** <your guess at the cause — training data? prompt phrasing?>
**How to spot it:** <what makes it visible in code review>
**The fix:** <what to do instead>
```

These contributions feed into the next cohort's Module 9.

---

## Hints if you get stuck

- **The AI's first proposal is wildly off-spec:** your spec was
  probably ambiguous. Tighten it. Sometimes "what's out of scope" is
  the missing piece — without that, the AI will fill in the gaps with
  its own assumptions.
- **The AI keeps producing the same kind of mistake:** it's
  pattern-matching to its training data, not to your codebase. Add an
  explicit "do not" rule to AGENTS.md and prompt the AI to re-read it.
- **You don't have time to finish:** ship the spec, half the
  implementation, and the self-review of what you did get to. The
  review skill is what's being graded — finishing every line of code
  is secondary.
- **The AI added tests you can't make pass:** that's a self-review
  item. Either fix the tests OR fix the code OR delete the tests with
  a written reason. All three are valid; "leave failing tests in CI"
  is not.
- **You're not sure if the AI's choice is wrong:** that's also a
  self-review item. "Considered alternatives X and Y; AI's choice is
  reasonable because Z." Documenting reasoning is the skill.

---

## Reference solution

The lab is open-ended by design — there isn't one specific solution.
The `solutions/lab-08-exemplar/` folder implements option B (Reactions)
with a benchmark `lab08-self-review.md` showing the kind of triage to
aim for.
