# PowerShell build script for MintAi Docker image
# Usage: .\build-with-env.ps1

Write-Host "🔨 Building MintAi Docker image with environment variables..." -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (Test-Path .env) {
    Write-Host "📄 Loading variables from .env file..." -ForegroundColor Green
    
    # Read .env file and set environment variables
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
} else {
    Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "   Using environment variables from current shell" -ForegroundColor Yellow
    Write-Host ""
}

# Build Docker image
Write-Host "🏗️  Building Docker image..." -ForegroundColor Cyan

$buildArgs = @(
    "--build-arg", "VITE_FIREBASE_API_KEY=$env:VITE_FIREBASE_API_KEY",
    "--build-arg", "VITE_FIREBASE_AUTH_DOMAIN=$env:VITE_FIREBASE_AUTH_DOMAIN",
    "--build-arg", "VITE_FIREBASE_PROJECT_ID=$env:VITE_FIREBASE_PROJECT_ID",
    "--build-arg", "VITE_FIREBASE_STORAGE_BUCKET=$env:VITE_FIREBASE_STORAGE_BUCKET",
    "--build-arg", "VITE_FIREBASE_MESSAGING_SENDER_ID=$env:VITE_FIREBASE_MESSAGING_SENDER_ID",
    "--build-arg", "VITE_FIREBASE_APP_ID=$env:VITE_FIREBASE_APP_ID",
    "--build-arg", "VITE_FIREBASE_MEASUREMENT_ID=$env:VITE_FIREBASE_MEASUREMENT_ID",
    "--build-arg", "VITE_GEMINI_API_KEY=$env:VITE_GEMINI_API_KEY",
    "--build-arg", "VITE_YOUTUBE_API_KEY=$env:VITE_YOUTUBE_API_KEY",
    "--build-arg", "VITE_API_BASE_URL=$env:VITE_API_BASE_URL",
    "--build-arg", "VITE_USE_BACKEND_API=$env:VITE_USE_BACKEND_API",
    "-t", "mintai:latest",
    "."
)

docker build @buildArgs

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the container:" -ForegroundColor Cyan
Write-Host "  docker run -d -p 8080:8080 --name mintai mintai:latest"
Write-Host ""
Write-Host "Or use docker-compose:" -ForegroundColor Cyan
Write-Host "  docker-compose --env-file .env up"

