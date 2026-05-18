# Lab 6 baseline — seeded performance problems

Self-contained, runnable snapshot of the **starting state for Lab 6**.
Extends `solutions/lab-04-tanstack-query/` with the deliberate problems
Lab 6 asks students to find and fix.

## How to run

Two terminals.

```bash
# Terminal 1 — Express backend (port 4000)
# (this server is modified — it stamps `tags` onto every post)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:5173>, sign up / log in, and observe the home
feed. The seeded problems show up most clearly under the React DevTools
Profiler when typing in the search box.

MongoDB on `:27017` required.

## What's deliberately wrong here

1. **Search input lives in the page parent.** Every keystroke re-renders
   `<PostsFeed>` and all its `<PostCard>` children, even though none of
   them displays the query.
2. **`TrendingSidebar` recomputes a tag-frequency analysis on every
   render.** No memoization. The Compiler can't help because the `posts`
   array reference is new on every parent render.
3. **`Composer` imports a "heavy" markdown editor.** Eagerly loaded with
   the home page, even though the user has to click "New post" to use
   it.
4. **Backend posts now include mock tags** so the trending calc has
   something to chew on.

```
server/routes/posts.js              ← stamps a `tags` field onto every post
app/routes/home.jsx                  ← search state lives here, drilled into PostsFeed
app/components/SearchInput.jsx       ← receives value+onChange from the parent (bad)
app/components/PostCard.jsx          ← extracted from PostsFeed for sharper Profiler reads
app/components/PostsFeed.jsx         ← renders PostCard, takes search prop
app/components/TrendingSidebar.jsx   ← expensive recomputation each render
app/components/Composer.jsx          ← pretends to be a heavy markdown editor
app/lib/heavyDictionary.js           ← the fake-heavy module Composer imports
```

The `solutions/lab-06-perf/` snapshot is what the fixed version looks
like.

## Note on the "heavy" Composer

A real lab seed would import `@uiw/react-md-editor` (78KB). To avoid a
bundle commitment from this repo, the staged `Composer.jsx` here just
imports a fake-heavy module (a 200-line dictionary of words) so the
chunk is meaningfully larger than the rest of the home page. The
optimization pattern (lazy + Suspense) works identically.

If your cohort wants the real markdown editor, swap in:

```bash
npm install @uiw/react-md-editor
```

and replace the import in `Composer.jsx` accordingly.
