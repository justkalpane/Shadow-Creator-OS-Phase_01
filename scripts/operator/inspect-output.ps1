<#
.SYNOPSIS
Inspect outputs for a dossier.

.DESCRIPTION
Shows all generated outputs and their status for a given dossier.

.PARAMETER DossierId
The dossier ID to inspect (required).

.EXAMPLE
.\inspect-output.ps1 DOSSIER-xxx
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$DossierId
)

$baseUrl = "http://localhost:5002"
$endpoint = "$baseUrl/operator/dossier/$DossierId"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator — Inspect Output" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dossier ID: $DossierId" -ForegroundColor Yellow
Write-Host "Retrieving output summary..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $endpoint `
        -Method GET `
        -UseBasicParsing `
        -TimeoutSec 10

    $dossier = $response.Content | ConvertFrom-Json

    Write-Host "Dossier Summary:" -ForegroundColor Yellow
    Write-Host "  Created: $($dossier.created_at)"
    Write-Host "  Status: $($dossier.status)"
    Write-Host "  Topic: $($dossier.topic)"
    Write-Host "  Mode: $($dossier.mode)"
    Write-Host ""

    Write-Host "Outputs:" -ForegroundColor Yellow
    Write-Host "  Scripts: $($dossier.script_packets.Count ?? 0) packet(s)"
    Write-Host "  Research: $($dossier.research_packets.Count ?? 0) packet(s)"
    Write-Host "  Debate: $($dossier.debate_packets.Count ?? 0) packet(s)"
    Write-Host "  Context: $($dossier.context_packets.Count ?? 0) packet(s)"
    Write-Host "  Thumbnails: $($dossier.thumbnail_packets.Count ?? 0) packet(s)"
    Write-Host "  Images: $($dossier.image_packets.Count ?? 0) packet(s)"
    Write-Host "  Voice: $($dossier.voice_packets.Count ?? 0) packet(s)"
    Write-Host "  Video: $($dossier.video_packets.Count ?? 0) packet(s)"
    Write-Host "  Metadata: $($dossier.metadata_packets.Count ?? 0) packet(s)"
    Write-Host ""

    Write-Host "Approval Status: $($dossier.approval_status)" -ForegroundColor Yellow
    Write-Host ""

    if ($dossier.approval_status -eq "PENDING") {
        Write-Host "Available Actions:" -ForegroundColor Cyan
        Write-Host "  .\scripts\operator\approve-output.ps1 $DossierId"
        Write-Host "  .\scripts\operator\request-changes.ps1 $DossierId ""Make it shorter"""
    }

    Write-Host ""

} catch {
    Write-Host "❌ Error Retrieving Dossier" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
