# Lab 8 spec — Reactions on posts (Option B)

## What it does
Each post supports three reactions: `heart`, `laugh`, `surprise`. Users can
toggle each one independently. The post card shows aggregate counts per
reaction and highlights ones the current user has applied.

## Acceptance criteria
- Clicking an unfilled reaction icon adds it for the current user
  (optimistic — visual update is immediate).
- Clicking a filled reaction icon removes it.
- Counts update in the UI immediately and persist to the server.
- The icon visibly indicates whether the current user has reacted (filled
  vs outlined).
- Other users' reactions appear without a manual refresh — TanStack
  Query's existing `refetchOnWindowFocus` covers this.
- Server rejects unknown reaction types (`/api/posts/:id/reactions`
  returns 400).

## Where it lives
- Frontend: `app/components/ReactionBar.jsx` (new),
  `app/components/PostsFeed.jsx` (extend),
  `app/hooks/useToggleReaction.js` (new),
  `app/lib/api.js` (extend with `addReaction` / `removeReaction`).
- Backend: `social-media/server/routes/reactions.js` (new),
  `server/models/post.js` (extend with `reactions` map),
  `server/app.js` (mount the new router).
- Tests: `app/components/ReactionBar.test.jsx` (new).

## Out of scope
- Custom reaction emoji.
- Reaction history / who-reacted modal.
- Notifications when someone reacts to your post (that's Option F).
- Animations beyond the existing CSS hover state.
