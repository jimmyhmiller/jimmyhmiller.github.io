#!/bin/bash

# Compare local RSS feed with production RSS feed

set -e

echo "Fetching production RSS feed..."
curl -sL https://jimmyhmiller.github.io/feed.xml > /tmp/prod-feed.xml

echo "Regenerating local RSS feed..."
NODE_ENV=production npm run build > /dev/null 2>&1

echo ""
echo "Comparing RSS feed item order..."
echo "================================"
echo ""

echo "Production RSS items:"
grep '<title><!\[CDATA\[' /tmp/prod-feed.xml | tail -n +2 | nl

echo ""
echo "Local RSS items:"
grep '<title><!\[CDATA\[' public/feed.xml | tail -n +2 | nl

echo ""
echo "Differences (if any):"
diff -u <(grep '<title><!\[CDATA\[' /tmp/prod-feed.xml | tail -n +2) <(grep '<title><!\[CDATA\[' public/feed.xml | tail -n +2) || true

echo ""
echo "RSS comparison complete!"
