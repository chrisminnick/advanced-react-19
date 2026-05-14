# Lab 6 baseline — seeded performance problems

This folder is the **starting state for Lab 6**. It extends the
`solution/lab-04-tanstack-query` branch with the deliberate problems Lab 6
asks students to find and fix:

1. **Search input lives in the page parent.** Every keystroke re-renders
   `<PostsFeed>` and all its `<PostCard>` children, even though none of
   them displays the query.
2. **`TrendingSidebar` recomputes a tag-frequency analysis on every
   render.** No memoization. The Compiler can't help because the `posts`
   array reference is new on every parent render.
3. **`Composer` imports a "heavy" markdown editor.** Eagerly loaded with
   the home page, even though the user has to click "New post" to use it.
4. **Backend posts now include mock tags** so the trending calc has
   something to chew on.

## What's in here

```
server/routes/posts.js      ← stamps a `tags` field onto every post
app/routes/home.jsx          ← search state lives here, drilled into PostsFeed
app/components/SearchInput.jsx  ← receives value+onChange from the parent (bad)
app/components/PostCard.jsx     ← extracted from PostsFeed for sharper Profiler reads
app/components/PostsFeed.jsx    ← renders PostCard, takes search prop
app/components/TrendingSidebar.jsx  ← expensive recomputation each render
app/components/Composer.jsx         ← pretends to be a heavy markdown editor
```

The three `solution/lab-06-*` snapshots conceptually branch from this
`lab-06-baseline` state.

## Note on the "heavy" Composer

A real lab seed would import `@uiw/react-md-editor` (78KB). To avoid a
bundle commitment from this repo, the staged `Composer.jsx` here just
imports a fake-heavy module (a 200-line dictionary of words) so the chunk
is meaningfully larger than the rest of the home page. The optimization
pattern (lazy + Suspense) works identically.

If your cohort wants the real markdown editor, swap in:

```bash
( cd social-media-rr-v7 && npm install @uiw/react-md-editor )
```

and replace the import in `Composer.jsx` accordingly.
