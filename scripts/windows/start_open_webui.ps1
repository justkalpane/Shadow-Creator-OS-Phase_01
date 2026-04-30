# Shadow Operator Core - Open WebUI Setup & Start Script
# Purpose: Setup Open WebUI with Ollama integration and Shadow Operator Core tools
# Requirements: Docker Desktop installed

param(
    [switch]$SkipDocker = $false,
    [switch]$UseDirectOllama = $false
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $($Text.PadRight(62)) ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Status {
    param([string]$Status, [string]$Color = "Green")
    Write-Host "  ✓ $Status" -ForegroundColor $Color
}

function Check-Service {
    param([string]$Name, [string]$Port, [string]$Url)

    try {
        $response = Invoke-WebRequest -Uri $Url -ErrorAction SilentlyContinue -TimeoutSec 2
        Write-Status "$Name is running on port $Port" "Green"
        return $true
    }
    catch {
        Write-Status "$Name is NOT running on port $Port" "Yellow"
        return $false
    }
}

# ============================================================================
# Main Setup
# ============================================================================

Write-Header "Shadow Operator Core - Open WebUI Integration Setup"

Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check services
$ollama_running = Check-Service "Ollama" "11434" "http://localhost:11434/api/tags"
$operator_running = Check-Service "Operator API" "5050" "http://localhost:5050/operator/health"
$n8n_running = Check-Service "n8n" "5678" "http://localhost:5678/api/v1/health"

Write-Host ""

if (-not $ollama_running) {
    Write-Host "⚠️  Ollama is not running!" -ForegroundColor Yellow
    Write-Host "   Please start Ollama first:"
    Write-Host "   ollama serve"
    Write-Host ""
}

if (-not $operator_running) {
    Write-Host "⚠️  Operator API is not running!" -ForegroundColor Yellow
    Write-Host "   Please start it in another terminal:"
    Write-Host "   npm run operator:start"
    Write-Host ""
}

if (-not $n8n_running) {
    Write-Host "⚠️  n8n is not running!" -ForegroundColor Yellow
    Write-Host "   Please start it in another terminal:"
    Write-Host "   npm run n8n:start"
    Write-Host ""
}

Write-Host ""

# ============================================================================
# Option Selection
# ============================================================================

if ($UseDirectOllama) {
    Write-Header "Starting Direct Ollama Tool Runner"
    Write-Host "This provides full orchestration via Ollama without Open WebUI." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Starting tool runner..." -ForegroundColor Yellow

    Set-Location "C:\ShadowEmpire-Git"
    & node operator/ollama_tool_runner.js
    exit 0
}

Write-Header "Open WebUI Setup Options"
Write-Host "1. Docker Setup (Recommended)" -ForegroundColor Yellow
Write-Host "   - Installs Open WebUI in Docker container"
Write-Host "   - Full web interface at http://localhost:3000"
Write-Host "   - Requires Docker Desktop installed"
Write-Host ""
Write-Host "2. Direct Ollama Tool Runner" -ForegroundColor Yellow
Write-Host "   - No Docker needed"
Write-Host "   - Command-line interface"
Write-Host "   - Direct Ollama with function calling"
Write-Host ""

if ($SkipDocker) {
    $choice = 2
} else {
    $choice = Read-Host "Select option (1 or 2)"
}

Write-Host ""

# ============================================================================
# Docker Setup
# ============================================================================

if ($choice -eq "1" -or $choice -eq 1) {
    Write-Header "Setting up Open WebUI with Docker"

    # Check Docker
    Write-Host "Checking Docker installation..." -ForegroundColor Yellow
    try {
        $docker_version = docker --version
        Write-Status "Docker found: $docker_version" "Green"
    }
    catch {
        Write-Host "❌ Docker not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
        Write-Host ""
        Write-Host "Or use the Direct Ollama Tool Runner instead:"
        Write-Host "  .\scripts\windows\start_open_webui.ps1 -UseDirectOllama"
        exit 1
    }

    Write-Host ""

    # Check if container already exists
    Write-Host "Checking for existing Open WebUI container..." -ForegroundColor Yellow
    $existing = docker ps -a --filter "name=open-webui" --format "{{.Names}}"

    if ($existing) {
        Write-Status "Found existing container: $existing" "Yellow"
        Write-Host ""
        Write-Host "Stopping and removing existing container..." -ForegroundColor Yellow
        docker stop open-webui 2>$null | Out-Null
        docker rm open-webui 2>$null | Out-Null
        Write-Status "Removed old container" "Green"
        Write-Host ""
    }

    # Pull image
    Write-Host "Pulling latest Open WebUI image..." -ForegroundColor Yellow
    docker pull ghcr.io/open-webui/open-webui:latest
    Write-Status "Image pulled successfully" "Green"

    Write-Host ""

    # Start container
    Write-Header "Starting Open WebUI Container"

    Write-Host "Command:"
    Write-Host "docker run -d --name open-webui -p 3000:8080 " -NoNewline -ForegroundColor Gray
    Write-Host "-e OLLAMA_API_BASE_URL=http://host.docker.internal:11434 " -NoNewline -ForegroundColor Gray
    Write-Host "ghcr.io/open-webui/open-webui:latest" -ForegroundColor Gray

    Write-Host ""
    Write-Host "Starting container..." -ForegroundColor Yellow

    docker run -d `
        --name open-webui `
        -p 3000:8080 `
        -e OLLAMA_API_BASE_URL=http://host.docker.internal:11434 `
        -e OLLAMA_BASE_URL=http://host.docker.internal:11434 `
        ghcr.io/open-webui/open-webui:latest

    if ($LASTEXITCODE -eq 0) {
        Write-Status "Open WebUI container started successfully" "Green"
    }
    else {
        Write-Host "❌ Failed to start Open WebUI container!" -ForegroundColor Red
        exit 1
    }

    Write-Host ""

    # Wait for startup
    Write-Host "Waiting for Open WebUI to start..." -ForegroundColor Yellow
    for ($i = 1; $i -le 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -ErrorAction SilentlyContinue -TimeoutSec 1
            Write-Status "Open WebUI is ready!" "Green"
            break
        }
        catch {
            Write-Host "  ⏳ Attempt $i/30..." -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }
    }

    Write-Header "Open WebUI Setup Complete!"

    Write-Host "Access Open WebUI:" -ForegroundColor Cyan
    Write-Host "  → http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""

    Write-Host "Setup Steps:" -ForegroundColor Cyan
    Write-Host "  1. Open http://localhost:3000 in your browser"
    Write-Host "  2. Sign up with an account"
    Write-Host "  3. Go to Settings → Models"
    Write-Host "  4. Select 'llama3.2:3b' (or your preferred model)"
    Write-Host "  5. Go to Settings → Functions"
    Write-Host "  6. Add tool definitions from: config/open_webui_tools.json"
    Write-Host ""

    Write-Host "Quick Start:" -ForegroundColor Cyan
    Write-Host "  In Open WebUI chat, type:"
    Write-Host "  'Create a YouTube script about procrastination'"
    Write-Host ""

    Write-Host "Docker Commands:" -ForegroundColor Gray
    Write-Host "  View logs: docker logs open-webui"
    Write-Host "  Stop:      docker stop open-webui"
    Write-Host "  Start:     docker start open-webui"
    Write-Host "  Remove:    docker rm open-webui"
    Write-Host ""
}

