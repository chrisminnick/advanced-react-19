# Lab 7 — Instructor Notes

**Goal of this lab:** Build the AI-test review skill. Most of Module 8's content lands during the review phase of this lab — students see in their own code the difference between behavior tests they wrote and implementation tests an AI generated. The keep/refactor/delete framing makes the judgment explicit.

The setup phase is necessarily long because Vitest + RTL + MSW is a non-trivial environment. Don't compress it; without good setup, the rest of the lab fails.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Setup | 0–15 | Helping with environment issues. MSW v2 syntax (`http.get` not `rest.get`) is the most common stumble. The `setupFiles` path being wrong is the second. |
| Part A — Baseline | 15–40 | Walking around. Watching for students who default to `getByTestId` or `fireEvent`. Push them back to role-based queries. |
| Part B — AI extends | 40–55 | Hands off. The AI's extension is what it is. Some students will be tempted to "help" the AI; resist — the unedited output is what we're reviewing. |
| Part C — Review | 55–70 | This is the part you've been preparing the room for all module. Sit with students whose verdicts are too quick — push them to cite specific red flags. |
| Submit | 70–75 | Help anyone wrap up. |

If the room is mostly senior, give Part A 35 min and pad Part C to 20 — the review is where senior judgment shines.

If the room is mostly mid-level, accept that some students may finish the review with only 5–6 of the AI's tests properly classified. Encourage them to keep a clear "I ran out of time on these" note.

---

## What you should be watching for

### During setup

- **Wrong MSW version syntax.** v1 (`rest.get`, `setupServer` from `msw`) vs v2 (`http.get`, `setupServer` from `msw/node`). The lab uses v2. AI-generated setup code from older training data sometimes leaks v1 syntax.
- **`setupFiles` not running.** Tests fail with "ReferenceError: server is not defined" or similar. Check the relative path in `vite.config.js`.
- **`onUnhandledRequest: 'error'` flagging legitimate requests.** Sometimes a TanStack Query client tries to refetch in the background. Add the URL to handlers, or change the option to `'warn'` for the lab.

### During Part A (baseline tests)

- **Students who default to `getByTestId`.** Push them to read the component's accessible roles. Most apps have hidden roles students don't realize are there.
- **Students who write a "renders without crashing" test.** Smoke tests are AI's pattern — student baselines should be richer.
- **Students who skip `userEvent.setup()`** and call `userEvent.type` directly. That works but is the legacy pattern. Push to setup.
- **Students who don't `await` userEvent.** Common — works in dev, flaky in CI.

### During Part B (AI extends)

- **Students who edit the AI output before reviewing.** That defeats the lab. Tell them: "commit it as-is, even broken — Part C is where we fix."
- **Students who ask AI to "follow my style."** Fine, but doesn't exercise the review skill as well. The point of this lab is to see what AI does *unsupervised*.

### During Part C (review)

- **Students whose every verdict is "keep."** Either their AI got lucky (rare) or they aren't engaging. Sit with them and walk through one test together.
- **Students whose every verdict is "delete."** Possibly justified — some AI extensions really are bad — but more often the student is being lazy. Push for "refactor" where the test has the right idea but the wrong implementation.
- **Students whose reasons are vague.** "It's bad" isn't a reason. "Spies on `useState` (red flag #1)" is.

---

## Common AI-generated tests you'll see in this lab

These are patterns to expect when AI extends a baseline suite. You can use this as the answer key when checking student verdicts.

1. **"renders without crashing"** — smoke test with no assertions. **Verdict: delete.** Ships zero value.

2. **"matches snapshot"** — full-component snapshot. **Verdict: delete.** Will fail on every visual refactor.

3. **`vi.spyOn(React, 'useState')`** — spying on hooks. **Verdict: delete.** Red flag #1.

4. **`fireEvent.change(input, { target: { value: 'x' } })`** — implementation-level event. **Verdict: refactor** to `userEvent.type`. Red flag #4.

