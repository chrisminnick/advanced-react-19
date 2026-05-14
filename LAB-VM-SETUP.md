# Lab VM provisioning — Advanced React v2.0

Audience: the training company's VM-provisioning team. Use this to build
the standard Windows VM image students sit at. The standard image is
**Windows 10 or 11 (x64)**.

A correctly provisioned VM passes `npm run check` in the `setup-check/`
folder before students touch the keyboard. That script is the final gate
in this guide.

---

## 1. VM specs

| Resource    | Minimum                           | Recommended |
| ----------- | --------------------------------- | ----------- |
| CPU         | 4 vCPU                            | 6 vCPU      |
| RAM         | 8 GB                              | 16 GB       |
| Disk (free) | 20 GB                             | 40 GB       |
| Display     | 1080p                             | 1440p       |
| Network     | Outbound HTTPS to public internet | Same        |

Node + npm + MongoDB + VS Code + a couple of dev servers running
simultaneously can sit at 4–5 GB resident. 8 GB is the floor; below that,
Lab 4's TanStack Query + Lab 6's profiler runs start swapping.

Outbound HTTPS to the following hosts is required:

- `registry.npmjs.org` and `*.npmjs.com`
- `github.com`, `*.githubusercontent.com`, `*.github.io`
- `nodejs.org`
- `code.visualstudio.com` + `*.vscode-cdn.net` (extensions)
- `*.mongodb.com` (Compass download, telemetry; can be blocked if needed)
- `playwright.azureedge.net` and `cdn.playwright.dev` (Lab 7 stretch only)
- Whichever AI assistant the cohort uses (see §6)

Inbound traffic isn't required — students don't host anything for each other.

---

## 2. Base Windows config

Apply before installing anything else.

1. Run Windows Update; reboot until idle. Pin the OS build for the
   cohort window so cumulative updates don't reboot students mid-class.
2. Set the time zone to the training location.
3. Disable hibernation: `powercfg /h off` (so disk space and resume
   behavior are predictable across cohort resets).
4. Set the Power plan to **High performance** or **Balanced**. Never
   **Power saver** — it throttles CPU and confuses Lab 6's perf
   measurements.
5. Enable Long Path Support (registry):
   `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1`.
   `node_modules` paths exceed 260 chars on every install of this course.

---

## 3. Software stack (in order)

Install in this order — later steps depend on earlier ones.

### 3.1 Git for Windows — 2.45 or later

Download: <https://git-scm.com/download/win>

Installer choices that matter:

| Prompt                 | Choice                                                                        |
| ---------------------- | ----------------------------------------------------------------------------- |
| Default editor         | **Visual Studio Code** (chosen later — picks itself up)                       |
| PATH adjustments       | **Git from the command line and also from 3rd-party software**                |
| HTTPS transport        | **OpenSSL**                                                                   |
| Line endings           | **Checkout as-is, commit Unix-style line endings** (the lab repo enforces LF) |
| Terminal emulator      | **Use Windows' default console window**                                       |
| Git credential manager | **Git Credential Manager**                                                    |

Post-install verification (in a fresh terminal):

```powershell
git --version
# git version 2.45.x.windows.x
```

### 3.2 Node.js (current LTS)

Download: <https://nodejs.org/en> — the **current LTS** MSI installer
(Node **24.x** as of May 2026; the next LTS line takes over in
October 2026).

The course's minimum is **Node 22**. Any newer release in the active
LTS line is fine — `setup-check/check.js` enforces the floor and won't
complain about newer majors. Avoid Current (odd-numbered) releases on
training VMs; they reach EOL sooner than the cohort cycle.

Installer choices that matter:

