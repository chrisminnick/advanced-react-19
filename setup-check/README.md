# setup-check

Pre-Day-1 environment verification for the Advanced React course (v2.0). The pre-work doc and student setup guide both point students here.

## Run it

```bash
cd setup-check
npm install
npm run check
```

(`npm install` is a no-op for this script — it has no dependencies — but it satisfies the muscle memory students will use throughout the labs.)

You can also run it directly:

```bash
node check.js
```

## What it checks

| # | Check | Why it matters |
|---|---|---|
| 1 | Node >= 22 | Labs use React 19 + Vite 6 + Next.js 15, all of which need Node 22+ (current LTS is Node 24 as of May 2026) |
| 2 | npm >= 10 | Ships with Node 22+; catches old global Node installs |
| 3 | Git installed | The repo is a git checkout; some labs use `git diff` for self-review |
| 4 | npm registry reachable | Catches proxy/VPN issues before Day 1 morning |
| 5 | React 19 in the registry | Confirms the network can actually fetch package metadata, not just ping |
| 6 | Generic HTTPS works | Catches corporate firewalls that block non-npm hosts |
| 7 | MongoDB reachable on :27017 | Labs 1, 2, 3, 4, 6, 7, 8 all depend on the local MongoDB. Catches "I forgot to start the service" before students lose 20 minutes |
| 8 | Repo structure intact | Verifies `lab-files/lab-01` … `lab-08`, `demos/`, and key `solutions/` folders exist. Catches a partial clone or a wrong-branch checkout |

Each failed check prints a one-line remedy.

## Exit codes

- `0` — all checks passed
- `1` — at least one check failed (the script prints which)
- `2` — unexpected error during checks (script bug; should not happen)

## Dependencies

None. Pure Node + standard library. The empty `package.json` is just so `npm run check` works.
