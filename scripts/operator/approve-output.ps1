<#
.SYNOPSIS
Approve output for a dossier.

.DESCRIPTION
Approves the generated output and triggers publishing/next stage (WF-020).

.PARAMETER DossierId
The dossier ID to approve (required).

.PARAMETER Reason
Optional reason for approval.

.EXAMPLE
.\approve-output.ps1 DOSSIER-xxx
.\approve-output.ps1 DOSSIER-xxx -Reason "Ready for publication"
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$DossierId,

    [Parameter(Mandatory=$false)]
    [string]$Reason = "Approved by operator"
)

$baseUrl = "http://localhost:5002"
$endpoint = "$baseUrl/operator/approve/$DossierId"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — Approve Output" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dossier ID: $DossierId" -ForegroundColor Yellow
Write-Host "Reason: $Reason" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Are you sure you want to approve? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Approval cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host "Submitting approval..." -ForegroundColor Cyan
Write-Host ""

$payload = @{
    reviewer = "operator"
    reason = $Reason
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -UseBasicParsing `
        -TimeoutSec 30

    $result = $response.Content | ConvertFrom-Json

    Write-Host "✅ Approval Submitted" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Yellow
    Write-Host "  Status: $($result.status)"
    Write-Host "  Approval Decision: $($result.approval_decision ?? 'pending')"
    Write-Host "  Execution ID: $($result.execution_id ?? 'N/A')"
    Write-Host ""

    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  Monitor workflow: .\scripts\operator\inspect-output.ps1 $DossierId"
    Write-Host ""

} catch {
    Write-Host "❌ Error Approving Output" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
