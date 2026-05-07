# Lab 2 — Instructor Notes

**Goal of this lab:** Make the framework comparison from Module 3 stick in muscle memory. Students need to feel the differences — RR v7's loader-redirect pattern vs Next.js's middleware-then-page — by typing both, not just reading slides.

---

## Timing

| Phase | Minutes | What you should be doing |
|---|---|---|
| Setup | 0–10 | Helping students who can't get the three processes running. Most likely culprit: port collision (something else on 5173 or 3000) or the backend can't reach Mongo. |
| Part A — RR v7 | 10–60 | Circulating. RR v7 is most students' first encounter with framework mode — expect questions about the routes config and where loaders/actions live. Don't help them debug auth bugs they could find themselves; do help with terminology and file location. |
| Part B — Next.js | 60–95 | Circulating. By now they've built the feature once and porting is faster. Watch for over-confidence — Next.js's middleware patterns trip them up. |
| Part C — Reflection + submit | 95–105 | Help anyone still finishing. Encourage students to write the reflection while their hands remember what they did. |

If the room is mostly senior, push Part A down to 40 min and pad Part B to 50 min — the porting reveals more contrast.

If the room is mostly mid-level, give Part A the full 50 min and accept that some students won't finish Part B.

---

## What you should be watching for

### During Part A (RR v7)

- **Students confused about `routes.ts` vs JSX route declarations.** RR v7 framework mode uses a config file, not JSX. Students fresh from v6 will keep trying to write `<Route />` JSX. Steer them to the config helpers.
- **Students putting auth logic in a wrapper component instead of a loader.** Old habit from v6. Push them to put the redirect in the loader so the protected component never even renders for unauth users.
- **Students using plain `<form>` instead of `<Form>`.** Reminder: `Form` from `react-router` enhances the form to call the action. Plain `<form>` does a regular browser POST and won't trigger revalidation.

### During Part B (Next.js)

- **Students putting auth checks inside the page component.** This is where they're tempted to copy the loader pattern from Part A. The right answer in Next.js is middleware. Be firm: "the framework gives you a place for this, use it."
- **Students writing the Server Action without `'use server'`.** The error is non-obvious. If you see "is not a function" at runtime on form submit, the directive is missing.
- **Students forgetting `credentials: 'include'` when calling the backend from a Client Component.** Less of an issue in Next.js because most fetches will be in Server Components — but it bites when they reach for client-side fetching.

---

## Common AI mistakes you'll see in this lab

These are the high-probability AI mistakes to look for. Don't list them up front — let students find some.

1. **AI puts an auth check in a `useEffect` in the home page component.** Wrong on both frameworks. RR v7 should redirect from the loader; Next.js should redirect from middleware.
2. **AI uses `react-router-dom` v6 patterns** (BrowserRouter, Routes/Route JSX) when prompted to write RR v7. Old training data leaks through.
3. **AI uses Pages Router patterns** (getServerSideProps, _app.js) when prompted to write Next.js App Router. Same problem.
4. **AI sets the session cookie in the loader** (RR v7) instead of in the action. Only actions can set headers on the response.
5. **AI puts `'use client'` at the top of a Server Component** to make a client-only library work. Almost always the wrong fix — push students to refactor instead.
6. **AI uses `localStorage` for the session token.** This is the AI doing 2018-era SPA auth. Reject — the lab uses HTTP-only cookies for security.

If a student finds two or more of these and explains why each is wrong, they've internalized the lecture content. Tell them so.

---

## What "good" looks like for the reflection

Strong reflection paragraphs cite specifics. Examples of the kind of answers that earn praise:

- *"In RR v7 the auth check lives next to the page component in `home.jsx`'s loader. In Next.js it's in `middleware.js`, which is a separate file with its own matcher config. The Next.js separation is cleaner for app-wide auth, but it makes the per-route exceptions harder to express — I'd have had to add three more matchers if I'd wanted some `/home/*` routes to be public."*

- *"The Next.js Server Action made the form submission feel one step shorter than RR v7's `Form` + `action` export — but the absence of an explicit handler made it harder to know where my code was running until I traced through. RR v7's `loader`/`action` exports are noisier on the page but more predictable."*

Weak reflections say things like "Next.js was easier" without citing what. Push students to be specific.

---

## Stretch task — streaming nested route

The stretch task tests Suspense + `defer()` (RR v7) or `loading.jsx` (Next.js). The most common failure is suspending too high in the tree, so the entire page waits — which defeats the point.

The right structure: render the shell synchronously, wrap only the data-heavy parts in `<Suspense>`. In RR v7, return a non-awaited promise from the loader using `defer({ posts: postsPromise })` and let the component `await` via `<Await>`. In Next.js, just `await` inside a child Server Component and surround it with `<Suspense>` in the parent.

---

## Solution branch contents

The `solution/lab-02-*` branches contain:

- **`solution/lab-02-rr-v7`** — full RR v7 implementation including the routes config, loaders, actions, the auth helper, and a sample home page that lists posts.
- **`solution/lab-02-nextjs`** — full Next.js implementation including the middleware, the (auth) route group, Server Actions for login/signup/logout, and the protected home page.
- **`solution/lab-02-stretch`** — a `/home/profile` route in Next.js demonstrating streaming with multiple Suspense boundaries and a skeleton loader.

---

## Wrap-up at the end of the lab

When the class reconvenes (after the lab break), spend 5 minutes asking the room:

1. **"Which framework would you reach for tomorrow, and why?"** — let two or three students answer. Aim for diversity of opinions.
2. **"What surprised you?"** — collect the surprises. They become the basis for the recommendations students take back to work.
3. **"Did the comparison change your mind about either framework?"** — useful gauge of whether the lab landed.

Capture the answers somewhere — they're useful for tuning future cohorts.
