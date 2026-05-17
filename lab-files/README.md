# Lab files

Per-lab self-contained starter snapshots. Each `lab-NN/` folder is the
exact starting point for that lab — open the folder for whichever lab
you're on and edit in place.

| Lab | Folder | What's in it |
|---|---|---|
| 1 | `lab-01/` | `real-time-chat/` (legacy class-component chat) + `social-media/server` (auth backend) |
| 2 | `lab-02/` | `social-media-rr-v7/` + `social-media-nextjs/` + `social-media/server` |
| 3 | `lab-03/` | `social-media-rr-v7/` (with bloated AppContext to refactor) + `social-media/server` |
| 4 | `lab-04/` | `social-media-rr-v7/` (Lab 3 Zustand state) + `social-media/server` |
| 5 | `lab-05/` | `server-components-dashboard/` (standalone Next.js dashboard) |
| 6 | `lab-06/` | `social-media-rr-v7/` (with seeded perf problems) + `social-media/server` (with tag stamping) |
| 7 | `lab-07/` | `social-media-rr-v7/` (Lab 4 TanStack Query state) + `social-media/server` |
| 8 | `lab-08/` | `social-media-rr-v7/` (Lab 7 tests state) + `social-media/server` |

## Workflow

There are no feature branches in this version of the course. For each
lab:

1. Open the corresponding `lab-files/lab-NN/` folder in your editor.
2. Inside, run `npm install` in each sub-folder you'll use. (On the lab
   VM, this has already been done for you.)
3. Edit in place. The lab handout — your section of
   `student/advanced-react-labs-v2.pdf` — walks you through what to
   change.
4. When you finish (or get stuck), the reference solution lives at
   `solutions/lab-NN-*/`.

If you fall behind on Lab N, the next lab's folder (`lab-files/lab-(N+1)/`)
is a clean restart point — it already contains "what Lab N's solution
looks like" plus any setup the next lab adds.

## Why per-lab folders instead of git branches

Branch-and-merge management ate too much classroom time in earlier
cohorts. Per-lab folders trade disk space for "no debugging anyone's
git." If you want to compare your work against the reference, do
folder-vs-folder diffs against `solutions/lab-NN-*/`.
