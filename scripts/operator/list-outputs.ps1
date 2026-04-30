param([Parameter(Mandatory=$true, Position=0)][string]$DossierId)

$endpoint = "http://localhost:5050/operator/outputs/$DossierId"

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Get -TimeoutSec 30
  Write-Host ("Dossier: {0}" -f $DossierId) -ForegroundColor Cyan
  Write-Host ("Packet Count: {0}" -f $resp.packets_count)
  $resp.grouped_by_type | ConvertTo-Json -Depth 8
}
catch {
  Write-Host '[ERROR] List outputs failed' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}