- **64-bit installer.** The standard `.msi` from nodejs.org is 64-bit;
  do NOT pick the x86 build. A 32-bit Node breaks native-binary
  installs (notably `bcrypt`'s prebuilt drops). The course swapped to
  `bcryptjs` so this is no longer fatal, but the architecture
  mismatch is still a problem for any future native dep.
- **Automatically install necessary tools** — leave UNCHECKED. The
  course's deps (after the bcrypt → bcryptjs swap) don't need
  Python or Visual Studio Build Tools. The "necessary tools" payload
  adds ~2 GB to disk for nothing. Check it only if you intend to
  install other native modules later.
- Default install path is fine (`C:\Program Files\nodejs\`).

Post-install verification:

```powershell
node --version
# v24.x.x   (or v22.x.x — anything in the current LTS line works)
npm --version
# 10.x.x or higher
```

If you used the "automatically install" path, this added a couple of GB
to disk. That's expected.

### 3.3 Visual Studio Code

Download: <https://code.visualstudio.com/Download>

User installer (not System) so the cohort reset script can wipe
per-user state without affecting other users on the VM.

Required extensions (install for the `student` user; each line is a CLI
command you can run after VS Code is installed):

```powershell
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension formulahendry.auto-rename-tag
code --install-extension humao.rest-client
code --install-extension eamodio.gitlens
code --install-extension mongodb.mongodb-vscode
code --install-extension ms-playwright.playwright   # Lab 7 stretch
code --install-extension anthropic.claude-code      # if Claude Code is the cohort's assistant — see §6
```

Recommended user settings (write to
`%APPDATA%\Code\User\settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "git.autofetch": true,
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```

The `Git Bash` default profile matters because many lab helper commands
assume bash syntax; PowerShell does not run those snippets as-is.

### 3.4 Google Chrome

Download: <https://www.google.com/chrome/>

Install for all users. Chrome is required for React DevTools and for
Playwright's `chromium` channel.

Chrome extension to pre-install for the `student` user:

- **React Developer Tools** — <https://chromewebstore.google.com/detail/fmkadmapgofadopljbjfkapdkoienihi>

(Pre-install via the Chrome Web Store while signed in as `student`, or
deploy via Chrome's Enterprise extension policy.)

### 3.5 MongoDB Community Server 8.x

Download: <https://www.mongodb.com/try/download/community>

Use the **current MongoDB Community Server release** (8.x as of May 2026).
Mongoose 8, which the course uses, supports MongoDB 5–8 — anything 7+
will work, but 8.x is the recommended baseline.

Installer choices that matter:

- Installation type: **Complete**
- **Install MongoD as a Service** — yes
  - Service name: `MongoDB`
  - Data dir: `C:\data\db\` (the default
    `C:\Program Files\MongoDB\Server\8.x\data\` is also fine; just keep
    it consistent across cohorts)
  - Log dir: default
- **Install MongoDB Compass** — yes (free GUI; used in Lab 8 to inspect
  the reactions schema)

Post-install verification:

```powershell
# Service should be Running
Get-Service MongoDB

# Connect from the shell
mongosh --eval "db.runCommand({ ping: 1 })"
# { ok: 1 }
```

If the service didn't auto-start, set it to **Automatic** and start it
manually once:

```powershell
Set-Service MongoDB -StartupType Automatic
Start-Service MongoDB
```

Seed step (optional but recommended — gives Lab 2 students something to
look at on first run):

```powershell
mongosh --eval "db = db.getSiblingDB('social-network'); db.createCollection('posts'); db.createCollection('users');"
```

### 3.6 AI assistant — pre-installed

Per §6 below, pre-install at least one of the supported assistants.
Recommended baseline: **Claude Code** (CLI + VS Code extension) because
it works across Windows, Mac, and Linux with the same UX, and the course
materials reference it by name.

Claude Code install (PowerShell, run as `student`):

```powershell
npm install -g @anthropic-ai/claude-code
claude --version
```

Then sign in once with the cohort's shared learning account — or leave it
to the student to sign in on Day 1 with their own credentials. The
training operator should decide based on the company's account policy.

---

## 4. Repo bootstrap

Clone the course repo to the desktop. Pre-running `npm install` in each
sub-project means students don't sit through a 5-minute install on
Day 1.

```powershell
cd $env:USERPROFILE\Desktop
git clone https://github.com/chrisminnick/advanced-react-19.git
cd advanced-react-19

# Warm the npm cache for every project a student will touch.
# (Each lab folder is self-contained — same project may appear in multiple
# lab folders. That's intentional; per-lab snapshots avoid branch-merge
# debugging during class.)

$paths = @(
  'setup-check',
  'lab-files\lab-01\real-time-chat\server',
  'lab-files\lab-01\real-time-chat\client',
  'lab-files\lab-01\social-media\server',
  'lab-files\lab-02\social-media\server',
  'lab-files\lab-02\social-media-rr-v7',
  'lab-files\lab-02\social-media-nextjs',
  'lab-files\lab-03\social-media\server',
  'lab-files\lab-03\social-media-rr-v7',
  'lab-files\lab-04\social-media\server',
  'lab-files\lab-04\social-media-rr-v7',
  'lab-files\lab-05\server-components-dashboard',
  'lab-files\lab-06\social-media\server',
  'lab-files\lab-06\social-media-rr-v7',
  'lab-files\lab-07\social-media\server',
  'lab-files\lab-07\social-media-rr-v7',
  'lab-files\lab-08\social-media\server',
  'lab-files\lab-08\social-media-rr-v7',
  'demos\routing-demo',
  'demos\my-next-app',
  'demos\my-next-routing-demo'
)

foreach ($d in $paths) {
  Write-Host "Installing $d ..."
  Push-Location $d
  npm install --no-audit --no-fund
  Pop-Location
}
```

This step takes 10–20 minutes the first time and produces a lot of
disk usage (gigabytes). That's the cost of per-lab self-containment.

Confirm the chat app's legacy starter compiles (it's the biggest
install — failure here usually means Long Path Support wasn't enabled
in §2):

```powershell
cd lab-files\lab-01\real-time-chat\client
npm run build
cd ..\..\..\..\
```

---

## 5. Verification — the `setup-check` script

The final gate. This is the same script students will run on Day 1
when something looks off.

```powershell
cd $env:USERPROFILE\Desktop\advanced-react-19\setup-check
npm run check
```

You should see all green:

```
✓ Node version              v22.x.x
✓ npm version               10.x.x
✓ Git installed             git version 2.45.x
✓ npm registry              reachable
✓ React 19 available        latest 19.x: 19.x.x
✓ General HTTPS             nodejs.org reachable
```

If any line is red, fix it and rerun. **Do not hand the VM to a student
with a red line.** A failed setup-check at the start of class costs
20–40 minutes of lecture time.

Additional manual checks the script doesn't cover:

```powershell
# MongoDB service is running
Get-Service MongoDB
# Status should be Running

# Backend boots (any lab's copy works — lab-02 is a fine smoke test)
cd $env:USERPROFILE\Desktop\advanced-react-19\lab-files\lab-02\social-media\server
npm run dev
# Expect:
#   social-media server listening on http://localhost:4000
#   Connected to mongodb://localhost:27017/social-network
# Ctrl+C to stop.

# Health endpoint reachable
curl http://localhost:4000/api/setup-check
# {"ok":true,"message":"social-media backend ready",...}
```

---

## 6. AI assistant — required at one tier or another

Modules 9, Lab 1, Lab 7 Part B, and Lab 8 all assume the student has
**an AI coding assistant they can drive from inside their editor or
terminal**. Without one, the AI-review skills the course teaches don't
have anything to review.

Pre-install **one** of the following on the VM image:

| Assistant                                 | How to install                                                                             | Notes                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Claude Code** (CLI + VS Code extension) | `npm install -g @anthropic-ai/claude-code` + the `anthropic.claude-code` VS Code extension | First-class course support — referenced by name in lab materials.                           |
| **Cursor** (editor replacement)           | Download from <https://cursor.com/>, install per-user                                      | Replaces VS Code; if the cohort uses Cursor, skip §3.3 entirely and install Cursor instead. |
| **GitHub Copilot** (VS Code extension)    | `code --install-extension github.copilot github.copilot-chat`                              | Requires GitHub account + license seat.                                                     |

The student will sign in to the assistant on Day 1 with their own
credentials or a cohort-issued account. The VM image should NOT carry
saved login state from a previous cohort.

---

## 7. Cohort reset — what to wipe between groups

Before each new cohort starts, reset the VM to a known clean state.
Either restore the VM image, or run this cleanup script as
**Administrator**:

```powershell
# Reset the student user's per-app state
Remove-Item -Recurse -Force C:\Users\student\Desktop\advanced-react-19 -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\Users\student\AppData\Roaming\npm-cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\Users\student\.npm -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\Users\student\AppData\Roaming\Code\User\workspaceStorage -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\Users\student\AppData\Roaming\Code\User\globalStorage\anthropic.claude-code -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\Users\student\AppData\Local\Cursor -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\Users\student\AppData\Roaming\Cursor -ErrorAction SilentlyContinue

# Reset Mongo's content (drops everything in the social-network DB)
mongosh --eval "db.getSiblingDB('social-network').dropDatabase()"

# Re-bootstrap (§4 above)
# … then re-run setup-check (§5)
```

Don't reset Node, npm, Git, VS Code, MongoDB, or Chrome themselves —
those are part of the image. Only the per-user app state changes
between cohorts.

---

## 8. Known gotchas

- **Corporate proxy / firewall.** If the venue's network does TLS
  inspection, students will hit cert errors on `git clone` and
  `npm install`. Either:
  - Pre-install the venue's root CA into Windows' trust store AND set
    `NODE_EXTRA_CA_CERTS` to point at it in a system environment
    variable, OR
  - Provision the VMs offsite where the public registry is reachable.
- **Antivirus scanning `node_modules`.** Defender's real-time scan adds
  ~30% to `npm install` time. If the venue's AV policy allows, add
  `C:\Users\student\Desktop\advanced-react-19` to the AV exclusion list.
- **VS Code "Allow this workspace" prompt.** The first time a student
  opens the repo, VS Code asks if they trust the workspace. Pre-accept
  by writing `"security.workspace.trust.enabled": false` to the global
  settings (or pre-add the workspace folder to trusted folders before
  imaging).
- **Playwright browser download fails behind a proxy.** Lab 7's stretch
  installs Chromium via `npx playwright install chromium`. If the proxy
  blocks `playwright.azureedge.net`, that step fails silently. Either
  whitelist the host or pre-run the install during VM provisioning
  (it's idempotent).
- **Windows Defender flagging socket.io.** The chat lab uses port 8081.
  On first run, Defender pops a firewall prompt — pre-approve by adding
  an inbound rule for `node.exe` on the loopback interface.

---

## Quick checklist (print this)

- [ ] VM specs ≥ 4 vCPU / 8 GB RAM / 20 GB free
- [ ] Windows updated and rebooted; updates pinned
- [ ] Power plan ≠ Power saver
- [ ] Long Path Support enabled
- [ ] `student` user created
- [ ] Git for Windows installed; LF on commit
- [ ] Node 22 LTS installed (with native tools)
- [ ] VS Code installed + required extensions
- [ ] Chrome installed + React DevTools pinned
- [ ] MongoDB Community + Compass installed; service Running
- [ ] AI assistant pre-installed (Claude Code / Cursor / Copilot)
- [ ] Repo cloned and `npm install`ed for every project
- [ ] `npm run check` in `setup-check/` is all green
- [ ] `curl http://localhost:4000/api/setup-check` returns `ok:true`
- [ ] Cohort reset script ready in `C:\TrainingOps\`

If every box is checked, the VM is ready to hand to a student.