5. **`expect(screen.getByTestId('submit-btn'))`** when there's a `<button>` element. **Verdict: refactor** to `getByRole`. Red flag #2.

6. **Tests that mock individual `api.js` functions** instead of using MSW. **Verdict: refactor** to MSW. Red flag #5.

7. **`await new Promise(r => setTimeout(r, 500))`** — arbitrary waits. **Verdict: refactor** to `findBy` or `waitFor`. Red flag #6.

8. **Tests that don't render anything**, just call utility functions. **Verdict: delete or move** to a separate utils.test.js. Red flag #7.

9. **Tests of integration with TanStack Query that re-implement the cache.** **Verdict: refactor** to use `QueryClientProvider` with a clean instance per test.

10. **Tests that test the same behavior as the baseline.** **Verdict: delete.** Duplicate.

A solid student review identifies 5–6 of these patterns across the AI's 8–10 tests.

---

## What "good" looks like for `lab07-review.md`

A strong review:

- Every AI test has an explicit verdict and a reason
- Reasons cite specific red flags from Module 8
- "Refactor" verdicts include the actual refactored test (or a clear sentence on what was changed)
- "Delete" verdicts justify why the behavior wasn't worth testing OR was already covered
- The student's final test count is smaller than what the AI generated (typical: AI produces 10, student keeps 4–5)

A weak review:

- Vague verdicts ("test is bad", "looks fine")
- All "keep" or all "delete"
- No mention of the red-flag list
- Test count after review is higher than what the AI generated (suggests no real triage happened)

---

## Common student mistakes during review

1. **Keeping a brittle test because it passes.** Passing isn't the bar. Survives-a-refactor is the bar.
2. **Refactoring AI tests instead of deleting them.** Some tests should just go. Refactoring everything is a sign the student is unwilling to discard work.
3. **Deleting tests that test real behavior.** Sometimes a verdict of "delete" is wrong — the test is testing something useful, just inelegantly. Push back.
4. **Not running `npm test` after refactoring.** The refactored tests should still pass. If a student's review section says "refactored to use userEvent" but the test no longer compiles, they're not really reviewing.

---

## Stretch — Playwright

Common failures in the stretch:

1. **Forgetting `npx playwright install chromium`.** First-time users get a confusing error.
2. **Wrong `baseURL`.** If the dev server is on a different port, the test 404s.
3. **The `webServer` config tries to start the dev server but it's already running.** Use `reuseExistingServer: true`.
4. **Login state doesn't persist.** Playwright runs in fresh contexts by default. The lab's e2e is a single test, so that's fine — but for richer e2e, students will need `storageState`.

---

## Solution branch contents

The `solution/lab-07-tests` branch contains:

- Full Vitest + RTL + MSW setup
- A baseline 4-test suite for `LoginForm`
- A simulated AI-extended suite (8 tests, with planted red flags)
- A `lab07-review.md` matching the benchmark format above
- The post-review state: 6 tests total (4 baseline kept, 2 AI tests refactored, 6 AI tests deleted)

The `solution/lab-07-stretch` branch adds one Playwright e2e for the login flow.

---

## Wrap-up at the end of the lab

When the class reconvenes, spend ~5 min:

1. **"What ratio of AI tests did you keep?"** Typical answer: 30–50%. Anyone keeping 80%+ probably wasn't being critical enough. Anyone keeping <10% might have been too aggressive.
2. **"Which red flag came up most?"** Usually `getByTestId` or `fireEvent`. Surfaces the muscle memory students need to build.
3. **"Did the AI add any tests you wouldn't have thought of?"** Sometimes it does — boundary cases, error states. Calibration moment: AI-generated tests aren't categorically bad, just often miscalibrated.

This lab is the bridge to Module 9. Capture the answers — they feed directly into the AI module's "what works, what doesn't" content for the next cohort.
