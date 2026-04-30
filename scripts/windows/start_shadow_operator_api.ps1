$ErrorActionPreference = "Stop"

Set-Location "C:\ShadowEmpire-Git"

Write-Host "Starting Shadow Operator API on localhost:5050..."
Write-Host "n8n expected at localhost:5678"

node operator/server.js
