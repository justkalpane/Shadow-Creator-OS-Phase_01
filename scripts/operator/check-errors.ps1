$endpoint = 'http://localhost:5050/operator/errors'

try {
  $resp = Invoke-RestMethod -Uri $endpoint -Method Get -TimeoutSec 30
  Write-Host ("Total errors: {0}" -f $resp.total_errors) -ForegroundColor Cyan
  $resp.errors | Select-Object -First 20 | ConvertTo-Json -Depth 6
}
catch {
  Write-Host '[ERROR] Check errors failed' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed }
  exit 1
}
