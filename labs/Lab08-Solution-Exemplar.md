# Lab 8 — Solution Exemplar

This document sketches `solution/lab-08-exemplar` — option B (Reactions) implemented end-to-end.

It's not the only "right" answer — students who picked any other backlog item and produced a working feature with a real self-review have passed the lab. The point of the exemplar is to show what a strong submission looks like.

---

## File layout (after the lab)

```
social-media-rr-v7/
├── lab08-spec.md                       ← spec written before any code
├── lab08-self-review.md                ← self-review after code
└── app/
    ├── actions/
    │   └── reactions.js                ← Server Action
    ├── components/
    │   ├── ReactionBar.jsx             ← Client Component (uses useTransition)
    │   ├── ReactionBar.test.jsx        ← tests
    │   └── PostCard.jsx                ← extended to render ReactionBar
    └── lib/
        └── queryKeys.js                ← extended with reactions keys
```

Plus the backend route in `social-media/server/routes/reactions.js`.

---

## Reference `lab08-spec.md`

```markdown
# Lab 8 spec — Reactions on posts

## What it does

Each post supports three reactions (heart, laugh, surprise). Users can toggle each
reaction independently. The post card shows aggregate counts per reaction and
highlights ones the current user applied.

## Acceptance criteria

- Clicking a reaction icon adds it for the current user (optimistic).
- Clicking again removes it.
- Counts update in the UI immediately and persist to the server.
- Other users' reactions appear without a manual refresh (TanStack Query refetch
  on focus is fine).
- Server rejects invalid reaction types with a 400 status.

## Where it lives

- Frontend: app/components/PostCard.jsx (extend), app/components/ReactionBar.jsx (new)
- Server Action: app/actions/reactions.js (new)
- API: server/routes/reactions.js (new)
- Tests: app/components/ReactionBar.test.jsx (new)
- Query keys: extend app/lib/queryKeys.js

## Out of scope

- Custom reaction emoji
- Reaction history / who-reacted modal
- Notifications when someone reacts to your post (that's option F)
- Animations beyond simple state changes
- Mobile-specific gestures
```

---

## Key file: `app/lib/queryKeys.js` (extended)

```js
export const queryKeys = {
  posts: {
    all: ['posts'],
    list: (filters = {}) => ['posts', 'list', filters],
    detail: (id) => ['posts', 'detail', id],
  },
  reactions: {
    forPost: (postId) => ['reactions', 'post', postId],
  },
  user: {
    me: ['user', 'me'],
  },
};
```

---

## Key file: `app/actions/reactions.js`

```js
'use server';

import { revalidatePath } from 'next/cache'; // (or RR v7 equivalent)
import { addReaction, removeReaction } from '@/lib/api';

const VALID_TYPES = ['heart', 'laugh', 'surprise'];

export async function toggleReactionAction(prevState, formData) {
  const postId = formData.get('postId');
  const type = formData.get('type');
  const action = formData.get('action'); // 'add' | 'remove'

  if (!VALID_TYPES.includes(type)) {
    return { error: 'Invalid reaction type', postId };
  }

  if (action === 'add') {
    await addReaction(postId, type);
  } else {
    await removeReaction(postId, type);
  }

  revalidatePath('/');
  return { error: null, postId };
}
```

---

## Key file: `app/components/ReactionBar.jsx`

