# Lab 3 — Pick-Your-Tool State Refactor

**Time:** 90 minutes

**Format:** Hands-on. Work alone.

**Goal:** Take the social-media app — which has prop-drilling, an over-stuffed AppContext, and ad-hoc context for half a dozen unrelated concerns — and refactor its client state using one tool of your choice. Then defend your choice in 60 seconds.

The point of this lab isn't to learn one of three tools deeply. It's to make a real engineering decision and live with the consequences.

---

## What you'll have at the end

1. A refactored social-media client where the prop-drilling is gone, the bloated context is gone, and client state lives in a coherent place.
2. A short written justification (3–5 bullets) for why you picked the tool you picked.
3. A 60-second pitch you'll give to the class.
4. A branch pushed to the lab repo, named for the tool you chose.

Plus, if you have time: a port to a second tool and a written comparison.

---

## Time budget

| Phase | Minutes |
|---|---|
| Setup + survey the existing state | 15 |
| Pick your tool + sketch a plan | 10 |
| Refactor | 50 |
| Write justification + prepare pitch | 15 |
| Stretch (if time): port to a second tool | + |

If you finish early, do the stretch task.

---

## Setup

You're working in the `social-media-rr-v7/` client (the one you set up in Lab 2). The shared backend should already be running from Lab 2 — if not, restart it:

```bash
cd social-media/server
npm start
```

Then in the client:

```bash
cd social-media-rr-v7
git checkout main
git pull
npm install
npm run dev
```

Visit `http://localhost:5173`. Sign up and log in (or use your Lab 2 account). The app should show a posts feed and a sidebar.

### Survey what's there

Spend ten minutes reading. Don't write any code yet. Open these files and just look:

- `app/root.jsx` — the root has an `<AppProvider>` wrapping everything. Notice how many things it provides.
- `app/context/AppContext.jsx` — the bloated context. Count the values it exposes.
- `app/components/PostsFeed.jsx` — see how many props it takes that it doesn't itself use (it forwards them to children).
- `app/components/Sidebar.jsx` — uses `useContext(AppContext)` to read three different values, even though it doesn't need most of the context.

Write down on a sticky note (or in a comment in your editor):

