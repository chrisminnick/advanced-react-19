# Advanced React Development — Student Repo

**Version:** 2.0.0 (May 2026)
**Author:** Chris Minnick · WatzThis

Welcome! This is the public student repository for the **3-day Advanced
React Development course**. It's what's pre-cloned onto your lab VM and
what you'll work in during class.

The instructor materials (decks, lab handouts in markdown, instructor
notes, solution exemplars, and the course-build sources) live in a
separate private repository.

## What's in this repo

```
student/            ← course PDFs you'll read during class
lab-files/          ← per-lab self-contained starters (lab-01/ … lab-08/)
solutions/          ← per-lab reference solutions (use after finishing each lab)
demos/              ← Module 3 in-class demos (instructor-led; explore on your own too)
setup-check/        ← pre-Day-1 environment check (`npm run check`)
README.md           ← you are here
```

## Course materials

The two PDFs in [student/](./student/) are the two documents you'll
refer to throughout the course:

| File                                                                        | What it is                                                                  |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [student/advanced_react_v2_presentation.pdf](./student/advanced_react_v2_presentation.pdf) | The slide deck the instructor projects (all 10 modules, ~280 slides). Search it when you want to revisit a concept. |
| [student/advanced-react-labs-v2.pdf](./student/advanced-react-labs-v2.pdf)                 | The lab manual — all eight labs end-to-end. Each lab has its goal, time budget, setup, numbered phases, optional stretch task, hints, and a pointer to the reference solution. |

When a lab says "open the handout," it means the lab manual PDF.

## Lab files

| Lab | Folder                                  | What's in it                                                                                  |
| --- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | [lab-files/lab-01/](./lab-files/lab-01/) | `real-time-chat/` (legacy CRA chat) + `social-media/server` (auth)                            |
| 2   | [lab-files/lab-02/](./lab-files/lab-02/) | `social-media-rr-v7/` + `social-media-nextjs/` + `social-media/server`                        |
| 3   | [lab-files/lab-03/](./lab-files/lab-03/) | `social-media-rr-v7/` (bloated AppContext to refactor) + `social-media/server`                |
| 4   | [lab-files/lab-04/](./lab-files/lab-04/) | `social-media-rr-v7/` (Lab 3 Zustand state) + `social-media/server`                           |
| 5   | [lab-files/lab-05/](./lab-files/lab-05/) | `server-components-dashboard/` (standalone)                                                   |
| 6   | [lab-files/lab-06/](./lab-files/lab-06/) | `social-media-rr-v7/` (seeded perf problems) + `social-media/server` (with tag stamping)      |
| 7   | [lab-files/lab-07/](./lab-files/lab-07/) | `social-media-rr-v7/` (Lab 4 TanStack Query) + `social-media/server`                          |
| 8   | [lab-files/lab-08/](./lab-files/lab-08/) | `social-media-rr-v7/` (Lab 7 tests) + `social-media/server`                                   |

Each lab folder is **self-contained** — its own copy of every project
the lab needs, including any setup the lab assumes (e.g., the Lab 6
backend stamps mock tags onto every post). Cost: disk space. Benefit:
no branch-and-merge debugging during class, and if you fall behind on
Lab N, the next lab's folder (`lab-files/lab-(N+1)/`) is a clean
restart point.

## Solutions

After you've taken your own pass at a lab, the reference solution lives
under [solutions/](./solutions/):

| Lab | Solution folder(s)                                                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `solutions/lab-01-modernize/`                                                                                                                   |
| 2   | `solutions/lab-02-rr-v7/`, `solutions/lab-02-nextjs/`                                                                                           |
| 3   | `solutions/lab-03-zustand/`, `solutions/lab-03-jotai/`, `solutions/lab-03-rtk/`, `solutions/lab-03-baseline/` (the seeded "bad" starting state) |
| 4   | `solutions/lab-04-tanstack-query/`, `solutions/lab-04-stretch/` (infinite scroll)                                                               |
| 5   | `solutions/lab-05-dashboard/`, `solutions/lab-05-streaming/`                                                                                    |
| 6   | `solutions/lab-06-perf/`, `solutions/lab-06-baseline/`                                                                                          |
| 7   | `solutions/lab-07-tests/`, `solutions/lab-07-stretch/` (Playwright e2e)                                                                         |
| 8   | `solutions/lab-08-exemplar/` (Reactions feature, capstone reference)                                                                            |

Each solution folder has a `README.md` explaining what it changes from
the matching lab's starter. Don't peek before you've done your own
review — the value of the lab is in working through it yourself first.

## Demos

Module 3 in-class demos live under [demos/](./demos/) and the instructor
will walk through them during class:

- [demos/routing-demo/](./demos/routing-demo/) — RR v7 data router (loaders, actions, error boundaries)
- [demos/my-next-app/](./demos/my-next-app/) — Next.js 15 basics (Server Components + Client islands + Server Actions)
- [demos/my-next-routing-demo/](./demos/my-next-routing-demo/) — Next.js 15 routing primitives (nested layouts, dynamic segments, loading.js, error.js)

