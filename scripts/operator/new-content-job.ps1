param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Topic,
    [string]$Context = 'YouTube video',
    [ValidateSet('founder','creator','builder','operator')]
    [string]$Mode = 'creator',
    [string]$RouteId = 'ROUTE_PHASE1_STANDARD'
)

$baseUrl = 'http://localhost:5050'
$endpoint = "$baseUrl/operator/new-content-job"

Write-Host 'Shadow Operator - New Content Job' -ForegroundColor Cyan
Write-Host "Topic: $Topic"
Write-Host "Context: $Context"
Write-Host "Mode: $Mode"
Write-Host "Route: $RouteId"

$payload = @{
  topic = $Topic
  context = $Context
  mode = $Mode
  route_id = $RouteId
} | ConvertTo-Json -Compress

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType 'application/json' -Body $payload -TimeoutSec 45
  Write-Host '[OK] Request completed' -ForegroundColor Green
  Write-Host ("Status: {0}" -f $resp.status)
  Write-Host ("Dossier ID: {0}" -f $resp.dossier_id)
  if ($resp.wf001) { Write-Host ("WF-001: {0}" -f $resp.wf001.status) }
  if ($resp.wf010) { Write-Host ("WF-010: {0}" -f $resp.wf010.status) }
  if ($resp.provider_boundary_note) { Write-Host $resp.provider_boundary_note -ForegroundColor Yellow }
  Write-Host ("Next: .\\scripts\\operator\\inspect-output.ps1 {0}" -f $resp.dossier_id)
}
catch {
  Write-Host '[ERROR] Failed to create job' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed
  }
  exit 1
}
