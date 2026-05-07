# Lab 5 — Instructor Notes

**Goal of this lab:** Make the Server/Client boundary intuitive. Most students leave Module 6 understanding the rules in theory; this lab is where they internalize them. The `BOUNDARY-NOTES.md` deliverable is the load-bearing piece — it forces students to defend each `'use client'` they wrote.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Setup + read | 0–10 | Helping students who can't get the Next.js dev server running. Most likely culprit: Node version too old (need Node 22). Push the slow-read of `lib/data.js` so students see the deliberate `await sleep(...)` calls — that's what makes the streaming stretch meaningful. |
| Part A — Stats cards | 10–25 | Hands off. The cards are easy. Watch for students who reflexively add `'use client'` to a Server Component. |
| Part B — Activity feed + team list | 25–40 | Walking around. Some students will ask why the page is slow now — perfect setup for the streaming stretch. Don't fix it; let them feel it. |
| Part C — Server Action | 40–60 | This is where most questions come from. The `useActionState` + `useFormStatus` pairing trips up a third of the room. The Server Action's `'use server'` directive is also frequently misplaced. |
| Part D — Filter widget | 60–70 | Push students to keep `<ActivityFeed />` as a child of `<FilterToggle />` rather than importing it. The composition-via-children pattern is the takeaway. |
| Part E — Document | 70–75 | Encourage real specificity. "I used 'use client' because I needed state" isn't enough — they should name the hook, name the file, name the alternative they considered. |

If the room is mostly senior, push Parts A-B down to 25 min and pad Part C to 30 min. The validation + progressive enhancement pieces are where senior students learn the most.

If the room is mostly mid-level, accept that some students won't finish Part D. The Server Action work in Part C is the core learning; Part D is reinforcement.

---

## What you should be watching for

### During Part A

- **Reflexive `'use client'`.** When a card doesn't render at first because of a typo in the data path, students sometimes add `'use client'` thinking it'll help. It won't — Server Components are simpler, not more fragile. Push them to read the actual error.
- **`async` left off the page function.** The data fetch then fails because await is in a non-async context. Easy fix; common stumble.

### During Part C

- **`'use server'` at the top of the file** (treating it like `'use client'`). It's an inline directive in the function body, not a file-top directive. Both work in some cases but the inline form is what the lab teaches.
- **`revalidatePath` forgotten.** The form submits, the data layer creates the task, but the dashboard doesn't update. Easy to miss because the form state shows "success."
- **Validation errors lose form values.** If the action returns just `{ error: '...' }` without echoing back `title` and `status`, the form clears the user's input on validation failure. The state shape in the lab includes `title` and `status` in the return for exactly this reason. Watch for students who simplify the return and lose this.
- **`useFormStatus` called in the wrong component.** If they put it in `AddTaskForm` itself (where the `<form>` is), it returns `null`. It needs to be in a descendant — hence the separate `SubmitButton`.

### During Part D

- **Importing `<ActivityFeed />` directly into `<FilterToggle />`.** The Client Component doesn't need to import the Server Component — it receives it via children. If a student tries the import path, they'll get a build error, which is the lesson.
- **State management for the filter expanding.** Some students will try to plumb the filter value down through context to `<ActivityFeed />`. That doesn't work because the activity feed is a Server Component — it can't read client state. The right answer is URL params (the stretch path) or accepting that the toggle is just a UI demo here.

---

## Common AI mistakes you'll see in this lab

1. **AI adds `'use client'` to the dashboard page** when the build complains about a hook violation. The right fix is to extract the hook-using component, not flip the whole page to client.
2. **AI passes the form's `onSubmit` prop instead of `action`.** Old-pattern bias. The lab uses `<form action={fn}>`, not `<form onSubmit={fn}>`.
3. **AI uses `useState` to mirror the Server Component's data inside `AddTaskForm`.** Server Component data can't be read from a sibling Client Component without prop-passing, but AI sometimes invents a bogus subscription. Reject — server data flows in via props or revalidation.
4. **AI uses `redirect` from inside the action and then tries to render a success message.** `redirect` throws — anything after it doesn't run. The lab's pattern returns `{ success: true }` from the action and lets `revalidatePath` refresh the data.
5. **AI uses `useEffect` to refetch the dashboard data after submission.** Wrong — `revalidatePath` is the framework's mechanism. `useEffect` would re-fetch on the client, defeating the Server Component caching.
6. **AI marks the Server Action with `'use client'`.** Common confusion. Server Actions use `'use server'`, not `'use client'`.

---

## What "good" looks like for `BOUNDARY-NOTES.md`

A strong write-up cites the specific hook or API that forced the boundary, AND mentions the alternative considered. Examples of bullets that earn praise:

- *"`SubmitButton.jsx` is `'use client'` because it calls `useFormStatus`. I considered putting `disabled={isPending}` directly on the form via a useActionState destructure, but extracting the button as its own component lets me reuse it on the (future) edit-task form."*

- *"`FilterToggle.jsx` is `'use client'` because it owns a piece of UI state (`completedOnly`) that affects rendering. I deliberately kept `<ActivityFeed />` server-side and passed it as children — that means filtering currently doesn't actually filter (it's just a demo), but the right production answer is URL params, which would let the server re-render."*

A weak write-up says "I used 'use client' because I needed state." That's where the AI starts; that's not where students should land.

---

## Stretch task — streaming with Suspense

The most common failure: students wrap each `<Suspense>` around an awaiting parent component. The fallback never appears because the parent itself doesn't suspend — only its child that calls `await` does.

The right structure: each `<Suspense>` boundary contains an awaiting Server Component, not the parent that *calls* one. The lab's stretch instructions show this — make sure students extract the data-fetching logic into the suspending child.

Second common failure: skeletons that don't match the real UI's shape. The page jumps when content arrives. Push students to make the skeletons the same approximate dimensions.

---

## Solution branch contents

The `solution/lab-05-dashboard` branch contains:

- Three stat-card Server Components (or one parameterized one)
- ActivityFeed and TeamList as Server Components
- `AddTaskForm` (Client) + `SubmitButton` (Client) using `useActionState` and `useFormStatus`
- `FilterToggle` (Client) wrapping `<ActivityFeed />` as children
- `BOUNDARY-NOTES.md` matching the benchmark format above
- A `revalidatePath('/dashboard')` call in the action

The `solution/lab-05-streaming` branch adds:

- `<Suspense>` boundaries around each slow section
- `StatsRow`, `ActivityFeed`, `TeamList` as suspending Server Components
- Three skeleton components matching the real UI's shape
- Updated `BOUNDARY-NOTES.md` noting that none of the streaming additions required new client boundaries

---

## Wrap-up at the end of the lab

When the class reconvenes, spend ~5 min asking the room:

1. **"How many `'use client'` directives did you end up with?"** Most students will have 2–3. Anyone with 5+ probably escape-hatched somewhere — flag for review.
2. **"What was the moment you understood the boundary?"** Useful to capture. Often it's seeing the build error from importing a server-only file into a client component.
3. **"What surprised you about Server Actions?"** Common answer: how thin the form code became compared to a TanStack Query mutation. Both are fine; both have their place. Lab 5 is the place to feel that contrast.
