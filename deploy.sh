#!/usr/bin/env bash
# deploy.sh — redeploy Vocatio on Hostinger (Passenger Node.js app)
# Run from the app root over SSH: `bash deploy.sh`
set -euo pipefail

cd "$(dirname "$0")"

echo "==> git pull"
git pull --ff-only

# Only reinstall if package-lock.json changed in this pull.
if git diff --name-only HEAD@{1} HEAD 2>/dev/null | grep -qx 'package-lock.json'; then
  echo "==> package-lock.json changed — npm ci"
  npm ci
else
  echo "==> deps unchanged — skipping install"
fi

echo "==> next build"
npm run build

echo "==> signal Passenger restart"
mkdir -p tmp
touch tmp/restart.txt

echo "==> done. Open uaisavvy.com to verify."
