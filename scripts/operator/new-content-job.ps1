<#
.SYNOPSIS
Create a new content job in Shadow Creator OS.

.DESCRIPTION
Triggers WF-001 (Dossier Create) and WF-010 (Parent Orchestrator) to start a new content workflow.

.PARAMETER Topic
The topic or request for the content job (required).

.PARAMETER Context
The context/platform (default: YouTube video).

.PARAMETER Mode
The operating mode: founder, creator, builder, operator (default: creator).

.EXAMPLE
.\new-content-job.ps1 "Create a YouTube script about procrastination"
.\new-content-job.ps1 "Create a YouTube script" -Context "YouTube video" -Mode creator
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Topic,

    [Parameter(Mandatory=$false)]
    [string]$Context = "YouTube video",

    [Parameter(Mandatory=$false)]
    [ValidateSet("founder", "creator", "builder", "operator")]
    [string]$Mode = "creator",

    [Parameter(Mandatory=$false)]
    [string]$RouteId = "ROUTE_PHASE1_STANDARD"
)

$baseUrl = "http://localhost:5002"
$endpoint = "$baseUrl/operator/new-content-job"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — New Content Job" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Input:" -ForegroundColor Yellow
Write-Host "  Topic: $Topic"
Write-Host "  Context: $Context"
Write-Host "  Mode: $Mode"
Write-Host "  Route: $RouteId"
Write-Host ""

$payload = @{
    topic = $Topic
    context = $Context
    mode = $Mode
    route_id = $RouteId
} | ConvertTo-Json

Write-Host "Calling Operator API..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -UseBasicParsing `
        -TimeoutSec 30

    $result = $response.Content | ConvertFrom-Json

    Write-Host "✅ Job Created" -ForegroundColor Green
    Write-Host ""
    Write-Host "Results:" -ForegroundColor Yellow
    Write-Host "  Status: $($result.status)"
    Write-Host "  Dossier ID: $($result.dossier_id)"
    Write-Host "  Workflow Chain: $($result.workflow_chain -join ' → ')"
    Write-Host "  Packets Generated: $($result.packets_generated)"
    Write-Host ""

    if ($result.outputs.Count -gt 0) {
        Write-Host "Generated Outputs:" -ForegroundColor Yellow
        $result.outputs | ForEach-Object {
            Write-Host "  - $_"
        }
        Write-Host ""
    }

    Write-Host "Next Steps:" -ForegroundColor Yellow
    if ($result.next_actions) {
        $result.next_actions | ForEach-Object {
            Write-Host "  .\scripts\operator\inspect-output.ps1 $($result.dossier_id)"
            Write-Host "  or"
            Write-Host "  .\scripts\operator\list-outputs.ps1 $($result.dossier_id)"
        }
    }
    Write-Host ""

} catch {
    Write-Host "❌ Error Creating Job" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red

    if ($_.Exception.Response) {
        try {
            $error = $_.Exception.Response.Content.ReadAsStream() | ForEach-Object { [System.IO.StreamReader]::new($_).ReadToEnd() }
            Write-Host "  Details: $error" -ForegroundColor Red
        } catch { }
    }
    exit 1
}
