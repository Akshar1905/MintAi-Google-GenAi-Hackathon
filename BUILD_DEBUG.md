# Debugging Build Substitutions Issue

## Problem
Build args are empty when passed from `gcloud builds submit --substitutions`

## Solution

The issue is that substitutions might not be passed correctly if:
1. Empty values in cloudbuild.yaml override command-line substitutions
2. Substitutions string format is incorrect

## Quick Test

Run this to see what substitutions are being received:

```powershell
# Test if substitutions are being passed correctly
$testSub = "_FIREBASE_API_KEY=test123,_PROJECT_ID=test-project"
gcloud builds submit --config cloudbuild.yaml --substitutions $testSub --dry-run
```

## Fix Applied

1. Removed empty default values from substitutions (or they might override)
2. Added better error handling in build script
3. Added debug output to show substitution count

## Manual Build Test

To verify your .env file is loading correctly, test locally first:

```powershell
# Load .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"').Trim("'")
        if ($value) {
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Verify
[Environment]::GetEnvironmentVariable('VITE_FIREBASE_API_KEY', 'Process')
```

If this shows empty, your .env file has an issue.

## Alternative: Use Secret Manager

For production, consider using Google Secret Manager instead of substitutions:

```yaml
availableSecrets:
  secretManager:
    - versionName: projects/PROJECT_ID/secrets/firebase-api-key/versions/latest
      env: 'FIREBASE_API_KEY'
```

Then reference in Dockerfile as ENV from the secret.

