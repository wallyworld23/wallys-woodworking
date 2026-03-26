#!/bin/bash

# deploy.sh — Wally's Woodworking
# Usage: ./deploy.sh "your message here"
# Example: ./deploy.sh "Add new gallery photos"

MESSAGE=${1:-"Update site content"}

echo ""
echo "🪵  Wally's Woodworking — Deploy"
echo "--------------------------------"

# Make sure we're on develop
git checkout develop

# Stage all changes
git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo "✓ Nothing new to commit — everything is already up to date."
  exit 0
fi

# Commit with the provided message
git commit -m "$MESSAGE"

# Push to GitHub
git push

echo ""
echo "✓ Done! Changes are live on GitHub (develop branch)."
echo ""
echo "When you're ready to go live, merge develop → main on GitHub."
echo ""
