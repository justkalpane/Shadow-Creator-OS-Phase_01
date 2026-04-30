<#
.SYNOPSIS
Replay a workflow stage.

.DESCRIPTION
Replays a specific workflow stage from checkpoint (WF-021).

.PARAMETER DossierId
The dossier ID (required).

.PARAMETER TargetWorkflow
The workflow to replay (required).

.PARAMETER Action
Replay action (default: reexecute).

.EXAMPLE
.\replay-stage.ps1 DOSSIER-xxx WF-200
.\replay-stage.ps1 DOSSIER-xxx WF-100 -Action checkpoint_restore
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$DossierId,

    [Parameter(Mandatory=$true, Position=1)]
    [string]$TargetWorkflow,

    [Parameter(Mandatory=$false)]
    [ValidateSet("reexecute", "checkpoint_restore")]
    [string]$Action = "reexecute"
)

$baseUrl = "http://localhost:5002"
$endpoint = "$baseUrl/operator/replay/$DossierId"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — Replay Stage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dossier ID: $DossierId" -ForegroundColor Yellow
Write-Host "Target Workflow: $TargetWorkflow" -ForegroundColor Yellow
Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Replay this stage? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Replay cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host "Submitting replay request..." -ForegroundColor Cyan
Write-Host ""

$payload = @{
    target_workflow = $TargetWorkflow
    action = $Action
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -UseBasicParsing `
        -TimeoutSec 30

    $result = $response.Content | ConvertFrom-Json

    Write-Host "✅ Replay Request Submitted" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Yellow
    Write-Host "  Status: $($result.status)"
    Write-Host "  Target Workflow: $($result.target_workflow)"
    Write-Host "  Action: $($result.action)"
    Write-Host "  Execution ID: $($result.execution_id ?? 'N/A')"
    Write-Host ""

    Write-Host "Workflow is now replaying..." -ForegroundColor Cyan
    Write-Host ""

    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  Monitor workflow: .\scripts\operator\inspect-output.ps1 $DossierId"
    Write-Host ""

} catch {
    Write-Host "❌ Error Replaying Stage" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