# ============================================================================
# Direct Ollama Tool Runner
# ============================================================================

elseif ($choice -eq "2" -or $choice -eq 2) {
    Write-Header "Starting Direct Ollama Tool Runner"

    Write-Host "This provides full orchestration via Ollama without Open WebUI." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Features:" -ForegroundColor Yellow
    Write-Host "  ✓ Direct Ollama function calling"
    Write-Host "  ✓ No Docker required"
    Write-Host "  ✓ Command-line interface"
    Write-Host "  ✓ Full access to all operations"
    Write-Host ""

    Write-Host "Starting tool runner..." -ForegroundColor Yellow
    Write-Host ""

    Set-Location "C:\ShadowEmpire-Git"

    # Verify Ollama is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -ErrorAction SilentlyContinue
        Write-Status "Ollama is running" "Green"
    }
    catch {
        Write-Host "❌ Ollama is not running!" -ForegroundColor Red
        Write-Host "   Please start Ollama first:"
        Write-Host "   ollama serve"
        exit 1
    }

    Write-Host ""

    & node operator/ollama_tool_runner.js
    exit $LASTEXITCODE
}

else {
    Write-Host "Invalid option. Please select 1 or 2." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setup complete! Shadow Operator Core is ready for orchestration." -ForegroundColor Green
Write-Host ""
