#!/usr/bin/env bash
# Builds the site, starts a demo server (:3000) and a test-destination server (:3001),
# runs tests/e2e.mjs, then stops both servers.
set -euo pipefail
cd "$(dirname "$0")/.."
npx next build > /dev/null
rm -rf .data
node node_modules/next/dist/bin/next start -p 3000 > /dev/null 2>&1 & demo=$!
INTAKE_DESTINATION=local-test node node_modules/next/dist/bin/next start -p 3001 > /dev/null 2>&1 & live=$!
trap 'kill $demo $live 2>/dev/null || true' EXIT
for _ in $(seq 1 30); do
  curl -sf -o /dev/null http://localhost:3000/ && curl -sf -o /dev/null http://localhost:3001/ && break
  sleep 1
done
node tests/e2e.mjs
