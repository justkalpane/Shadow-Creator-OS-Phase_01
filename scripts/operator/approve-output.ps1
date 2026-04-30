param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$DossierId,
  [string]$Reviewer = 'operator',
  [string]$Reason = 'Approved'
)

$endpoint = "http://localhost:5050/operator/approve/$DossierId"
$payload = @{ reviewer = $Reviewer; reason = $Reason } | ConvertTo-Json -Compress

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType 'application/json' -Body $payload -TimeoutSec 30
  Write-Host '[OK] Approval submitted' -ForegroundColor Green
  $resp | ConvertTo-Json -Depth 6
}
catch {
  Write-Host '[ERROR] Approval failed' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}