```jsx
'use client';

import { useTransition, useOptimistic } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { toggleReactionAction } from '../actions/reactions';
import * as api from '../lib/api';

const REACTIONS = [
  { type: 'heart', emoji: '♥' },
  { type: 'laugh', emoji: '😂' },
  { type: 'surprise', emoji: '😮' },
];

export default function ReactionBar({ postId, currentUserId }) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: reactions = [] } = useQuery({
    queryKey: queryKeys.reactions.forPost(postId),
    queryFn: () => api.getReactions(postId),
  });

  const [optimistic, addOptimistic] = useOptimistic(
    reactions,
    (current, { type, action }) => {
      if (action === 'add') {
        return [...current, { type, userId: currentUserId, optimistic: true }];
      }
      return current.filter(
        (r) => !(r.type === type && r.userId === currentUserId)
      );
    }
  );

  const myReactions = new Set(
    optimistic
      .filter((r) => r.userId === currentUserId)
      .map((r) => r.type)
  );
  const counts = REACTIONS.reduce((acc, { type }) => {
    acc[type] = optimistic.filter((r) => r.type === type).length;
    return acc;
  }, {});

  function handleToggle(type) {
    const action = myReactions.has(type) ? 'remove' : 'add';
    addOptimistic({ type, action });

    startTransition(async () => {
      const fd = new FormData();
      fd.append('postId', postId);
      fd.append('type', type);
      fd.append('action', action);
      await toggleReactionAction({}, fd);
      queryClient.invalidateQueries({
        queryKey: queryKeys.reactions.forPost(postId),
      });
    });
  }

  return (
    <div className="reaction-bar" aria-label="Reactions">
      {REACTIONS.map(({ type, emoji }) => (
        <button
          key={type}
          type="button"
          aria-label={`${type} reaction`}
          aria-pressed={myReactions.has(type)}
          className={myReactions.has(type) ? 'active' : ''}
          onClick={() => handleToggle(type)}
          disabled={isPending}
        >
          <span className="emoji" aria-hidden="true">{emoji}</span>
          <span className="count">{counts[type]}</span>
        </button>
      ))}
    </div>
  );
}
```

---

## Key file: `app/components/ReactionBar.test.jsx`

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/setup';
import ReactionBar from './ReactionBar';
import { renderWithQueryClient } from '../test/utils';

