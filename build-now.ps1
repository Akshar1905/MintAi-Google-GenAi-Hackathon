# Quick build script with hardcoded values
# Run this: .\build-now.ps1

Write-Host "Building MintAi with provided credentials..." -ForegroundColor Cyan
Write-Host ""

$substitutions = "_FIREBASE_API_KEY=AIzaSyBm5kiQRDNE7AVqP5NKPvQw_50urX9ds2k,_AUTH_DOMAIN=mintai-a8150.firebaseapp.com,_PROJECT_ID=mintai-a8150,_STORAGE_BUCKET=mintai-a8150.appspot.com,_MESSAGING_SENDER_ID=631540909763,_APP_ID=1:631540909763:web:d501089d9ae1f109f5c476,_MEASUREMENT_ID=G-K40051YNE8,_GEMINI_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo,_YOUTUBE_API_KEY=AIzaSyC4jnNa7-9ax7kJgasZJLT6NBtMXI3k4Uo,_QUOTE_API=https://zenquotes.io/api/random,_MEME_API=https://meme-api.com/gimme,_API_BASE_URL=https://mintai-476913.el.r.appspot.com,_USE_BACKEND_API=true"

gcloud builds submit --config cloudbuild.yaml --substitutions $substitutions

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deploy to Cloud Run:" -ForegroundColor Cyan
    Write-Host "  gcloud run deploy mintai-app `" -ForegroundColor White
    Write-Host "    --image gcr.io/mintai-476913/mintai-app:latest `" -ForegroundColor White
    Write-Host "    --platform managed `" -ForegroundColor White
    Write-Host "    --region asia-south1 `" -ForegroundColor White
    Write-Host "    --allow-unauthenticated `" -ForegroundColor White
    Write-Host "    --port 8080" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Build failed!" -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
}

