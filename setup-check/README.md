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
| 1 | Node >= 22 | Labs use React 19 + Vite 6 + Next.js 15, all of which need Node 22 |
| 2 | npm >= 10 | Ships with Node 22; this catches old global Node installs |
| 3 | Git installed | Every lab branches and pushes |
| 4 | npm registry reachable | Catches proxy/VPN issues before Day 1 morning |
| 5 | React 19 in the registry | Confirms the network can actually fetch package metadata, not just ping |
| 6 | Generic HTTPS works | Catches corporate firewalls that block non-npm hosts |

Each failed check prints a one-line remedy.

## Exit codes

- `0` — all checks passed
- `1` — at least one check failed (the script prints which)
- `2` — unexpected error during checks (script bug; should not happen)

## Dependencies

None. Pure Node + standard library. The empty `package.json` is just so `npm run check` works.
