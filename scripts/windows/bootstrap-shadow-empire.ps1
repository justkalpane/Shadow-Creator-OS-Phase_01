$ErrorActionPreference = 'Stop'

Write-Host 'Shadow Empire Phase-1 bootstrap starting...'

$folders = @(
  'C:\ShadowEmpire\n8n_user',
  'C:\ShadowEmpire\n8n_user\binaryData',
  'C:\ShadowEmpire\runtime\dossiers',
  'C:\ShadowEmpire\runtime\packets',
  'C:\ShadowEmpire\runtime\logs'
)

foreach ($folder in $folders) {
  if (-not (Test-Path $folder)) {
    New-Item -ItemType Directory -Path $folder | Out-Null
  }
}

Write-Host 'Folder bootstrap complete.'

$writeChecks = @()
foreach ($folder in $folders) {
  $probeFile = Join-Path $folder '.write_test.tmp'
  Set-Content -Path $probeFile -Value 'ok'
  Remove-Item -Path $probeFile -Force
  $writeChecks += [PSCustomObject]@{
    path = $folder
    writable = $true
  }
}

$ollamaReachable = $false
$ollamaStatus = 'unreachable'
try {
  $response = Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -UseBasicParsing -TimeoutSec 5
  if ($response.StatusCode -eq 200) {
    $ollamaReachable = $true
    $ollamaStatus = 'reachable'
  }
}
catch {
  $ollamaStatus = 'unreachable'
}

$result = [PSCustomObject]@{
  phase = 'phase1'
  n8n_user_folder = 'C:\ShadowEmpire\n8n_user'
  binary_data_folder = 'C:\ShadowEmpire\n8n_user\binaryData'
  folders_verified = $writeChecks
  ollama_status = $ollamaStatus
}

$result | ConvertTo-Json -Depth 5
Write-Host 'Phase-1 bootstrap verification complete.'
