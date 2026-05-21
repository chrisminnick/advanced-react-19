# Lab 8 backlog

Lab 8 is intentionally open-ended: pick one feature, write a short spec,
build it with AI assistance, add focused tests, then write a self-review of
what the AI got wrong and what you corrected.

Use this backlog as the menu of acceptable feature choices. The goal is not to
ship a giant scope; the goal is to practice giving the AI a bounded product
spec, reviewing the output critically, and finishing the feature with the
course patterns.

## Picking a feature

- Pick exactly one option from this list.
- Keep the scope to something you can finish end-to-end in one lab.
- Prefer Options A-E for the standard lab path.
- Option F is a deliberate stretch option.
- If you want a different feature, treat this backlog as the bar: your idea
  should be similar in size and should still fit the existing React Router v7 +
  TanStack Query + Express architecture.

## Option A — Post details route

Add a dedicated route for viewing one post at `/posts/:postId`.

Acceptance criteria:

- Clicking a post title or “View details” link navigates to a dedicated post
  page.
- The page loads the post with the existing `GET /api/posts/:id` endpoint.
- Loading, error, and not-found states are handled explicitly.
- The detail page links back to the main feed.
- Add at least one route/component test covering the happy path and one failure
  state.

Likely files:

- `app/routes.js`
- `app/routes/posts.$postId.jsx` or similar RR v7 route file
- `app/lib/api.js`
- one new test file near the route/component

## Option B — Reactions on posts

Each post supports three reactions: `heart`, `laugh`, and `surprise`. Users can
toggle each independently, with optimistic UI updates.

Acceptance criteria:

- Clicking an unfilled reaction adds it immediately in the UI.
- Clicking a filled reaction removes it.
- Counts update optimistically and settle against the server response.
- The current user's reactions are visually distinct from aggregate-only counts.
- Unknown reaction types are rejected server-side.
- Add focused behavior tests for the reaction bar.

Likely files:

- `app/components/ReactionBar.jsx` (new)
- `app/components/PostsFeed.jsx` or `app/components/Feed.jsx`
- `app/hooks/useToggleReaction.js` (new)
- `app/lib/api.js`
- `social-media/server/models/post.js`
- `social-media/server/routes/reactions.js` (new)

Notes:

- The exemplar in `solutions/lab-08-exemplar/` implements this option.

## Option C — Edit your own posts

Allow the author of a post to edit that post from the feed or detail page.

Acceptance criteria:

- Only the author sees the edit affordance.
- Editing uses the existing `PUT /api/posts/:id` endpoint.
- The form supports cancel, validation, success, and error states.
- The posts cache updates without a full page reload.
- Add focused tests for showing the editor, saving, and canceling.

Likely files:

- `app/components/PostCard.jsx` or the component that renders each post
- `app/components/EditPostForm.jsx` (new, optional)
- `app/lib/api.js`
- existing posts query/mutation hooks

## Option D — Delete your own posts

Allow the author of a post to remove it from the feed with an optimistic UI.

Acceptance criteria:

- Only the author sees the delete affordance.
- Deleting uses the existing `DELETE /api/posts/:id` endpoint.
- The post disappears immediately, then rolls back if the request fails.
- The user gets a clear pending/error state.
- Add focused tests for the optimistic removal flow.

Likely files:

- the component that renders each post action row
- `app/lib/api.js`
- one new mutation hook or an extension to the existing posts hook
- one new test file or an extension to an existing post test

## Option E — Search or filter the feed

Add a user-controlled way to narrow the feed, such as text search or an
“All posts / My posts” filter.

Acceptance criteria:

- The filter state is controlled by the UI, not hard-coded.
- Query keys include the active filter so cached results stay correct.
- The empty state explains when no posts match the current filter.
- The server does the actual filtering (for example via `q=` or `author=me`).
- Add focused tests for filter changes and empty results.

Likely files:

- `app/components/FeedToolbar.jsx` (new, optional)
- `app/components/Feed.jsx`
- `app/lib/api.js`
- `social-media/server/routes/posts.js`

## Option F — Notifications for reactions (stretch)

When another user reacts to one of your posts, show a lightweight notification
list in the app shell.

Acceptance criteria:

- A reaction from another user creates a notification for the post author.
- Your own reactions do not notify you.
- The notifications list shows at least the actor, reaction type, and post
  title.
- Notifications can be marked read or cleared.
- Add at least one backend test and one frontend behavior test.

Likely files:

- new notification model/route files on the server
- app-shell component such as `Header.jsx` or `Sidebar.jsx`
- `app/lib/api.js`
- one notifications hook/store slice if needed

Notes:

- This is intentionally larger than the other options. Treat it as a stretch
  goal, not the default pick.

## Deliverables for any option

- `lab08-spec.md` — one short product spec for the option you picked.
- Code changes implementing the feature.
- Focused tests for the new behavior.
- `lab08-self-review.md` — a short write-up of what the AI got wrong, what you
  fixed, and what you learned from reviewing the output.

## Evaluation lens

The strongest Lab 8 submissions are not the ones with the biggest scope. They
are the ones that:

- give the AI a precise prompt,
- keep server state in TanStack Query,
- avoid `useEffect` for data fetching or derived state,
- add behavior-oriented tests,
- and document the AI mistakes honestly in the self-review.
