<#
.SYNOPSIS
Start Shadow Operator Core API.

.DESCRIPTION
Starts the Operator API server at localhost:5002.

.EXAMPLE
.\start-operator.ps1
#>

param(
    [Parameter(Mandatory=$false)]
    [int]$Port = 5002
)

$repoPath = "C:\ShadowEmpire-Git"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Shadow Operator Core — Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Repository Path: $repoPath" -ForegroundColor Yellow
Write-Host "Port: $Port" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $repoPath)) {
    Write-Host "❌ Repository path not found: $repoPath" -ForegroundColor Red
    exit 1
}

Set-Location $repoPath
Write-Host "Changed to repository directory" -ForegroundColor Green
Write-Host ""

# Check if npm modules are installed
if (-not (Test-Path "$repoPath/node_modules")) {
    Write-Host "⚠️ node_modules not found, installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "Starting Operator API..." -ForegroundColor Cyan
Write-Host "Server will listen on http://localhost:$Port" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Set environment variable for port
$env:PORT = $Port
$env:OPERATOR_PORT = $Port

# Start the server
npm run operator:start

Write-Host ""
Write-Host "Operator API stopped" -ForegroundColor Yellow
