# Lab 6 — Instructor Notes

**Goal of this lab:** Build the measurement-first habit. Most students arrive at perf work with a mental model of "I'll just add useMemo to everything." This lab teaches them that the right answer is "I'll measure, then fix the actual bottleneck."

The seeded bottlenecks in the starter are deliberately diverse — some are render-time problems, some are bundle-size problems, some are off-main-thread problems. Different students will pick different optimizations, and that's the point.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Baseline | 0–15 | Walking around. Watching for students who skip to "fixing" without measuring. Push them back to the Profiler. |
| Optimization 1 | 15–30 | Hands-off circulating. Help with environment issues only. |
| Optimization 2 | 30–45 | Same. By now students have a rhythm. Watch for ones who picked the "easy" fix three times — encourage variety. |
| Optimization 3 | 45–60 | Same. |
| Write-up | 60–70 | Push students to be specific. "It got faster" isn't a write-up. |
| Submit | 70–75 | Help anyone who didn't finish wrap up cleanly. |

If the room is mostly senior, give the baseline phase the full 15 min — they'll find more nuanced problems with deeper measurement. If mid-level, accept that some students may pick three "easy" optimizations (lazy-loads, mostly) — that's still a passing lab.

---

## Seeded bottlenecks in the starter

The starter has the following intentional problems. Don't tell students which optimizations apply where — that's the lab. But you should know them so you can confirm a student's diagnosis.

### Render-time problems

1. **Search-field-causes-feed-rerender** (Optimization A in the lab). The home page's search input writes to `useState` at the parent. The `<PostsFeed>` is a sibling, not a child, but it reads `searchQuery` via context and re-renders on every keystroke. Fix: lift the search state OUT into URL params, or push it INTO a context that PostsFeed selects from with a narrow selector.

2. **TrendingSidebar's expensive recalc** (Optimization B). The component derives a tag-frequency analysis from the posts list inline in render. Even with the Compiler, the dep includes `posts` which changes reference on every fetch — making the memoization ineffective. Fix: useMemo with a stable derivation, or move the calculation server-side.

3. **PostCard re-renders for every post update** (related to A). Even if the search fix is applied, when ANY post updates, ALL post cards re-render. Fix: split each card's data so only the changed card re-renders. Real fix is virtualization (the stretch task).

### Bundle-size problems

4. **Composer ships unused** (Optimization C). The post-creation form imports a markdown editor (`@uiw/react-md-editor` or similar — ~80KB). Most users never click "New post". Fix: lazy-load.

5. **Recharts ships unused** (Optimization D). The user profile route imports Recharts for the activity chart, ~138KB. Fix: lazy-load the chart, not the page.

### Architectural problems

6. **Old fetch + useEffect in profile/notifications** (Optimization F). After Lab 4, students migrated home.jsx but probably not the other routes. The non-migrated routes show the dedup/cache regression. Fix: extend Lab 4's pattern.

7. **Scroll handler fires every event** (Optimization G). The infinite-scroll trigger on PostsFeed is wired directly to `onScroll` without throttling. Fix: throttle to ~100ms.

8. **Markdown rendered on main thread** (Optimization H). PostDetail renders markdown inline in render with a heavy parser. Fix: Web Worker via Comlink. This is the hardest optimization; encourage only fast finishers.

### Compiler-related

9. **Compiler not enabled** (Optimization E). The starter doesn't have `babel-plugin-react-compiler`. Adding it removes the need for several manual `useMemo`s in the codebase. Fix: enable + run eslint plugin.

---

## What you should be watching for

### During baseline

- **Students who skip the Profiler.** "I'll just look at Lighthouse" misses most of the React-specific findings. Push them to record at least one Profiler session.
- **Students who measure on the production build only.** Some optimizations only show up in dev (re-render counts), others only in prod (bundle size). Both matter.
- **Students who don't write `lab06-baseline.md` first.** Without a baseline, the after-numbers don't mean anything.

### During optimization

- **Students who pick three lazy-loads.** All three are valid optimizations, but it suggests the student didn't engage with the render-time problems. Push them to pick at least one render fix.
- **Students who claim "Compiler enabled, all done."** Enabling the Compiler is one optimization, not three. Push them to find what the Compiler couldn't fix.
- **Students whose "before/after" numbers are essentially identical.** Either they didn't measure right, or the optimization didn't actually do anything. Either way, worth investigating.

### During the write-up

- **Students who skip "what didn't help."** This section is the maturity test. Real perf work has dead ends. Push them to remember and document at least one.
- **Students whose write-up is vague.** "Made it faster" isn't a result. "LCP went from 4.1s to 3.4s, a 17% improvement" is.

---

## Common AI mistakes you'll see in this lab

1. **AI suggests `useMemo` on every value.** Cargo-culted. Push back: which renders did this fix? What did the Profiler say?
2. **AI suggests `React.memo` on every component.** Adds boilerplate without measurement justification.
3. **AI suggests "use a Web Worker" for fast computations.** Overhead exceeds benefit. Push back to measurement.
4. **AI says "the bundle is too big" without naming the actual culprit.** Push for specifics — which dep? What size?
5. **AI suggests rewriting the data layer in TanStack Query** when the bottleneck is render-time. Wrong solution to wrong problem.
6. **AI suggests changes that "should be faster" without measuring.** The most common AI sin in perf work.

---

## What "good" looks like for `lab06-results.md`

A strong write-up has:

- Specific before/after numbers, not vague descriptions
- A "what didn't help" section with at least one entry
- A "what I'd do next" section showing they understand more work remains
- An optimization that addressed a render-time problem (not just three lazy-loads)
- Honest reporting — including any cases where the number got worse before they backed out

A weak write-up:

- "Things got faster" without numbers
- All three optimizations are bundle-size lazy-loads
- No mention of dead ends
- Numbers that seem fabricated (suspiciously round)

---

## Stretch — virtualization

Common failure modes:

1. **Virtual container has no height.** Posts don't render because the scroll element has 0px height. Fix: `style={{ height: '80vh', overflow: 'auto' }}` or similar.
2. **Posts have variable height and the layout jumps.** Fix: use `measureElement` from TanStack Virtual, or set fixed heights.
3. **Re-render storm INSIDE the virtual list.** The visible posts still re-render too often. Fix: that's a separate optimization (memo on PostCard, or selector-based reads).

---

## Solution branch contents

The `solution/lab-06-perf` branch applies:

- Optimization A (search lifted out of feed via URL params)
- Optimization B (TrendingSidebar `useMemo` with stable deps)
- Optimization C (composer lazy-loaded)
- Optimization E (React Compiler enabled)
- Stretch — TanStack Virtual on the posts feed

The branch's `lab06-results.md` shows the kind of write-up to aim for.

---

## Wrap-up at the end of the lab

When the class reconvenes, spend 5–10 minutes:

1. **"Whose biggest improvement was on a metric you didn't expect?"** Sometimes a bundle fix dramatically improves LCP, or a render fix surprisingly helps CLS. Surfacing surprises reinforces the measurement habit.
2. **"Whose optimization didn't help?"** The dead-end sharing is more valuable than the wins.
3. **"What's the smallest change that gave you the biggest win?"** Usually a lazy-load or the Compiler. Reinforces "low-effort high-leverage" thinking.

If the room delivered a wide range of optimizations, that's a successful lab. If everyone picked the same three, your students copied each other or your seeded problems were too obviously hierarchical — adjust for next cohort.
