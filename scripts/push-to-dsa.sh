#!/usr/bin/env bash
set -e

# === CONFIGURATION ===
REMOTE_URL="https://github.com/NatsuMarvel/DSA.git"
BRANCH="${1:-my-feature-branch}"   # default branch name if not provided
BASE="${2:-main}"                  # base branch to merge into
REMOTE_NAME="target-remote"

# Step 1: Ensure branch exists locally
if git show-ref --verify --quiet refs/heads/$BRANCH; then
  echo "Branch $BRANCH already exists locally"
else
  echo "Creating branch $BRANCH from current HEAD"
  git checkout -b $BRANCH
fi

# Step 2: Stage all changes
git add .

# Step 3: Commit changes
git commit -m "Add local project code" || echo "No changes to commit"

# Step 4: Add or update remote
if git remote get-url $REMOTE_NAME >/dev/null 2>&1; then
  echo "Updating remote $REMOTE_NAME URL"
  git remote set-url $REMOTE_NAME "$REMOTE_URL"
else
  echo "Adding remote $REMOTE_NAME -> $REMOTE_URL"
  git remote add $REMOTE_NAME "$REMOTE_URL"
fi

# Step 5: Push branch
git push -u $REMOTE_NAME $BRANCH

# Step 6: Create PR using GitHub CLI
parse_repo() {
  url="$1"
  url=${url%.git}
  if [[ "$url" =~ github.com[:/](.+)/(.+)$ ]]; then
    echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
  else
    echo ""
  fi
}

REPO=$(parse_repo "$REMOTE_URL")

if [ -n "$REPO" ] && command -v gh >/dev/null 2>&1; then
  echo "Creating a pull request from $BRANCH into $BASE"
  gh pr create --repo "$REPO" --head "$REMOTE_NAME:$BRANCH" --base "$BASE" \
    --title "Add local project code" \
    --body "This PR adds the local project code to the repository."
  echo "PR created successfully."
else
  echo "PR not created automatically. You can run this manually:"
  echo "  gh pr create --repo $REPO --head $REMOTE_NAME:$BRANCH --base $BASE --title 'Add local project code' --body 'This PR adds the local project code.'"
fi

echo "Done."
