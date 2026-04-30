$repoPath = 'C:\ShadowEmpire-Git'
Set-Location $repoPath
Write-Host 'Starting Shadow Operator API on http://localhost:5050 ...' -ForegroundColor Cyan
npm.cmd run operator:start
