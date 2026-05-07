# Lab 3 — Instructor Notes

**Goal of this lab:** Make the decision framework from Module 4 stick. The 60-second pitch is the load-bearing part — it forces students to commit to a position and defend it. Don't let them skip the pitch.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Setup + survey | 0–15 | Helping students who can't get the client running. Encouraging the slow read of `AppContext.jsx`. Most students rush this and miss the over-stuffed-context smell. |
| Pick a tool + plan | 15–25 | Circulating with one question: "what made you pick that?" If they can't answer it, they don't have a real justification. |
| Refactor | 25–75 | Hands off the keyboard. Students need to wrestle with this. Help only with environment issues, not design. |
| Justification + pitch | 75–90 | Encourage students to write the bullets *before* the pitch. The pitch is much better when there's writing behind it. |

If the room skews senior, push the refactor down to 40 min and pad the justification/pitch to 25 — defending a choice is the harder skill.

If the room skews mid-level, accept that some students will still be in the middle of the refactor at 75 min. They can still write a justification of where they got, what's still to do, and what they learned about the tool.

---

## What you should be watching for

### During the survey

- **Students who don't actually open `AppContext.jsx`.** You can tell — they jump to picking a tool without a sense of what's broken. Steer them back.
- **Students who write down "useEffect" or "useState" as the answer to client state shared widely.** That's a category error — those are local state hooks, not stores. Useful teaching moment.

### During tool selection

- **Students who pick Redux Toolkit because they recognize it.** This is the Stockholm-syndrome path — they're picking comfort, not fit. Ask them to defend the choice for *this app*. If they can, fine. If they can't, push them to consider Zustand.
- **Students who pick Jotai because it sounds new and cool.** Pleasant for the instructor; risky for the student. Ask them what shape of state would actually benefit from atoms here. If they can't answer, redirect.
- **Students who pick Zustand because "everyone says it's simple."** Best case: they're right. Common case: they're skipping the analysis. Push them to find one thing in this codebase that actively benefits from Zustand's API.

### During the refactor

- **Students leaving server state in the new store.** The single most common mistake. The point of Module 4 was that server state belongs in TanStack Query (Module 5) or RTK Query, not in a client store. If you see them dumping the posts list into Zustand, intervene gently.
- **Students writing one giant selector that returns the whole store.** Defeats the perf benefits of a fine-grained store. Show them how to slice.
- **Students putting things in the store that should be `useState` in one component.** The opposite mistake — over-storing. The sidebar's open/closed flag in a global store is a smell.

---

## Common AI mistakes you'll see in this lab

1. **AI puts everything in one big slice/atom/store.** Defeats the modularity benefit of every tool. Encourage feature-grouped slices.
2. **AI writes `setSidebarOpen`, `setTheme`, `setUser` style action names.** That's setter-shaped, not transition-shaped. `openSidebar`, `closeSidebar`, `signIn(user)`, `signOut()` are clearer.
3. **AI uses `useState` inside the store factory function.** Doesn't work — it's a hook called outside a component. Watch for this in Zustand store definitions.
4. **AI suggests adding `useEffect` to sync the store to the URL.** Almost always the wrong fix. URL state belongs in the URL (search params, route params), not in a synchronized store.
5. **AI keeps the bloated context in place "for backward compatibility"** while adding a parallel store. Now the app has two sources of truth. Reject — make the AI commit to one.

---

## What "good" looks like for the justification

A strong justification names a specific aspect of the codebase. Examples of the kind of bullets that earn a nod:

- *"Zustand's per-slice selectors mean the PostsFeed component re-renders only when the posts array changes. With our previous AppContext, every theme toggle re-rendered the entire feed."*

- *"The cart's state graph (items → subtotal → discount → total) maps cleanly to derived atoms. Other tools would have me writing memoized selectors; Jotai gets dependency tracking for free."*

- *"RTK Query gives us cache invalidation and refetch-on-window-focus out of the box. Since most of this app is server state, that's a bigger win than Zustand's small bundle."*

Weak justifications say things like "Zustand is simple" or "I picked Redux because that's what we use at work." Push for codebase-specific reasoning.

---

## Running the 60-second pitches

When the class reconvenes, run pitches as a structured round. Each student gets exactly one minute. Suggested format:

1. **Round 1 — pitches (10 min):** Each student stands up (or unmutes) and gives their 60 seconds. No questions during the round.
2. **Round 2 — questions (5 min):** Ask the class: "Whose pitch made you reconsider the tool you picked?" Let people respond.

If the room is mixed Zustand / Jotai / RTK, the comparison is rich. If everyone picked the same tool, that's also instructive — ask the class why and whether the room's homogeneity is fit-driven or comfort-driven.

---

## Solution branch contents

The `solution/lab-03-*` branches contain:

- **`solution/lab-03-zustand`** — feature-grouped slices in `app/stores/`, devtools middleware, persist middleware on the theme slice.
- **`solution/lab-03-jotai`** — atoms grouped by feature in `app/atoms/`, derived atoms for computed values, async atoms for the auth user.
- **`solution/lab-03-rtk`** — slices in `app/store/`, RTK Query baseApi for the backend, selectors with `createSelector`.

All three reach the same end state in terms of UX. They differ in code shape, file layout, and the size of the diff from the starting point.

---

## Wrap-up at the end of the lab

After the pitches, spend 5 minutes asking the room:

1. **"Did you change your mind about your tool during the refactor?"** Some will have. The "tool fit" is rarely the same as the "tool comfortable."
2. **"What surprised you about the tool you picked?"** Learning by friction.
3. **"What's the smallest piece of state you're still tempted to put in the store?"** Identifying the temptation is half of resisting it.

Capture the answers — they often surface insights worth incorporating into next cohort's Module 4.
