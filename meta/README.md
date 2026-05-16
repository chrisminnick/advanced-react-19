# meta/

Internal docs about the course itself — not student-facing. If you're
authoring the course, this is where the "why did we do it that way"
and "what's next" lives.

| File | What it is |
|---|---|
| [`DRY-RUN-FINDINGS.md`](./DRY-RUN-FINDINGS.md) | The full-walkthrough notes from the v2.0 dry-run + timing pass. Documents pacing problems caught, lab time overruns, and the fixes that landed before the May 2026 cohort. |
| [`UPGRADES.md`](./UPGRADES.md) | Tracking doc for dependency / framework upgrades the course has deliberately deferred. Current cycle: Q3 2026 (Next.js 15 → 16, React 19.0 → 19.2, etc.). |

## Conventions

- New cycles get their own file (`UPGRADES-Q1-2027.md`, etc.). Don't
  edit a past cycle's file once it's shipped — copy items forward and
  let the old file be the historical record.
- One-off design decisions that are too big for an inline comment but
  too small for a separate doc go in `DRY-RUN-FINDINGS.md` under a
  "Misc decisions" section. If they grow, promote to their own file.
