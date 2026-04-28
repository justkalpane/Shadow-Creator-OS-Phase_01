# Shadow Creator OS Phase-1 — n8n local launcher
# Sets canonical env vars and starts n8n. Run from any PowerShell.

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force "C:\ShadowEmpire\n8n_user" | Out-Null
New-Item -ItemType Directory -Force "C:\ShadowEmpire\n8n_user\binaryData" | Out-Null

if (Test-Path Env:N8N_BINARY_DATA_STORAGE_PATH) {
  Remove-Item Env:N8N_BINARY_DATA_STORAGE_PATH
}

$env:N8N_USER_FOLDER = "C:\ShadowEmpire\n8n_user"
$env:N8N_DEFAULT_BINARY_DATA_MODE = "filesystem"
$env:N8N_STORAGE_PATH = "C:\ShadowEmpire\n8n_user\binaryData"
$env:N8N_HOST = "127.0.0.1"
$env:N8N_PORT = "5678"

Write-Output "Launching n8n with:"
Write-Output "  N8N_USER_FOLDER = $env:N8N_USER_FOLDER"
Write-Output "  N8N_HOST        = $env:N8N_HOST"
Write-Output "  N8N_PORT        = $env:N8N_PORT"
Write-Output ""
Write-Output "Once running, in another shell:  npm run n8n:status"
Write-Output ""

$n8nCmd = $null
$cmd = Get-Command n8n -ErrorAction SilentlyContinue
if ($cmd) {
  $n8nCmd = $cmd.Source
} else {
  $fallback = Join-Path $env:APPDATA "npm\n8n.cmd"
  if (Test-Path $fallback) {
    $n8nCmd = $fallback
  }
}

if (-not $n8nCmd) {
  throw "n8n executable not found. Install n8n globally or ensure it is on PATH."
}

& $n8nCmd start
