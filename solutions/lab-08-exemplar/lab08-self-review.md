# Lab 8 self-review — Reactions feature

Reviewed against Module 9's checklist. Found and fixed three issues in
the AI's first-pass output. Categories cite the checklist sections
(hooks / boundaries / patterns / tests).

I used Cursor (Claude Sonnet 4.6) for the implementation pass, with the
`lab08-spec.md` and the existing `solution/lab-04-tanstack-query` code as
context. The AI's structure proposal (returned before any code) was
sound; the code-writing pass had the issues below.

## Issue 1 — Optimistic update wrote to the wrong cache shape (patterns)

**Where:** `app/hooks/useToggleReaction.js`, the original `onMutate`.

**Category:** patterns (server data through TanStack Query — used
correctly *to* the cache, but the cache mutation itself was incomplete).

**What the AI produced:**

```js
onMutate: async ({ type, desired }) => {
  await qc.cancelQueries({ queryKey: ['posts'] });
  qc.setQueryData(queryKeys.posts.list(), (old) =>
    old?.map((p) =>
      p.id === postId
        ? {
            ...p,
            reactions: {
              ...p.reactions,
              [type]: { count: p.reactions[type].count + (desired ? 1 : -1), mine: desired },
            },
          }
        : p
    )
  );
}
```

**What I changed it to:** Use `setQueriesData` with a partial filter that
matches every cache entry under `queryKeys.posts.all`. The first version
only mutated `queryKeys.posts.list()` — which left the search-filtered
list (`['posts','list',{q:'react'}]` from Lab 6) showing stale counts.
Also added a snapshot for rollback and an `Array.isArray` branch so
single-post detail caches update too.

**Why:** The same post can be in multiple cached query results. A single
`setQueryData` only catches one. Using `setQueriesData` with a prefix
filter is the canonical fix.

## Issue 2 — Backend route used `findByIdAndUpdate` and lost concurrent toggles (patterns)

**Where:** `social-media/server/routes/reactions.js`.

**Category:** patterns (data integrity — implementation choice).

**What the AI produced:**

```js
router.post('/:type', validateToken, async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    id,
    { $inc: { [`reactions.${type}.count`]: 1 } },
    { new: true }
  );
  res.json(post.reactions);
});
```

**What I changed it to:** load the post, mutate the `userIds` array,
recompute `count` from the array length, save. The `$inc` version is
double-add safe in isolation but not idempotent — a double-click from
the same user would push the count to 2 even though only one user
reacted. Also, it stored no per-user state, so the `mine` flag couldn't
be derived.

**Why:** The spec requires us to know whether the *current user* has
reacted. That requires per-user state on the document, which `$inc`
can't model. Worth the extra round-trip for the read-modify-write pattern.

## Issue 3 — Test used `getByText` for the count and triggered ambiguity (tests)

**Where:** `app/components/ReactionBar.test.jsx`, AI's first version of
test #1.

**Category:** tests (role-based queries; **red flag #2 from Module 8**).

**What the AI produced:**

```js
expect(screen.getByText('0')).toBeInTheDocument();
```

**What I changed it to:** `expect(screen.getAllByText('0')).toHaveLength(3)`.
The original would throw "found multiple elements with text '0'" because
all three reaction buttons start at zero.

**Why:** When asserting on counts that legitimately repeat across the UI,
`getAllBy` + length is the right query. Single-element `getBy` queries
that fail with multiple matches are a sign you're querying for the
wrong thing — in this case, the role-+-name combo (which I used
elsewhere in the file) was the right tool, but for a numeric count next
to it, multiplicity is just a fact.

---

## What I'd do next

- **Real-time reactions.** Right now, other users' reactions only show
  after a refetch (`refetchOnWindowFocus`). A WebSocket push would make
  it feel collaborative. Out of scope for this lab.
- **Animation on toggle.** A subtle scale-up when `mine` flips. Pure CSS,
  ~10 lines. Skipped per the spec's out-of-scope list.
- **Race with the post-create optimistic update.** If a user creates a
  post and immediately reacts to the optimistic stub, the reaction would
  fail (the optimistic ID isn't a real Mongo ObjectId). Disable the
  ReactionBar on `sending: true` posts — already done in `PostsFeed`'s
  conditional render but worth a defensive check inside ReactionBar too.
