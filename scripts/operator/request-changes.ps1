param(
  [Parameter(Mandatory=$true, Position=0)][string]$DossierId,
  [Parameter(Mandatory=$true, Position=1)][string]$Instructions,
  [string]$TargetWorkflow = 'WF-200'
)

$endpoint = "http://localhost:5050/operator/remodify/$DossierId"
$payload = @{ instructions = $Instructions; target_workflow = $TargetWorkflow } | ConvertTo-Json -Compress

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType 'application/json' -Body $payload -TimeoutSec 30
  Write-Host '[OK] Remodify submitted' -ForegroundColor Green
  $resp | ConvertTo-Json -Depth 6
}
catch {
  Write-Host '[ERROR] Remodify failed' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}
