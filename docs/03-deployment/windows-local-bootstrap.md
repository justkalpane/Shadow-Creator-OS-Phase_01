# Windows Local Bootstrap

## Purpose
Bring up the local Phase-1 runtime safely on the Windows laptop.

## Required posture
- One local n8n instance only
- One Ollama model only
- Filesystem binary storage only
- Repo tracked artifacts separated from runtime data

## Suggested folder layout
- C:\ShadowEmpire\Shadow-Creator-OS-Phase_01
- C:\ShadowEmpire\n8n_user
- C:\ShadowEmpire\runtime\dossiers
- C:\ShadowEmpire\runtime\packets
- C:\ShadowEmpire\runtime\logs

## PowerShell environment example
```powershell
$env:N8N_USER_FOLDER="C:\ShadowEmpire\n8n_user"
$env:N8N_DEFAULT_BINARY_DATA_MODE="filesystem"
$env:N8N_STORAGE_PATH="C:\ShadowEmpire\n8n_user\binaryData"
$env:N8N_HOST="127.0.0.1"
$env:N8N_PORT="5678"
```

## Local run checkpoint
- n8n opens cleanly
- owner account still exists after restart
- `C:\ShadowEmpire\n8n_user\.n8n` is active
- binary storage directory exists
- Ollama responds locally