You're welcome to open them yourself on your own time too.

## Prerequisites

This course assumes you already know:

- **React fundamentals** — function components, props, basic hooks
  (`useState`, `useEffect`), JSX, and how a typical React app is wired
  up. If you've shipped or maintained a React app, you're good.
- **Modern JavaScript** — `async`/`await`, destructuring, modules,
  arrow functions, template literals.
- **The terminal** — running `npm install`, `npm run dev`, and
  navigating folders with `cd`.
- **Git basics** — `clone`, `status`, `diff`. You won't be branching
  during class, but `git diff` shows up in Lab 1's self-review.
- **An editor** — VS Code is what the labs assume, but any editor with
  an integrated terminal works.

You do **not** need prior experience with: React Router v7, Next.js,
TanStack Query, Zustand, Server Components, the React Compiler, or any
particular AI assistant. The course teaches all of those from scratch.

## What's pre-installed on the lab VM

If you're using a training-company-provided VM, the following is already
set up. (If you're working from your own machine, install these
yourself — the versions are the floor, not a ceiling.)

| Software                     | Version                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| Operating system             | Windows 10 or 11 (x64) — Mac/Linux also work for self-study      |
| Node.js                      | 22 LTS or newer (Node 24 LTS as of May 2026)                     |
| npm                          | 10 or newer (ships with Node)                                    |
| Git for Windows              | 2.45 or newer                                                    |
| Visual Studio Code           | Latest, with: ESLint, Prettier, ES7+ React snippets, Auto Rename Tag, REST Client, GitLens, MongoDB for VS Code, Playwright |
| Google Chrome                | Latest, with **React Developer Tools** extension                 |
| MongoDB Community Server     | 8.x, running as a Windows service on the default port (27017)    |
| MongoDB Compass              | Latest (used in Lab 8 to inspect the reactions schema)           |
| AI coding assistant          | One of: Claude Code (CLI + VS Code extension), Cursor, GitHub Copilot — required for Modules 9 and Labs 1, 7B, 8 |
| This repo                    | Pre-cloned to `C:\advanced-react-19\` (or `~/advanced-react-19/` on Mac/Linux) with `npm install` already run for every sub-project |

You'll sign into the AI assistant on Day 1 with your own credentials or
a cohort-issued account — the VM does not carry saved logins from
previous cohorts.

## Pre-Day-1 environment check

Before Day 1 starts (and any time something looks off), run the
[setup-check](./setup-check/) script:

```bash
cd setup-check
npm run check
```

You should see all green:

```
✓ Node version              v24.x.x   (or v22.x.x — anything in current LTS)
✓ npm version               10.x.x
✓ Git installed             git version 2.45.x
✓ npm registry              reachable
✓ React 19 available
✓ General HTTPS             nodejs.org reachable
✓ MongoDB on :27017         reachable
✓ Repo structure            lab-files/, demos/, solutions/ all in place
```

If anything is red, fix it before you lose lab time to it. The error
message tells you the remedy.

## Running a lab

Each lab is self-contained — open `lab-files/lab-NN/` and follow the
matching section of the lab manual PDF
([student/advanced-react-labs-v2.pdf](./student/advanced-react-labs-v2.pdf)).
The handout has the exact terminal commands to start the backend, the
client, and (where relevant) the chat server.

A typical lab boils down to:

1. Open `lab-files/lab-NN/` in your editor.
2. Make a backup copy of the folder before you change anything — that
   way you can recover if you wreck the codebase past saving.
3. Work through the lab phases in order, editing files in place.
4. Compare your finished work against `solutions/lab-NN-*/` when done.

## A note on AI assistants

Modules 9 and Labs 1, 7 (Part B), and 8 assume you have an AI coding
assistant you can drive from inside your editor or terminal. Without
one, the AI-review techniques the course teaches don't have anything to
review. Any of the assistants listed in the table above works — the
course is tool-agnostic.

## Course logistics

- **Pace:** ~11 hours of hands-on lab time across the three days (more
  than half of the course). Lectures are interleaved with the labs;
  it's not "lecture all morning, labs all afternoon."
- **Working alone or in pairs:** every lab works either way. Pick what
  fits the room.
- **Falling behind:** the next lab's `lab-files/lab-(N+1)/` folder is a
  clean restart point — it already contains "what Lab N's solution
  looks like" plus any setup the next lab adds.

## Reporting problems

If you hit a real bug in the lab files (not a "my code doesn't work"
issue — those are what the AI assistant and your instructor are for),
open an issue at <https://github.com/chrisminnick/advanced-react-19/issues>
or tell your instructor and they'll route it.

## License

Course materials © Chris Minnick / WatzThis. The lab project code is
provided for use during this course and for personal study afterward.
