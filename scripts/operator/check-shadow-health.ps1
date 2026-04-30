<#
.SYNOPSIS
Health check for Shadow Operator Core and dependencies.

.DESCRIPTION
Verifies operator API, n8n, Ollama, repo, and data files are accessible.

.EXAMPLE
.\check-shadow-health.ps1
#>

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:5002"
$n8nUrl = "http://localhost:5678"
$ollamaUrl = "http://localhost:11434"
$repoPath = "C:\ShadowEmpire-Git"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Shadow Operator Core — Health Check" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$results = @{
    "Operator API" = $false
    "n8n" = $false
    "Ollama" = $false
    "Repo Path" = $false
    "Data Files" = $false
    "Mode Registry" = $false
    "Webhook Registry" = $false
}

# Test Operator API
Write-Host "Testing Operator API at $baseUrl/operator/health..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/operator/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ OK" -ForegroundColor Green
        $results["Operator API"] = $true
        if ($Verbose) { Write-Host "  Response: $($response.Content)" }
    }
} catch {
    Write-Host " ❌ FAILED" -ForegroundColor Red
    if ($Verbose) { Write-Host "  Error: $($_.Exception.Message)" }
}

# Test n8n
Write-Host "Testing n8n at $n8nUrl/api/v1/health..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$n8nUrl/api/v1/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ OK" -ForegroundColor Green
        $results["n8n"] = $true
    }
} catch {
    Write-Host " ⚠️ UNREACHABLE" -ForegroundColor Yellow
}

# Test Ollama
Write-Host "Testing Ollama at $ollamaUrl/api/tags..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$ollamaUrl/api/tags" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅ OK" -ForegroundColor Green
        $results["Ollama"] = $true
    }
} catch {
    Write-Host " ⚠️ OPTIONAL" -ForegroundColor Yellow
}

# Test Repo Path
Write-Host "Testing Repo Path $repoPath..." -NoNewline
if (Test-Path $repoPath) {
    Write-Host " ✅ OK" -ForegroundColor Green
    $results["Repo Path"] = $true
} else {
    Write-Host " ❌ NOT FOUND" -ForegroundColor Red
}

# Test Data Files
Write-Host "Testing Data Files..." -NoNewline
$dataFilesExist = (Test-Path "$repoPath/data/se_dossier_index.json") -and `
                  (Test-Path "$repoPath/data/se_packet_index.json") -and `
                  (Test-Path "$repoPath/data/se_route_runs.json")
if ($dataFilesExist) {
    Write-Host " ✅ OK" -ForegroundColor Green
    $results["Data Files"] = $true
} else {
    Write-Host " ⚠️ PARTIAL" -ForegroundColor Yellow
}

# Test Mode Registry
Write-Host "Testing Mode Registry..." -NoNewline
if (Test-Path "$repoPath/registries/mode_registry.yaml") {
    Write-Host " ✅ OK" -ForegroundColor Green
    $results["Mode Registry"] = $true
} else {
    Write-Host " ⚠️ MISSING" -ForegroundColor Yellow
}

# Test Webhook Registry
Write-Host "Testing Webhook Registry..." -NoNewline
if (Test-Path "$repoPath/registries/n8n_webhook_registry.yaml") {
    Write-Host " ✅ OK" -ForegroundColor Green
    $results["Webhook Registry"] = $true
} else {
    Write-Host " ❌ MISSING" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$passCount = ($results.Values | Where-Object { $_ -eq $true }).Count
$totalCount = $results.Count

Write-Host "Passed: $passCount/$totalCount" -ForegroundColor $(if ($passCount -eq $totalCount) { 'Green' } else { 'Yellow' })
Write-Host ""

if ($passCount -eq $totalCount) {
    Write-Host "✅ All systems operational!" -ForegroundColor Green
    exit 0
} elseif ($passCount -ge ($totalCount - 2)) {
    Write-Host "⚠️ Core systems operational (some optional dependencies missing)" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ Critical system failure" -ForegroundColor Red
    exit 1
}
