#!/bin/bash
cd /Users/jimmyhmiller/Documents/Code/jimmyhmiller.github.io

branch=$(git rev-parse --abbrev-ref HEAD)
status=$(git status --porcelain | head -10)

echo '['
echo "  {\"key\": \"Branch\", \"value\": \"$branch\"}"

if [ -n "$status" ]; then
  echo ","
  git status --porcelain | head -10 | awk '{
    status = $1
    file = substr($0, 4)
    if (status == "??") status = "untracked"
    else if (status == "M") status = "modified"
    else if (status == "A") status = "added"
    else if (status == "D") status = "deleted"
    printf "  {\"key\": \"%s\", \"value\": \"%s\"}", file, status
  }' | paste -sd ',' -
fi

echo ""
echo ']'
