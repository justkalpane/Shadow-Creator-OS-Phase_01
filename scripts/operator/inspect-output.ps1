param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$DossierId
)

$baseUrl = 'http://localhost:5050'
$dossierUrl = "$baseUrl/operator/dossier/$DossierId"
$outputUrl = "$baseUrl/operator/outputs/$DossierId"

try {
  $dossier = Invoke-RestMethod -Uri $dossierUrl -Method Get -TimeoutSec 20
  $outputs = Invoke-RestMethod -Uri $outputUrl -Method Get -TimeoutSec 20

  Write-Host 'Shadow Operator - Inspect Output' -ForegroundColor Cyan
  Write-Host ("Dossier ID: {0}" -f $DossierId)
  $status = $dossier.index_record.status
  if (-not $status) { $status = $dossier.dossier.status }
  Write-Host ("Status: {0}" -f $status)
  Write-Host ("Packets: {0}" -f $outputs.packets_count)
  Write-Host 'Grouped Outputs:' -ForegroundColor Yellow

  if ($outputs.grouped_by_type.PSObject.Properties.Count -eq 0) {
    Write-Host '  none yet'
  }
  else {
    foreach ($p in $outputs.grouped_by_type.PSObject.Properties) {
      $count = ($p.Value | Measure-Object).Count
      Write-Host ("  {0}: {1}" -f $p.Name, $count)
    }
  }

  if ($outputs.provider_boundary_note) {
    Write-Host $outputs.provider_boundary_note -ForegroundColor Yellow
  }
}
catch {
  Write-Host '[ERROR] Failed to inspect outputs' -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Red
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
    Write-Host $_.ErrorDetails.Message -ForegroundColor DarkRed
  }
  exit 1
}
