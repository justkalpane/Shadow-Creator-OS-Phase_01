$ErrorActionPreference = "Stop"

Set-Location "C:\ShadowEmpire-Git"

Write-Host "Checking n8n..."
npm.cmd run n8n:status

Write-Host ""
Write-Host "Starting Shadow Operator API at http://localhost:5002 ..."
node server.js

