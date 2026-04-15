$ErrorActionPreference = 'Stop'

Write-Host 'Shadow Empire Phase-1 bootstrap starting...'

$folders = @(
  'C:\ShadowEmpire\n8n_user',
  'C:\ShadowEmpire\runtime\dossiers',
  'C:\ShadowEmpire\runtime\packets',
  'C:\ShadowEmpire\runtime\logs'
)

foreach ($folder in $folders) {
  if (-not (Test-Path $folder)) {
    New-Item -ItemType Directory -Path $folder | Out-Null
  }
}

Write-Host 'Phase-1 folder bootstrap complete.'
