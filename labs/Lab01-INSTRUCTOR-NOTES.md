# Lab 1 — Instructor Notes

**Goal of this lab:** Establish the AI-review pattern that runs through the entire course. Students need to leave Lab 1 understanding that AI-generated React code is a *starting point*, not a *finished product*. If they come away thinking "the AI did most of it for me, that's the point," the rest of the course will be harder.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Setup | 0–10 | Helping students who can't get the starter running. Most likely culprit: server can't reach MongoDB. |
| Part 1 — AI conversion | 10–55 | Circulating. Don't help students debug AI mistakes — let them see the failures. Do help with environment / Vite issues. |
| Part 2 — Review | 55–80 | Circulating. This is where you can be more directive. If a student's "three AI mistakes" are all minor style issues, push them to look harder. |
| Part 3 — Submit | 80–90 | Help anyone who's stuck. |

If the room is mostly senior, push Part 1 down to 35 min and pad Part 2 to 35 min — the review is the harder skill.

If the room is mostly mid-level, give Part 1 the full 50 min. Some students will still have a non-running app at the 50-minute mark; that's OK, the bug-hunting in Part 2 can happen on a partial app.

---

## What you should be watching for

### During Part 1

- **Students who copy-paste the AI's output without reading it.** This is the failure mode of the lab. If you see a student running `npm run dev` and immediately re-pasting the AI prompt because the app's broken, intervene. Ask: "before you re-prompt, read the diff. What's the AI changed?"
- **Students who get stuck on Vite-vs-CRA env vars.** Common. Just tell them: `process.env.REACT_APP_FOO` becomes `import.meta.env.VITE_FOO` in Vite, and they need to update both the env file and the references.
- **Students who don't run the app between AI batches.** Encourage running often. Each runtime error reveals something.

### During Part 2

- **Students who can't find any AI mistakes.** Either (a) their AI got lucky, (b) they aren't looking hard, or (c) their AI was so destructive they fixed everything before the review phase. Push them to explain *why* the AI's choices are correct. If they can't, that's a finding.
- **Students who file "the AI used `var` instead of `const`" as a mistake.** That's a style note, not a bug. Push for real issues — incorrect dependency arrays, wrong place to put a setter, derived-state-as-state.

---

## Common AI mistakes you'll see in this lab

These are the high-probability AI mistakes you can prime students to look for. Don't list all of them up front — let them find some.

1. **`useEffect` to derive state from props.** Almost universal in AI conversions of class components that had `componentWillReceiveProps` or `getDerivedStateFromProps`. The right answer is almost always "compute it inline."
2. **Missing dependency array on a `useEffect` that should run on mount only.** AI sometimes forgets the empty array → infinite re-render loop.
3. **Stale closure in socket handler.** Common because the socket is set up in a `useEffect`, and the AI forgets that closures over `messages` capture the initial empty array.
4. **State setters wrapped in their own `useEffect`.** AI does this when it sees a class method that called `setState` inside another method. The conversion should put the setter in the event handler, not in a synchronization effect.
5. **`forwardRef` left in place even though the prompt asked for ref-as-prop.** AI doesn't always commit to the new pattern, especially if the existing code had a custom display name on the forwardRef.
6. **`setState({ ...this.state, x })` converted to `setX({ ...x })` for a single field.** Loss of the broader merge semantics. Subtle, but breaks state when there were other fields.
7. **Race-prone `setCount(count + 1)` instead of `setCount(n => n + 1)`.** Especially in any handler that fires from a socket event.
8. **`socket.on(...)` without a corresponding `socket.off(...)` in the effect cleanup.** Multiple subscriptions per re-render, duplicated messages.

If a student presents three of these in their review, give them a high five and hold them up as exemplars.

---

## Stretch task — `useOptimistic`

About 20–30% of students will get to it depending on the room.

The most common stretch-task failure: students put the optimistic state in the message-list component and the `addOptimistic` call in the form component. They get cross-component pain because optimistic state is local to the component that holds it.

The right structure: lift both the messages array and `useOptimistic` into a parent that contains both the form and the message list. Pass `addOptimistic` down to the form, pass `optimisticMessages` down to the list.

A subtler trap: students render the optimistic and real messages independently and end up with duplicates after the server confirms. Make sure they understand that `useOptimistic` returns a *replacement* for the messages array — they should render `optimisticMessages`, not `[...messages, ...optimisticMessages]`.

---

## Solution branch contents

The `solution/lab-01-modernize` branch contains:

- `client/` migrated from CRA to Vite
- React 19 in `package.json` (exact pinned version, not `^`)
- All function components
- A `useChatConnection` custom hook that owns the socket lifecycle
- A `useAuth` custom hook that owns the auth token state
- A `lab01-ai-review.md` exemplar file showing the kind of review students should produce

There's also a `solution/lab-01-modernize-stretch` branch that adds `useOptimistic` for messaging, plus a small CSS animation for `.sending` bubbles.

---

## What to circulate with

- A tab open to react.dev's React 19 release notes for quick reference
- The Module 2 deck open to the "AI hook mistakes — your review checklist" slide so you can point students back to it
- A sticky note with the four most common AI mistakes from the list above so you can prime targeted hints

---

## Wrap-up at the end of the lab

When students come back together (after the lab break), spend 3–4 minutes asking the room:

1. "What did the AI do well?" — usually: tedious mechanical conversions
2. "What did it do badly?" — let students share their findings
3. "What surprised you?"

Capture the answers somewhere — they become the basis of Module 9 (Day 3 AI module) for this cohort.
