param(
  [switch]$SkipDocker = $false,
  [switch]$UseDirectOllama = $false
)

$ErrorActionPreference = 'Stop'

function Test-Http {
  param([string]$Url)
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
    return @{ ok = $true; status = $r.StatusCode }
  } catch {
    return @{ ok = $false; status = $null }
  }
}

Write-Host 'Shadow Operator - Open WebUI Setup' -ForegroundColor Cyan

$ollama = Test-Http 'http://localhost:11434/api/tags'
$operator = Test-Http 'http://localhost:5050/operator/health'
$n8n = Test-Http 'http://localhost:5678'

Write-Host ("Ollama: {0}" -f ($(if($ollama.ok){'UP'}else{'DOWN'})))
Write-Host ("Operator API: {0}" -f ($(if($operator.ok){'UP'}else{'DOWN'})))
Write-Host ("n8n: {0}" -f ($(if($n8n.ok){'UP'}else{'DOWN'})))

if ($UseDirectOllama) {
  Write-Host 'Starting operator:ollama mode...' -ForegroundColor Yellow
  npm.cmd run operator:ollama
  exit $LASTEXITCODE
}

if ($SkipDocker) {
  Write-Host 'Docker setup skipped. Connector files are ready.' -ForegroundColor Yellow
  Write-Host 'Open WebUI runtime not started by this script.' -ForegroundColor Yellow
  exit 0
}

$dockerExists = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerExists) {
  Write-Host '[ERROR] Docker not installed. Cannot auto-start Open WebUI runtime.' -ForegroundColor Red
  Write-Host 'Use: scripts/windows/start_open_webui.ps1 -SkipDocker' -ForegroundColor Yellow
  exit 1
}

Write-Host 'Docker detected. Starting Open WebUI container...' -ForegroundColor Yellow
docker run -d --name open-webui -p 3000:8080 -e OLLAMA_API_BASE_URL=http://host.docker.internal:11434 ghcr.io/open-webui/open-webui:latest
if ($LASTEXITCODE -ne 0) {
  Write-Host '[ERROR] Failed to start Open WebUI container.' -ForegroundColor Red
  exit 1
}

Write-Host '[OK] Open WebUI start command issued. Check http://localhost:3000' -ForegroundColor Green
