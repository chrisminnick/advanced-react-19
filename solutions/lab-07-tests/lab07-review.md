# Lab 7 AI test review

I gave Cursor (Claude Sonnet 4.6) my baseline `NewPostForm.test.jsx` from
Part A and asked for 8 additional tests, with the role/label/userEvent
guidance from the lab handout. Below is every test it generated, with my
verdict and reason. Red-flag numbers reference Module 8's "AI red-flag
list" slide.

I kept 2, refactored 1, deleted 5. The two I kept are now in
`NewPostForm.test.jsx` below the comment marker.

## AI test #1 — "shows 'Posting…' while the mutation is in flight"

**Verdict:** **keep** (with one tweak — see below).

**Reason:** Behavior-focused (covers the pending UI), uses MSW to introduce
a small delay, asserts on the visible role+name. Solid. The only change I
made was to override the handler with `server.use(...)` instead of
`vi.useFakeTimers()` — fake timers in this kind of test (red flag #6
adjacent) made the assertion racy.

## AI test #2 — "does not submit when the body is whitespace-only"

**Verdict:** **keep**.

**Reason:** Tests a real behavior (the disabled-when-trimmed-empty rule),
asserts on the visible button state, and counts handler invocations as a
defense-in-depth check. The closest thing to red flag #5 (function
mocking) is the request counter in the handler, which is fine — it counts
network requests, not function calls.

## AI test #3 — "calls useMutation with the correct mutationFn"

**Verdict:** **delete**.

**Reason:** Spies on `@tanstack/react-query`'s `useMutation` via
`vi.spyOn` and asserts on the args. **Red flag #1** (testing
implementation, not behavior) and **#3** (asserting on internal calls).
The behavior — that submitting the form creates a post — is already
covered by the "clears the inputs after a successful submit" baseline
test plus the optimistic test in PostsFeed.

## AI test #4 — "renders without crashing"

**Verdict:** **delete**.

**Reason:** Pure smoke test. No assertion, no behavior. Adds CI time
without proving anything. (Module 8 doesn't have a numbered red flag for
this, but it should — call it #0.)

## AI test #5 — "matches snapshot"

**Verdict:** **delete**.

**Reason:** **Red flag #8.** Snapshot of the entire form. Will fail on
every CSS class rename, label tweak, or button text adjustment, with no
information about whether anything actually broke.

## AI test #6 — "input value updates on change event"

**Verdict:** **delete**.

**Reason:** Uses `fireEvent.change(input, { target: { value: 'x' } })` —
**red flag #4**. Also, this is a React-the-library test, not a
NewPostForm test. If `useState` doesn't update the input, we have bigger
problems than this component.

## AI test #7 — "calls setTitle and setBody on input"

**Verdict:** **delete**.

**Reason:** Spies on `useState` setters via `vi.spyOn(React, 'useState')`.
**Red flag #1** in its purest form. Will fail the moment we switch from
two `useState`s to one `useReducer`, even though the form still works
identically.

## AI test #8 — "submit button is disabled when isPending"

**Verdict:** **refactor**.

**Reason:** The intent is right (test the pending state), but the AI
mocked `useCreatePost` to return `{ isPending: true }`. **Red flag #5**
(mock at the network, not the function). I refactored this into AI test
#1 above, which gets the same coverage by introducing a slow MSW handler
and observing the real pending state.

---

## Aside — what the AI did well

For honesty's sake, two things to acknowledge:

- It correctly used `userEvent.setup()` once per test rather than the
  deprecated direct `userEvent.click(...)` calls. That's something many
  hand-written suites still get wrong.
- It picked up on the existing baseline's pattern of `screen.findBy*` for
  async assertions. None of its tests used `waitFor` with a manual
  expectation — the easier and more correct primitive was used.

So the takeaway isn't "AI tests are useless." It's "two of eight AI tests
were keepers, and a checklist saved me from shipping the other six."
