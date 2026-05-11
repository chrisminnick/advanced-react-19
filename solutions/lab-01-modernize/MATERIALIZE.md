# How to publish this to the `solution/lab-01-modernize` branch

The files in this folder are the **source of truth** for the modernized
chat client. To turn them into the actual solution branch students will
clone, run the script below from the repo root.

## Prerequisites

- You're on `main`, working tree is clean (`git status` is empty).
- The current `main` already has the upgraded `social-media/server` (v2.0)
  and the legacy class-component starter under `real-time-chat/client/`.

## Script

```bash
# 1. Branch off main
git checkout -b solution/lab-01-modernize

# 2. Replace the starter client with the modernized one
git rm -rf real-time-chat/client
mkdir -p real-time-chat/client
cp -R solutions/lab-01-modernize/client/. real-time-chat/client/
cp solutions/lab-01-modernize/lab01-ai-review.md real-time-chat/lab01-ai-review.md

# 3. (Optional but recommended) install + smoke-test before committing
( cd real-time-chat/client && npm install )
# In another terminal: cd social-media/server && npm run dev
# In another terminal: cd real-time-chat/server && npm start
# Then: cd real-time-chat/client && npm run dev
# Sign up, log in, send a message in two browsers.

# 4. Commit
git add -A
git commit -m "Lab 1 solution: modernize chat client to React 19 + Vite + hooks

- Vite 6 (was CRA), React 19 (was 18)
- All function components, no class declarations or lifecycle methods
- ref-as-a-prop everywhere; no forwardRef
- Single useEffect for socket lifecycle in useChatConnection
- Functional setState updaters fix the stale-closure socket bug
- AuthProvider rewritten as Context + custom hook (useAuth)
- Vite proxies: /api -> :5000 (auth/posts), /socket.io -> :8081 (chat)
- Adds reference lab01-ai-review.md write-up"

# 5. Push (when you're ready)
# git push -u origin solution/lab-01-modernize

# 6. Back to main
git checkout main
```

## Updating the branch later

When you want to change the solution after the branch is published, edit
the staged files here on `main`, then re-run a smaller version of step 2
inside a fresh branch checkout:

```bash
git checkout solution/lab-01-modernize
git checkout main -- solutions/lab-01-modernize    # pull the staged folder onto this branch (will not work — the folder doesn't exist on solution/lab-01-modernize)
# Alternative: re-apply the rsync
rsync -a --delete \
  /tmp/main-checkout/solutions/lab-01-modernize/client/ \
  real-time-chat/client/
git add -A && git commit --amend --no-edit
git push -f origin solution/lab-01-modernize
```

(Or just delete the branch and re-run the original script — that's cleaner
in practice.)
