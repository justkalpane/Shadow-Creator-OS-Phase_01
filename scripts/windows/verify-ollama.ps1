$ErrorActionPreference = 'Stop'

try {
  $response = Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -UseBasicParsing -TimeoutSec 5
  Write-Host 'Ollama reachable.'
  Write-Host $response.Content
}
catch {
  Write-Error 'Ollama is not reachable on http://127.0.0.1:11434'
}
