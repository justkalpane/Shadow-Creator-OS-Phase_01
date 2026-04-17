param(
    [string]$RepoRoot = "C:\ShadowEmpire\Shadow-Creator-OS-Phase_01",
    [string]$Branch = "main"
)

Set-Location $RepoRoot

git fetch origin
git checkout $Branch
git pull --ff-only origin $Branch

Write-Host "Local repo synced with GitHub."
