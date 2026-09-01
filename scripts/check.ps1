$ErrorActionPreference = "Stop"
$env:PYTHONUTF8 = "1"

Write-Output "[1/5] GenVM lint"
& ".venv\Scripts\genvm-lint.exe" check "contracts\scopeseal_accord.py"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "[2/5] Python direct and receipt tests"
& ".venv\Scripts\python.exe" -m pytest tests -q
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "[3/5] Deployment helper tests"
& node --test "tests/deployment/*.test.mjs"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "[4/5] Frontend tests and typecheck"
Push-Location frontend
try {
  & npm test
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  & npm run typecheck
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}

Write-Output "[5/5] Production frontend build"
Push-Location frontend
try {
  & npm run build
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}
