<#
.SYNOPSIS
List grouped outputs for a dossier.

.DESCRIPTION
Shows all generated outputs grouped by type for a given dossier.

.PARAMETER DossierId
The dossier ID to list outputs for (required).

.EXAMPLE
.\list-outputs.ps1 DOSSIER-xxx
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$DossierId
)

$baseUrl = "http://localhost:5002"
$endpoint = "$baseUrl/operator/outputs/$DossierId"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — List Outputs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dossier ID: $DossierId" -ForegroundColor Yellow
Write-Host "Retrieving all outputs..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method GET `
        -UseBasicParsing `
        -TimeoutSec 10

    $outputs = $response.Content | ConvertFrom-Json

    Write-Host "Grouped Outputs:" -ForegroundColor Yellow
    Write-Host ""

    if ($outputs.scripts -and $outputs.scripts.Count -gt 0) {
        Write-Host "📄 Scripts:" -ForegroundColor Cyan
        $outputs.scripts | ForEach-Object {
            Write-Host "  - $($_.name) (generated: $($_.created_at))"
        }
        Write-Host ""
    }

    if ($outputs.research -and $outputs.research.Count -gt 0) {
        Write-Host "🔍 Research:" -ForegroundColor Cyan
        $outputs.research | ForEach-Object {
            Write-Host "  - $($_.name) (generated: $($_.created_at))"
        }
        Write-Host ""
    }

    if ($outputs.debate -and $outputs.debate.Count -gt 0) {
        Write-Host "⚔️ Debate/Critique:" -ForegroundColor Cyan
        $outputs.debate | ForEach-Object {
            Write-Host "  - $($_.name) (generated: $($_.created_at))"
        }
        Write-Host ""
    }

    if ($outputs.context -and $outputs.context.Count -gt 0) {
        Write-Host "🧠 Context:" -ForegroundColor Cyan
        $outputs.context | ForEach-Object {
            Write-Host "  - $($_.name) (generated: $($_.created_at))"
        }
        Write-Host ""
    }

    if ($outputs.thumbnails -and $outputs.thumbnails.Count -gt 0) {
        Write-Host "🎨 Thumbnail Concepts:" -ForegroundColor Cyan
        $outputs.thumbnails | ForEach-Object {
            Write-Host "  - $($_.name) (generated: $($_.created_at))"
        }
        Write-Host ""
    }

    if ($outputs.metadata -and $outputs.metadata.Count -gt 0) {
        Write-Host "📋 Metadata:" -ForegroundColor Cyan
        $outputs.metadata | ForEach-Object {
            Write-Host "  - $($_.name) (generated: $($_.created_at))"
        }
        Write-Host ""
    }

    Write-Host "Summary:" -ForegroundColor Yellow
    Write-Host "  Total packets: $($outputs.total_packets ?? 0)"
    Write-Host ""

} catch {
    Write-Host "❌ Error Retrieving Outputs" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
