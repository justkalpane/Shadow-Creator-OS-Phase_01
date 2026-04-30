<#
.SYNOPSIS
Check system errors and alerts.

.DESCRIPTION
Lists current errors, workflow failures, and system alerts.

.PARAMETER DossierId
Optional: filter errors for a specific dossier.

.EXAMPLE
.\check-errors.ps1
.\check-errors.ps1 -DossierId DOSSIER-xxx
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$DossierId = ""
)

$baseUrl = "http://localhost:5002"

if ($DossierId) {
    $endpoint = "$baseUrl/operator/errors?dossier_id=$DossierId"
} else {
    $endpoint = "$baseUrl/operator/errors"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — Check Errors" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DossierId) {
    Write-Host "Dossier ID: $DossierId" -ForegroundColor Yellow
}

Write-Host "Retrieving errors and alerts..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method GET `
        -UseBasicParsing `
        -TimeoutSec 10

    $errors = $response.Content | ConvertFrom-Json

    if ($errors.Count -eq 0 -or -not $errors.errors -or $errors.errors.Count -eq 0) {
        Write-Host "✅ No errors detected" -ForegroundColor Green
        Write-Host ""
        exit 0
    }

    Write-Host "⚠️ Errors Found:" -ForegroundColor Yellow
    Write-Host ""

    $errors.errors | ForEach-Object {
        Write-Host "Error #$($_.error_id)" -ForegroundColor Red
        Write-Host "  Workflow: $($_.workflow_id)"
        Write-Host "  Dossier: $($_.dossier_id)"
        Write-Host "  Type: $($_.error_type)"
        Write-Host "  Message: $($_.message)"
        Write-Host "  Timestamp: $($_.created_at)"
        Write-Host ""

        if ($_.error_type -eq "WORKFLOW_FAILURE") {
            Write-Host "  Suggested Action:" -ForegroundColor Cyan
            Write-Host "    .\scripts\operator\replay-stage.ps1 $($_.dossier_id) $($_.workflow_id)"
            Write-Host ""
        }
    }

    Write-Host "Alert Summary:" -ForegroundColor Yellow
    Write-Host "  Total Errors: $($errors.error_count ?? $errors.errors.Count)"
    Write-Host "  Deferred: $($errors.deferred_count ?? 0)"
    Write-Host "  Blocked: $($errors.blocked_count ?? 0)"
    Write-Host ""

} catch {
    Write-Host "❌ Error Retrieving Errors" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
