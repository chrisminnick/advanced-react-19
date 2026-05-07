# Lab 8 — Instructor Notes

**Goal of this lab:** This is the capstone. Students should leave the lab having (a) shipped real working code with heavy AI assistance, and (b) demonstrated they can review their own AI-generated work using the checklist from Module 9. The self-review is the load-bearing deliverable. A perfectly-working feature without a meaningful self-review is a failed lab.

The lab is deliberately open-ended. Different students will pick different features at different scopes. That's fine — the deliverables are uniform even if the implementations aren't.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Pick + spec | 0–15 | Walking around. Watching for students whose specs are too big. The "out of scope" section is the maturity test. |
| Project context | 15–25 | Mostly hands-off. Help anyone whose AGENTS.md is empty or wildly stale. |
| Build | 25–70 | Hands off. The friction is the lab. Help only with environment issues. |
| Self-review | 70–85 | Watch for students writing "everything was fine." Push for specifics. |
| Submit | 85–90 | Help anyone wrap up cleanly. |

If the room is mostly senior, expect more diversity in feature picks and faster building. Push them to use the time savings for richer self-reviews.

If the room is mostly mid-level, accept that some students will still be implementing at the 70-minute mark. They can still write a partial self-review of what they did get to. Better to ship 60% of a feature with a real review than 100% of a feature with "looks fine."

---

## What you should be watching for

### During spec-writing (0–15 min)

- **Specs without "out of scope".** This section is the maturity check. Students who skip it usually scope-creep their feature mid-build.
- **Specs that are 3+ paragraphs.** Too big. Push them to trim or pick a smaller backlog item.
- **Students proposing custom features.** Welcome, but verify the scope is feasible in 45 min of build time. If they want to add WebRTC, redirect.
- **"Acceptance criteria: it works."** Vague. Push for user-visible behaviors.

### During project-context setup (15–25 min)

- **Students who skip this step entirely.** Pre-loading AGENTS.md is what makes the difference between AI-as-typing-assistant and AI-as-collaborator. If someone says "I don't need that, my AI is good enough," watch their build phase carefully — they'll hit the AI mistakes from Module 9.
- **Students whose AGENTS.md is from Lab 4.** That's fine, but make sure it covers Module 6/7/8 conventions (RSC patterns, state choice, testing rules) too.
- **Students who paste the entire codebase into the prompt.** Wasteful and counterproductive. AGENTS.md + relevant files is enough.

### During the build (25–70 min)

- **Students who don't read diffs.** The cardinal sin of this lab. If you see someone hitting "accept" without reading, intervene gently.
- **Students who batch the AI's work into one giant commit.** Defeats the paper trail. Push to commit per file or per logical unit.
- **Students whose AI starts producing the obvious antipatterns** (`'use client'` everywhere, useEffect+fetch, getByTestId tests). Two possibilities: their AGENTS.md isn't being read by their tool, or they didn't push back. Both are teachable moments.
- **Students whose AI gets stuck in a loop.** Sometimes the AI loses the thread and starts repeating mistakes. Tell the student to start a fresh conversation with the spec + AGENTS.md as the seed.

### During self-review (70–85 min)

- **"Everything was fine."** Almost certainly false. Sit with the student and walk through one component together using the checklist. They'll find at least one issue.
- **"Three issues" that are all formatting nits.** Push for real issues — patterns from Module 9, not whitespace.
- **Self-reviews that don't cite specific lines or files.** "The component had a bug" isn't reviewable. "PostCard.jsx line 23 used getByTestId instead of getByRole" is.

---

## Common AI patterns specific to this lab

These will come up regardless of which backlog item the student picks.

1. **AI proposes the right structure but wrong implementation.** It says "we'll add a Server Action in app/actions/reactions.js" — good. Then implements `addReaction` as a regular client function with no `'use server'`. The structure was right; the directive is missing.

2. **AI adds optimistic updates without `cancelQueries`.** Race condition between optimistic write and in-flight refetch. Subtle in dev, visible in race conditions.

3. **AI re-creates a query key inline instead of using your factory.** They've seen the queryKeys.js convention but don't always use it. Push back.

4. **AI generates tests with `await waitFor(() => expect(...))` when `findBy` would do.** Both work, but `findBy` is the simpler, more idiomatic version.

5. **AI hardcodes color/spacing/sizing instead of using your design tokens.** If you've established Tailwind classes or CSS variables, AI sometimes ignores them and inlines styles. Catch in self-review.

6. **AI uses the wrong React 19 hook.** It picks `useState` + `useEffect` for what should be `useActionState`, or skips `useFormStatus` and prop-drills `isPending`. Module 2 patterns the AI hasn't fully internalized.

---

## What "good" looks like for the self-review

A strong self-review:

- Cites three or more real issues from Module 9's checklist categories
- For each issue, shows the AI's code and the fixed code
- Explains WHY the AI's version was wrong, not just WHAT it was
- Mixes categories — not all four issues are in "tests"
- Honest about cases where the AI got it right
- Optional: notes whether AGENTS.md helped or didn't, and what they'd add to it

A weak self-review:

- "Three issues" that are all minor or stylistic
- "Issues" that aren't really issues (e.g., naming preferences)
- No code shown — just descriptions
- All issues in one category — suggests the student wasn't actually looking everywhere
- No reflection on what worked

---

## What to do when a student picks an unrealistic feature

Some students will pick option G (DMs) or H (search) and run out of time. That's OK if their self-review is honest — "I got 60% of the way; here's what I shipped, here's what I'd do next, here are the three issues I caught in what I did write."

Push back gently if a student is still writing fresh code at 80 minutes. The self-review needs at least 10 minutes; without it, the lab fails its purpose.

---

## Solution branch contents

The `solution/lab-08-exemplar` branch implements option B (Reactions). It contains:

- `lab08-spec.md` — a benchmark spec
- A working reactions feature: `ReactionBar.jsx`, `app/actions/reactions.js`, server-side route, tests
- `lab08-self-review.md` — a benchmark self-review with 4 issues (one each from hooks, boundaries, patterns, tests)
- A worked example of the kind of optimistic-update + invalidation pattern Module 5 established

Students whose self-reviews show 4+ issues across multiple categories are at exemplar level.

---

## Wrap-up at the end of the lab

When the class reconvenes, spend 10 minutes:

1. **"Show of hands: who pushed back on the AI at least once?"** All hands should go up. If not, push the room: "your AI was perfect every time?"
2. **"What was the most surprising mistake the AI made?"** Capture answers — these often surface patterns Module 9 didn't cover. Add to next cohort's content.
3. **"Did AGENTS.md help?"** Calibrate. If yes — what specifically? If no — what could the AGENTS.md have included to prevent the mistake?
4. **"Could you have shipped this without AI?"** Most students will say yes, but slower. The honest answer is the right answer — AI is leverage, not replacement.

This lab + Module 10 close out the course. Save 5 minutes at the end to acknowledge the work students did this week.
