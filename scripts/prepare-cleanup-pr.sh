#!/usr/bin/env bash
set -e

BRANCH=fix/remove-committed-secrets

echo "Creating branch $BRANCH"
git checkout -b $BRANCH

echo "Staging cleanup files"
git add backend/.env backend/.env.example .gitignore docs/rotate-db-password.md

echo "Committing changes"
git commit -m "chore: remove committed DB credentials, add .gitignore and rotation instructions"

echo "Pushing branch and creating PR (if you have gh CLI installed, it will open a PR)"
git push -u origin $BRANCH

if command -v gh >/dev/null 2>&1; then
  gh pr create --fill
else
  echo "'gh' CLI not found. Create a PR in GitHub UI from branch $BRANCH to main."
fi