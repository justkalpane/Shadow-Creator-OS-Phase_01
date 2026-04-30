<#
.SYNOPSIS
Request changes to output.

.DESCRIPTION
Rejects current output and requests modifications, triggering WF-021 replay with new instructions.

.PARAMETER DossierId
The dossier ID to request changes for (required).

.PARAMETER Instructions
Detailed instructions for modifications (required).

.PARAMETER TargetWorkflow
The workflow to replay (default: WF-200).

.EXAMPLE
.\request-changes.ps1 DOSSIER-xxx "Make the script shorter and more dramatic"
.\request-changes.ps1 DOSSIER-xxx "Add more humor" -TargetWorkflow WF-200
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$DossierId,

    [Parameter(Mandatory=$true, Position=1)]
    [string]$Instructions,

    [Parameter(Mandatory=$false)]
    [string]$TargetWorkflow = "WF-200"
)

$baseUrl = "http://localhost:5002"
$endpoint = "$baseUrl/operator/remodify/$DossierId"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — Request Changes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dossier ID: $DossierId" -ForegroundColor Yellow
Write-Host "Target Workflow: $TargetWorkflow" -ForegroundColor Yellow
Write-Host "Instructions: $Instructions" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Request changes and replay workflow? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Change request cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host "Submitting remodify request..." -ForegroundColor Cyan
Write-Host ""

$payload = @{
    instructions = $Instructions
    target_workflow = $TargetWorkflow
    action = "remodify_and_replay"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -UseBasicParsing `
        -TimeoutSec 30

    $result = $response.Content | ConvertFrom-Json

    Write-Host "✅ Remodify Request Submitted" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Yellow
    Write-Host "  Status: $($result.status)"
    Write-Host "  Target Workflow: $($result.target_workflow)"
    Write-Host "  Execution ID: $($result.execution_id ?? 'N/A')"
    Write-Host ""

    Write-Host "Workflow is now replaying with new instructions..." -ForegroundColor Cyan
    Write-Host ""

    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  Monitor workflow: .\scripts\operator\inspect-output.ps1 $DossierId"
    Write-Host "  List new outputs: .\scripts\operator\list-outputs.ps1 $DossierId"
    Write-Host ""

} catch {
    Write-Host "❌ Error Requesting Changes" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