describe('ReactionBar', () => {
  it('shows the three reaction buttons with counts', async () => {
    server.use(
      http.get('/api/posts/:id/reactions', () =>
        HttpResponse.json([
          { type: 'heart', userId: 'u-other' },
          { type: 'laugh', userId: 'u-self' },
        ])
      )
    );

    renderWithQueryClient(<ReactionBar postId="p1" currentUserId="u-self" />);

    expect(await screen.findByRole('button', { name: /heart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /laugh/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /surprise/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles a reaction on click', async () => {
    const user = userEvent.setup();
    server.use(
      http.get('/api/posts/:id/reactions', () => HttpResponse.json([])),
      http.post('/api/posts/:id/reactions', () => HttpResponse.json({ ok: true }))
    );

    renderWithQueryClient(<ReactionBar postId="p1" currentUserId="u-self" />);

    const heart = await screen.findByRole('button', { name: /heart/i });
    expect(heart).toHaveAttribute('aria-pressed', 'false');

    await user.click(heart);
    expect(heart).toHaveAttribute('aria-pressed', 'true');
  });
});
```

---

## Reference `lab08-self-review.md`

This is what a strong self-review looks like — four issues across multiple categories, each with code and reasoning.

```markdown
# Lab 8 self-review — Reactions feature

Reviewed against Module 9's checklist. Found and fixed 4 issues in the AI's
output. AI used: Cursor with claude-sonnet-4-6.

## Issue 1 — useEffect for optimistic state

**Where:** `app/components/ReactionBar.jsx`, lines 18-32 (initial draft)
**Category:** hooks

**What the AI produced:**

```jsx
const [optimistic, setOptimistic] = useState(reactions);

useEffect(() => {
  setOptimistic(reactions);
}, [reactions]);
```

**What I changed it to:**

```jsx
const [optimistic, addOptimistic] = useOptimistic(
  reactions,
  (current, { type, action }) => { /* ... */ }
);
```

**Why:** The AI synchronized optimistic state to props via useEffect — exactly
the pattern Module 2 flagged. Worse, it didn't actually do anything optimistic;
it just mirrored the server state. The right primitive is React 19's
`useOptimistic`, which gives me the optimistic insertion AND automatic
reconciliation when the server confirms.

## Issue 2 — Server Action without 'use server'

**Where:** `app/actions/reactions.js`, line 1 (initial draft)
**Category:** boundaries

**What the AI produced:**

```js
import { revalidatePath } from 'next/cache';

export async function toggleReactionAction(prevState, formData) {
  // ... rest of action
}
```

**What I changed it to:**

```js
'use server';

import { revalidatePath } from 'next/cache';

export async function toggleReactionAction(prevState, formData) {
  // ... rest of action
}
```

**Why:** The directive was missing. Without `'use server'` at the top of the
file, the action would be bundled as a regular client function — and would
fail at runtime when the form tried to call it across the client/server
boundary. Module 6 mistake category #3.

## Issue 3 — Test using getByTestId

**Where:** `app/components/ReactionBar.test.jsx`, lines 14-22 (initial draft)
**Category:** tests

**What the AI produced:**

```jsx
const heart = screen.getByTestId('heart-button');
expect(heart).toHaveClass('active');
```

**What I changed it to:**

```jsx
const heart = await screen.findByRole('button', { name: /heart/i });
expect(heart).toHaveAttribute('aria-pressed', 'true');
```

**Why:** Two issues here. First, `getByTestId` is the lowest-priority query
(Module 8 red flag #2). The button has an `aria-label`, so `getByRole` works.
Second, asserting on a CSS class couples the test to implementation; asserting
on `aria-pressed` couples it to the user-facing state. Refactor improves both.

## Issue 4 — Mutable query key in invalidation

**Where:** `app/components/ReactionBar.jsx`, line 47 (initial draft)
**Category:** patterns

**What the AI produced:**

```jsx
queryClient.invalidateQueries({
  queryKey: ['reactions', postId, Date.now()],
});
```

**What I changed it to:**

```jsx
queryClient.invalidateQueries({
  queryKey: queryKeys.reactions.forPost(postId),
});
```

**Why:** Including `Date.now()` in the query key meant the invalidation
target had a different key than the original query — so it never matched.
Bug class is "mutable query key" from Module 5. Fix: use the centralized
key factory from queryKeys.js.

---

## What worked well

- AGENTS.md was up to date — the AI used `useOptimistic` and `useTransition`
  on its own when I prompted with "build this in our React 19 idiom."
- The AI proposed the file structure first and I caught the missing
  `'use server'` directive before any code was written.
- Tests came together quickly because the AI followed my queryKeys factory
  and MSW handler conventions without prompting.

## What I'd add to AGENTS.md

- Explicit "Server Actions live in app/actions/, MUST start with 'use server'"
- A note that we use `useOptimistic` for optimistic updates, not state mirroring
- Example of the queryKeys factory pattern at the top of the file

## Reflection

I shipped this feature in ~50 minutes with the AI as collaborator. Without
AI, I'd estimate 90 minutes. The AI got 70% of the code right on the first
pass; the four issues above were caught in 15 minutes of self-review. The
review is what made the difference between "AI ships my bugs" and "AI ships
my code I reviewed."
```

---

## Verification checklist for grading

When checking a student submission:

- [ ] `lab08-spec.md` exists, fits on one screen, includes "out of scope"
- [ ] Working code on a feature branch, runs without errors
- [ ] At least one Server Action with `'use server'` directive (or equivalent)
- [ ] Tests use `getByRole` and `userEvent`
- [ ] `lab08-self-review.md` lists at least 3 issues with code and reasoning
- [ ] Issues span multiple categories (not all in one of hooks/boundaries/patterns/tests)
- [ ] At least one issue cites a specific Module 9 mistake category
- [ ] No "everything was fine" reviews

A submission with all eight is exemplar. 5–6 is passing. Fewer than 4 means the student didn't engage with the self-review skill — encourage them to redo Phase 4.
