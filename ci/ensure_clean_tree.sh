#!/usr/bin/env bash

# Check for new files.
if [[ -z $(git ls-files --exclude-standard --others) ]]; then
  echo "Error: Code and docs are out of sync. Printing output of 'git status' for reference." >&2
  git status
  exit 1
fi

# Check for modified files.
if [[ -z $(git diff-files --quiet) ]]; then
  echo "Error: Code and docs are out of sync. Printing output of 'git status' for reference." >&2
  git status
  exit 1
fi
