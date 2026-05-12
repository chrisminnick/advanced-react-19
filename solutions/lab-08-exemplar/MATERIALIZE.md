# Publish to `solution/lab-08-exemplar`

```bash
git checkout solution/lab-07-tests
git checkout -b solution/lab-08-exemplar

# Backend
cp solutions/lab-08-exemplar/server/models/post.js          social-media/server/models/post.js
cp solutions/lab-08-exemplar/server/routes/reactions.js     social-media/server/routes/reactions.js
cp solutions/lab-08-exemplar/server/app.js                  social-media/server/app.js

# Client
cp solutions/lab-08-exemplar/app/lib/api.js                 social-media-rr-v7/app/lib/api.js
mkdir -p social-media-rr-v7/app/hooks
cp solutions/lab-08-exemplar/app/hooks/useToggleReaction.js social-media-rr-v7/app/hooks/useToggleReaction.js
cp solutions/lab-08-exemplar/app/components/ReactionBar.jsx social-media-rr-v7/app/components/ReactionBar.jsx
cp solutions/lab-08-exemplar/app/components/PostsFeed.jsx   social-media-rr-v7/app/components/PostsFeed.jsx
cp solutions/lab-08-exemplar/app/components/ReactionBar.test.jsx social-media-rr-v7/app/components/ReactionBar.test.jsx

cat solutions/lab-08-exemplar/app/app.css.additions.css >> social-media-rr-v7/app/app.css

# Deliverables at the client root
cp solutions/lab-08-exemplar/lab08-spec.md           social-media-rr-v7/lab08-spec.md
cp solutions/lab-08-exemplar/lab08-self-review.md    social-media-rr-v7/lab08-self-review.md

# Smoke-test:
( cd social-media/server && npm run dev ) &
( cd social-media-rr-v7 && npm run dev ) &
# Sign in, click reactions on a post — counts should change immediately,
# pressed icons should highlight, refresh should preserve state.
( cd social-media-rr-v7 && npm test -- --run )
# All tests including the new ReactionBar suite should pass.

git add -A
git commit -m "Lab 8 exemplar: reactions feature (Option B) with self-review

Backend:
  - Post model gains reactions: { heart, laugh, surprise } each { count, userIds }
  - /api/posts/:id/reactions/:type POST adds, DELETE removes
  - 400 on unknown type; idempotent re-add

Client:
  - api.js: addReaction / removeReaction
  - useToggleReaction: optimistic toggle, multi-cache update via setQueriesData
  - ReactionBar: 3 icon buttons + counts, aria-pressed for 'mine'
  - PostsFeed renders ReactionBar inside each post (skips for sending posts)
  - app.css extended with reaction styles

Tests:
  - ReactionBar.test.jsx: 4 behavior tests (render, mine state, optimistic
    interaction, disabled-while-pending)

Deliverables:
  - lab08-spec.md: one-paragraph spec with explicit out-of-scope list
  - lab08-self-review.md: 3 issues caught and fixed in AI's first pass"

# git push -u origin solution/lab-08-exemplar
git checkout main
```
