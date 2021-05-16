#!/usr/bin/env bash

npm run build
npm run export
touch out/.nojekyll
git add .
git commit -am "New Build"
git subtree push --prefix out origin master
git push