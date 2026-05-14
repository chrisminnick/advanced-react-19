#!/usr/bin/env bash
# Cleanup after the lab-files/ + demos/ restructure.
#
# What this removes:
#   - The old top-level project folders (now duplicated under lab-files/* and demos/*)
#   - solutions/MATERIALIZE.md files (branch-creation scripts, no longer applicable)
#   - solutions/{real-time-chat,social-media,social-media-redux} (v1 solutions, slated for retirement)
#   - "Orphan" files that linear file overlay couldn't avoid creating in the lab-files/ snapshots
#
# Run from the repo root after pulling the v2 restructure. macOS or Linux.
# A PowerShell version for the Windows VMs is at scripts/restructure-cleanup.ps1.

set -e

cd "$(dirname "$0")/.."

echo "==> Removing old top-level project folders (now in lab-files/ and demos/)"
rm -rf real-time-chat
rm -rf social-media
rm -rf social-media-rr-v7
rm -rf social-media-nextjs
rm -rf server-components-dashboard
rm -rf routing-demo
rm -rf my-next-app
rm -rf my-next-routing-demo
# Note: setup-check stays at the repo root (not lab-specific; everyone runs it)

echo "==> Removing solutions/MATERIALIZE.md files (branch-creation scripts, obsolete)"
find solutions -name MATERIALIZE.md -delete

echo "==> Removing v1 solutions (real-time-chat, social-media, social-media-redux)"
rm -rf solutions/real-time-chat
rm -rf solutions/social-media
rm -rf solutions/social-media-redux

echo "==> Removing orphan files in lab-files/ snapshots"
# Lab 4 (TanStack Query starter) starts from lab-03-zustand which deletes AppContext.jsx
rm -f lab-files/lab-04/social-media-rr-v7/app/context/AppContext.jsx
rmdir lab-files/lab-04/social-media-rr-v7/app/context 2>/dev/null || true

echo "==> Removing temp directories left by sandbox capability checks"
rm -rf _copy_test_src _copy_test_dst

echo ""
echo "==> Done."
echo "    Verify with: git status"
echo "    The repo should now have:"
echo "      lab-files/lab-{01..08}/  — per-lab self-contained starters"
echo "      demos/                    — Module 3 in-class demos"
echo "      solutions/lab-N-*/        — solution snapshots (no MATERIALIZE.md)"
echo "      setup-check/              — pre-Day-1 environment check"
echo "      instructor/, labs/, student/  — courseware (decks, handouts, manual)"
