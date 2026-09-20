$ErrorActionPreference = "Stop"
$env:PYTHONUTF8 = "1"
$env:GENVM_VERSION = "v0.6.0-rc5"
$env:SCOPESEAL_GLTEST_CACHE_DIR = Join-Path $env:TEMP "scopeseal-gltest-cache"
$Python = if (Test-Path ".venv-rc\Scripts\python.exe") { ".venv-rc\Scripts\python.exe" } else { ".venv\Scripts\python.exe" }

Write-Output "[1/5] GenVM lint"
& $Python "scripts\genvm_lint_rc.py" check "contracts\scopeseal_accord.py"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Output "[2/5] Python direct and receipt tests"
& $Python -m pytest tests -q
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
  $BuildOutput = Join-Path $env:TEMP "scopeseal-v2-build"
  & ".\node_modules\.bin\vite.cmd" build --outDir $BuildOutput --emptyOutDir
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}
