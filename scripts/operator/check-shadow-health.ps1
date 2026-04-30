$baseUrl = 'http://localhost:5050'
$healthUrl = "$baseUrl/operator/health"

Write-Host 'Shadow Operator - Health Check' -ForegroundColor Cyan

try {
  $health = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 10
  Write-Host '[OK] Operator API reachable' -ForegroundColor Green
  Write-Host ("Status: {0}" -f $health.status)
  Write-Host ("Mode default: {0}" -f $health.mode_default)
  Write-Host ("Runtime default: {0}" -f $health.runtime_default)
  Write-Host ("n8n healthy: {0}" -f $health.n8n.healthy)
}
catch {
  Write-Host '[ERROR] Operator health check failed' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}
