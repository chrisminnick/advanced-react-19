# Lab 8 exemplar — Reactions on posts (Option B)

Self-contained, runnable reference solution for Lab 8. Implements
Option B from the Lab 8 backlog: each post supports three reactions
(heart, laugh, surprise); users can toggle each independently with
optimistic updates.

This isn't THE solution — Lab 8 is intentionally open-ended. It's a
**benchmark** showing the shape and depth of the deliverables.

## How to run

Two terminals (the server is modified — adds a `/api/posts/:id/reactions`
endpoint and a reactions field on the Post model).

```bash
# Terminal 1 — Express backend (port 4000)
cd server
npm install
npm run dev

# Terminal 2 — RR v7 client (port 5173)
# from this solution folder
npm install
npm run dev
```

Open <http://localhost:5173>. Sign up, log in, click any reaction button
on a post — it should toggle instantly (optimistic), then settle.

Run the reactions test in isolation:

```bash
npm run test:run -- ReactionBar
```

MongoDB on `:27017` required.

## What changes vs. lab-07-tests

### Backend

| File | Change |
|---|---|
| `server/models/post.js` | Adds `reactions` map field. |
| `server/routes/reactions.js` | NEW — POST + DELETE endpoints per post + reaction type. |
| `server/app.js` | Mounts `/api/posts/:id/reactions`. |

### Client

| File | Change |
|---|---|
| `app/lib/api.js` | NEW endpoints: `addReaction`, `removeReaction`. |
| `app/hooks/useToggleReaction.js` | NEW — `useMutation` w/ optimistic toggle on the posts cache. |
| `app/components/ReactionBar.jsx` | NEW — three icon buttons + counts; uses the hook. |
| `app/components/PostsFeed.jsx` | Renders `<ReactionBar />` inside each post. |
| `app/components/ReactionBar.test.jsx` | NEW — 4 behavior tests. |

### Deliverables

| File | Change |
|---|---|
| `lab08-spec.md` | NEW — the one-paragraph spec. |
| `lab08-self-review.md` | NEW — three issues caught and fixed in the AI's output. |

## Things to point out to students

- The `reactions` cache shape is an object keyed by reaction type, with
  `count` and `mine`. Picking that shape early made the optimistic
  update trivial and the server response shape match the cache shape.
- The hook handles BOTH add and remove with a single `mutate({ type,
  desired })` call. That avoids duplicating the optimistic logic.
- The self-review surfaces a real bug: the AI's first version mutated
  the cache with the wrong key when the same post appeared in multiple
  query results (the bug + fix are in `lab08-self-review.md`).
