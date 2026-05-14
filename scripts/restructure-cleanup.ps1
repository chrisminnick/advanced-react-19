# PowerShell version of restructure-cleanup.sh, for the Windows VMs.
#
# Same contract: removes old top-level project folders, the v1 solutions,
# and orphan overlay files in lab-files/.

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "==> Removing old top-level project folders (now in lab-files/ and demos/)"
Remove-Item -Recurse -Force real-time-chat,social-media,social-media-rr-v7,`
                            social-media-nextjs,server-components-dashboard,`
                            routing-demo,my-next-app,my-next-routing-demo `
                            -ErrorAction SilentlyContinue
# Note: setup-check stays at the repo root.

Write-Host "==> Removing v1 solutions"
Remove-Item -Recurse -Force solutions/real-time-chat,solutions/social-media,`
                            solutions/social-media-redux `
                            -ErrorAction SilentlyContinue

Write-Host "==> Removing orphan files in lab-files/ snapshots"
Remove-Item -Force lab-files/lab-04/social-media-rr-v7/app/context/AppContext.jsx -ErrorAction SilentlyContinue
Remove-Item -Force lab-files/lab-04/social-media-rr-v7/app/context -ErrorAction SilentlyContinue

Write-Host "==> Removing temp directories left by sandbox capability checks"
Remove-Item -Recurse -Force _copy_test_src,_copy_test_dst -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "==> Done."
Write-Host "    Verify with: git status"
