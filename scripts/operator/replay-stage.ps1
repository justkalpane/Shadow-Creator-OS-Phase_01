param(
  [Parameter(Mandatory=$true, Position=0)][string]$DossierId,
  [string]$TargetWorkflow = 'WF-200',
  [string]$Checkpoint = 'latest'
)

$endpoint = "http://localhost:5050/operator/replay/$DossierId"
$payload = @{ stage = $TargetWorkflow; checkpoint = $Checkpoint } | ConvertTo-Json -Compress

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType 'application/json' -Body $payload -TimeoutSec 30
  Write-Host '[OK] Replay submitted' -ForegroundColor Green
  $resp | ConvertTo-Json -Depth 6
}
catch {
  Write-Host '[ERROR] Replay failed' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}