- Three values that are clearly **server state** (and should leave the client store entirely)
- Three values that are clearly **client state shared widely** (good candidates for the new store)
- Three values that are **local component state** (and shouldn't be in any store at all)

This list is your refactor plan.

### Create your branch

Branch name should reflect your tool choice:

```bash
git checkout -b lab03/<your-name>-zustand
# or
git checkout -b lab03/<your-name>-jotai
# or
git checkout -b lab03/<your-name>-rtk
```

---

## Pick your tool (10 min)

Re-read slide 24 of Module 4 — the five-question framework — and apply it to this app. Then pick **one** tool:

- **Zustand** — minimal API, hook-shaped, no Provider needed. Default for "I just want a small store."
- **Jotai** — atoms compose into a graph. Strong fit if your derived state is itself complex.
- **Redux Toolkit + RTK Query** — strongest conventions, best DevTools. Pick if you want the structure for a large team or want server state in the same toolset.

Write your three-to-five-bullet justification draft now, while the framework is fresh. You'll polish it at the end. The bullets should answer:

1. Why this tool fits this app's state shape.
2. What you considered but rejected, and why.
3. What you'd lose if you switched to a different tool.

If you can't write the bullets, you don't have a real justification yet. Pick again.

---

## Refactor (50 min)

There's no single right way to do this — that's the point. But here's a sensible order regardless of tool:

### Step 1 — Strip the bloat from the existing context

Whatever stays in context should be **just** plumbing — auth user, theme, query client. Move everything else somewhere appropriate. Don't worry about breaking things on this pass; the tests will surface what's broken.

### Step 2 — Move server state OUT entirely

Anything you flagged as server state goes through `fetch` (or a route loader) for now — Lab 4 introduces TanStack Query for these. Don't put server data in your new store.

### Step 3 — Create your store

Whatever shape your tool wants. Aim for:

- Slices grouped by feature, not by data shape (e.g., `useDraftsStore`, not `useStringsStore`)
- Actions named for what they do, not for what they set (`removePost`, not `setPosts`)
- Selectors that return the smallest shape consumers need

### Step 4 — Replace `useContext(AppContext)` with store hooks

In each consuming component, swap context reads for store reads. Use selectors to read just the slice you need.

### Step 5 — Push prop-drilled values into the store

The components that currently take a `currentUser` prop just to forward it three layers down are the easy wins. Read from the store at the leaf component instead.

### Step 6 — Run the app

Click around. Sign in, post, edit, switch theme, open the sidebar. Watch for re-render storms in the React DevTools profiler — if a single setter is causing a whole feature to re-render, your selectors are too broad.

### Step 7 — Commit

```bash
git add -A
git commit -m "Lab 3: refactor state to <tool>"
```

---

## Write justification + prepare pitch (15 min)

### The justification

Polish the three-to-five bullets you started with. Each bullet is one tight sentence. Save as `lab03-justification.md` at the client folder root.

A good justification cites specifics from the codebase. "Zustand fit because most of this app's client state is flat — a single sidebar flag, a draft, a theme — and the per-slice selectors keep the post-list re-rendering only when the post list changes" beats "Zustand is simple and small."

### The 60-second pitch

You'll have one minute when the class reconvenes. Plan three beats:

1. **What I picked** — one sentence
2. **Why it fit this app** — one or two sentences
3. **What I'd watch out for** — one sentence

That's it. No live demos, no slides — just talking. Practice it once before class returns.

### Push your branch

```bash
git push origin lab03/<your-name>-<tool>
```

Submit your branch link and `lab03-justification.md` in the shared class doc.

---

## Stretch — port to a second tool

If you have time, port your refactor to a second tool of your choice. Do it on a new branch:

```bash
git checkout -b lab03/<your-name>-<second-tool>
```

When you're done, write a `lab03-comparison.md` answering:

1. Which tool fit this codebase better, and why?
2. What was the hardest thing to express in each?
3. Which would you advocate for at work tomorrow?

The comparison is more valuable than the second refactor. Be specific — cite files, cite lines.

---

## Hints by tool

### Zustand

- **A common mistake:** importing the entire store into every component. Pass a selector instead: `useStore((s) => s.draft)` re-renders only when `draft` changes.
- **Where to put the store file:** `app/stores/<feature>.js`. Don't dump everything into one giant store unless it's genuinely one feature.
- **DevTools:** `import { devtools } from 'zustand/middleware'`, wrap your store creator. Action names show up in Redux DevTools.
- **Persist a slice (e.g., theme) to localStorage:** the `persist` middleware. Don't roll your own.

### Jotai

- **A common mistake:** putting a whole feature into one big atom. The win is fine-grained subscriptions; one big atom defeats the purpose.
- **Derived atoms:** `atom((get) => get(itemsAtom).length)` — use them for anything you'd otherwise compute in render.
- **Async atoms:** `atom(async (get) => fetch('/api/...'))` integrates with Suspense. Useful for the server-state pieces if you don't want TanStack Query yet.
- **Provider needed only if** you want isolated atom scopes (e.g., per-route). Most apps don't need one.

### Redux Toolkit + RTK Query

- **A common mistake:** writing manual reducers. Use `createSlice` — it gives you actions and reducers in one shot.
- **Don't write a `setX` reducer for every field.** Reducers should describe transitions (`addItem`, `removeItem`, `clearAll`), not setters.
- **Selectors with `createSelector`:** memoized derivations. Keeps components from re-rendering on unrelated state changes.
- **RTK Query for server state:** if you go this route, use `createApi` for `/api/posts`, `/api/me`, etc. — not `useEffect` + `fetch`. Lab 4 will revisit.

---

## Solution branches

After the lab, three reference solutions are available:

- `solution/lab-03-zustand`
- `solution/lab-03-jotai`
- `solution/lab-03-rtk`

Compare against the one you chose. Then read at least one of the others — the comparison is half the lesson.
