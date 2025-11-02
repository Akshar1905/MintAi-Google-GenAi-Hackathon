# PowerShell build script for Google Cloud Run deployment
# Usage: .\build-cloud-run.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔨 Building MintAi for Google Cloud Run..." -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
try {
    $null = gcloud --version 2>&1
} catch {
    Write-Host "❌ ERROR: gcloud CLI not found!" -ForegroundColor Red
    Write-Host "   Please install Google Cloud SDK: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "   Please create a .env file with all required variables" -ForegroundColor Red
    Write-Host "   You can copy .docker.env.example to .env as a template" -ForegroundColor Yellow
    exit 1
}

# Check if cloudbuild.yaml exists
if (-not (Test-Path cloudbuild.yaml)) {
    Write-Host "❌ ERROR: cloudbuild.yaml not found!" -ForegroundColor Red
    Write-Host "   Please ensure cloudbuild.yaml exists in the current directory" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Loading variables from .env file..." -ForegroundColor Green

# Read .env file and set environment variables
$requiredVars = @(
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID"
)

# Optional but recommended vars (for API features)
$optionalVars = @(
    "VITE_GEMINI_API_KEY",
    "VITE_YOUTUBE_API_KEY",
    "VITE_QUOTE_API",
    "VITE_MEME_API"
)

$missingVars = @()

Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"').Trim("'")
        
        # Only set if value is not empty
        if ($value) {
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Validate required variables
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if (-not $value -or $value -eq "") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ ERROR: Missing required environment variables:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please add these variables to your .env file and try again." -ForegroundColor Yellow
    exit 1
}

# Validate Firebase API key format (starts with AIzaSy)
$firebaseKey = [Environment]::GetEnvironmentVariable("VITE_FIREBASE_API_KEY", "Process")
if ($firebaseKey -and -not $firebaseKey.StartsWith("AIzaSy")) {
    Write-Host "⚠️  WARNING: VITE_FIREBASE_API_KEY doesn't look like a valid Firebase API key" -ForegroundColor Yellow
    Write-Host "   Firebase API keys typically start with 'AIzaSy'" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "✅ All required variables found" -ForegroundColor Green

# Debug: Show which variables were loaded (values hidden)
Write-Host "Loaded environment variables:" -ForegroundColor Gray
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    $displayValue = if ($value) { 
        "$($value.Substring(0, [Math]::Min(10, $value.Length)))..." 
    } else { 
        "(empty)" 
    }
    Write-Host "  $var = $displayValue" -ForegroundColor DarkGray
}
Write-Host ""

# Build and push to Google Container Registry
Write-Host "🏗️  Building and pushing Docker image..." -ForegroundColor Cyan
Write-Host "   This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

# Build substitutions string for gcloud
# Note: Values should not contain commas as they're used as separators
Write-Host "Building substitutions..." -ForegroundColor Gray

$substitutionPairs = @()
$substitutionPairs += "_FIREBASE_API_KEY=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_API_KEY', 'Process'))"
$substitutionPairs += "_AUTH_DOMAIN=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_AUTH_DOMAIN', 'Process'))"
$substitutionPairs += "_PROJECT_ID=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_PROJECT_ID', 'Process'))"
$substitutionPairs += "_STORAGE_BUCKET=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_STORAGE_BUCKET', 'Process'))"
$substitutionPairs += "_MESSAGING_SENDER_ID=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_MESSAGING_SENDER_ID', 'Process'))"
$substitutionPairs += "_APP_ID=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_APP_ID', 'Process'))"
$substitutionPairs += "_MEASUREMENT_ID=$([Environment]::GetEnvironmentVariable('VITE_FIREBASE_MEASUREMENT_ID', 'Process'))"
$substitutionPairs += "_GEMINI_API_KEY=$([Environment]::GetEnvironmentVariable('VITE_GEMINI_API_KEY', 'Process'))"
$substitutionPairs += "_YOUTUBE_API_KEY=$([Environment]::GetEnvironmentVariable('VITE_YOUTUBE_API_KEY', 'Process'))"
$substitutionPairs += "_QUOTE_API=$([Environment]::GetEnvironmentVariable('VITE_QUOTE_API', 'Process'))"
$substitutionPairs += "_MEME_API=$([Environment]::GetEnvironmentVariable('VITE_MEME_API', 'Process'))"
$substitutionPairs += "_API_BASE_URL=$([Environment]::GetEnvironmentVariable('VITE_API_BASE_URL', 'Process'))"
$substitutionPairs += "_USE_BACKEND_API=$([Environment]::GetEnvironmentVariable('VITE_USE_BACKEND_API', 'Process'))"

$substitutions = $substitutionPairs -join ","

# Debug: Show substitution keys (not values for security)
Write-Host "Substitution keys prepared: $($substitutionPairs.Count)" -ForegroundColor Gray

# Debug: Verify first substitution has a value (check key format only)
$firstSub = $substitutionPairs[0]
if ($firstSub -match "^([^=]+)=") {
    $firstKey = $matches[1]
    Write-Host "First substitution key: $firstKey" -ForegroundColor Gray
    $hasValue = $firstSub.Length -gt $firstKey.Length + 1
    if (-not $hasValue) {
        Write-Host "⚠️  WARNING: First substitution appears to have no value!" -ForegroundColor Yellow
        Write-Host "   Make sure your .env file has all variables set" -ForegroundColor Yellow
    }
}

Write-Host ""

try {
    Write-Host "Submitting build to Google Cloud Build..." -ForegroundColor Cyan
    gcloud builds submit `
        --config cloudbuild.yaml `
        --substitutions $substitutions

    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }

    Write-Host ""
    Write-Host "✅ Build complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy to Cloud Run, run:" -ForegroundColor Cyan
    Write-Host "  gcloud run deploy mintai-app \" -ForegroundColor White
    Write-Host "    --image gcr.io/mintai-476913/mintai-app \" -ForegroundColor White
    Write-Host "    --platform managed \" -ForegroundColor White
    Write-Host "    --region asia-south1 \" -ForegroundColor White
    Write-Host "    --allow-unauthenticated" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check the build logs above for more details." -ForegroundColor Yellow
    exit 1
}

